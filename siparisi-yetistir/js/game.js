/* game.js: oyun durumu ve kuralları (çizim ve DOM'dan bağımsız) */
(function () {
  'use strict';
  var MM = window.MM, C = MM.CONFIG, L = C.LAYOUT, FX = MM.FX;

  var FALL = 0.28;          // malzemenin düşme süresi
  var SERVE = 0.55;         // servis animasyonu
  var INTRO = 0.5;          // yeni sipariş giriş animasyonu
  var CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  function makeCode() {
    var s = 'MM-';
    for (var i = 0; i < 4; i++) s += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    return s;
  }

  var G = (MM.Game = {
    FALL: FALL, SERVE_DUR: SERVE, INTRO_DUR: INTRO,

    state: 'menu',          // menu | countdown | playing | paused | over
    prevState: 'menu',
    time: C.GAME_SECONDS, score: 0, completed: 0, streak: 0, bestStreak: 0,
    orderN: 0, order: null, prevKey: '', prevDish: '',
    stack: [], baseY: L.plateY - 4,
    serve: null, introT: 99, cd: 0,
    shake: 0, flash: 0, scorePop: 0, menuT: 0, menuPop: 0, menuSeq: null, menuNext: 0,
    timeHits: 0,            // süre cezası sayacı (arayüz animasyonu için)
    coupon: null, banner: null,
    result: null,

    reset: function () {
      this.time = C.GAME_SECONDS; this.score = 0; this.completed = 0; this.streak = 0; this.bestStreak = 0;
      this.orderN = 0; this.prevKey = ''; this.prevDish = ''; this.stack = []; this.baseY = L.plateY - 4;
      this.serve = null; this.shake = 0; this.flash = 0; this.result = null; this.scorePop = 0;
      this.coupon = null; this.banner = null; this.timeHits = 0;
      FX.clear();
    },

    start: function () {
      this.reset();
      MM.Mascot.reset(); this.lowSaid = false; this.nearLo = false; this.nearHi = false;
      this.nextOrder();
      this.state = 'countdown';
      this.cd = C.COUNTDOWN_STEP * 4;
    },

    nextOrder: function () {
      this.order = MM.Orders.create(this.orderN, { key: this.prevKey, dish: this.prevDish });
      this.prevKey = this.order.key; this.prevDish = this.order.dish;
      this.orderN++;
      this.stack = []; this.baseY = L.plateY - 4;
      this.introT = 0;
    },

    pause: function () {
      if (this.state === 'playing' || this.state === 'countdown') { this.prevState = this.state; this.state = 'paused'; }
    },
    resume: function () { if (this.state === 'paused') this.state = this.prevState; },

    toMenu: function () {
      this.state = 'menu'; this.order = null; this.stack = []; this.serve = null; this.banner = null; FX.clear();
      this.newMenuDemo();
    },

    /* Ana menüde dönen örnek yemek */
    newMenuDemo: function () {
      var o = MM.Orders.create(3 + Math.floor(Math.random() * 3), { dish: this.menuDish });
      this.menuSeq = o.seq; this.menuDish = o.dish; this.menuPop = 1; this.menuNext = this.menuT + 3.6;
      FX.burst(L.stackCX, 450, 12, ['#ffd23f', '#fff3b0', '#ffffff'], { speed: 240, size: 7, max: 0.8 });
    },

    /* Geri sayım göstergesi: { text, p } */
    countdown: function () {
      var step = C.COUNTDOWN_STEP, el = step * 4 - this.cd, idx = Math.min(3, Math.floor(el / step));
      return { text: ['3', '2', '1', 'BAŞLA!'][idx], p: Math.min(1, (el - idx * step) / step) };
    },

    /* Oyuncu bir malzemeye dokundu. 'ok' | 'wrong' | null döner. */
    tap: function (key) {
      if (this.state !== 'playing' || this.serve || !this.order) return null;
      var o = this.order, need = o.seq[o.idx], ing = C.INGREDIENTS[key], cx = L.stackCX, S = C.SCORE;
      if (key === need) {
        this.stack.push({ key: key, age: 0, y: this.baseY, tilt: (Math.random() - 0.5) * 0.34, landed: false });
        this.baseY -= ing.step;
        o.idx++;
        this.addScore(S.correct);
        MM.Audio.play('tap', o.idx);
        MM.Mascot.say('tap');
        FX.text(cx + 120 + Math.random() * 30, this.baseY - 40, '+' + S.correct, { size: 34, color: '#b6ff7a' });
        if (o.idx >= o.seq.length) this.completeOrder();
        return 'ok';
      }
      // yanlış: puan ve SÜRE kaybı
      o.mistakes++;
      this.addScore(S.wrong);
      this.time = Math.max(0, this.time - C.TIME.penalty);
      this.timeHits++;
      this.shake = 1; this.flash = 1;
      MM.Audio.play('wrong');
      MM.Mascot.say('wrong');
      if (this.streak > 1) FX.text(cx, 420, 'KOMBO KIRILDI', { size: 36, color: '#ff9a8a' });
      this.streak = 0;
      FX.text(cx, 330, '-' + C.TIME.penalty + ' SN', { size: 58, color: '#ff4a3a', max: 1.2 });
      FX.text(cx - 110 - Math.random() * 20, this.baseY - 30, String(S.wrong), { size: 36, color: '#ff8a7a' });
      FX.burst(cx, this.baseY - 20, 10, ['#ff5a4a', '#ff9a8a', '#ffffff'], { shape: 'rect', speed: 220, size: 6, up: 80 });
      return 'wrong';
    },

    addScore: function (n) {
      this.score = Math.max(0, this.score + n);
      this.scorePop = 1;
      if (!this.coupon && this.score >= C.REWARD.score) this.winCoupon();
      else if (!this.coupon && this.state === 'playing') {
        var pr = this.score / C.REWARD.score;
        if (pr >= 0.9 && !this.nearHi) { this.nearHi = true; this.nearLo = true; MM.Mascot.say('near'); }
        else if (pr >= 0.75 && !this.nearLo) { this.nearLo = true; MM.Mascot.say('near'); }
      }
    },

    winCoupon: function () {
      var list = C.REWARD.list, text = list[Math.floor(Math.random() * list.length)];
      this.coupon = { text: text, code: makeCode(), score: C.REWARD.score };
      this.banner = { t: 0, text: 'İNDİRİM KAZANDIN!', sub: text };
      MM.Audio.play('coupon');
      MM.Mascot.say('coupon');
      FX.confetti(L.stackCX, 400, 70);
    },

    /* Müşteri sabrı bitti: sipariş boşa gitti. */
    failOrder: function () {
      var cx = L.stackCX;
      this.serve = { t: 0, fail: true };
      this.streak = 0;
      this.time = Math.max(0, this.time - C.TIME.failPenalty);
      this.timeHits++; this.shake = 1; this.flash = 1;
      FX.text(cx, 400, 'MÜŞTERİ KIZDI!', { size: 46, color: '#ff7a6a', max: 1.2 });
      FX.text(cx, 454, '-' + C.TIME.failPenalty + ' SN', { size: 44, color: '#ff4a3a', max: 1.2 });
      FX.burst(cx, 500, 14, ['#ff5a4a', '#ff9a8a'], { shape: 'rect', speed: 260, size: 7, up: 100 });
      MM.Audio.play('fail');
      MM.Mascot.say('fail');
    },

    completeOrder: function () {
      var o = this.order, S = C.SCORE, perfect = o.mistakes === 0, gain = S.order, cx = L.stackCX;
      // hız bonusu: sabrın ne kadarı kaldıysa (yarıdan fazlası = tam bonus)
      var frac = o.left / o.patience, speed = Math.round(S.speedMax * Math.max(0, Math.min(1, (frac - 0.1) / 0.45)));
      gain += speed;
      if (perfect) { gain += S.perfect; this.streak++; if (this.streak > this.bestStreak) this.bestStreak = this.streak; }
      else this.streak = 0;
      var combo = this.streak >= 2 ? Math.min(S.comboMax, S.comboStep * (this.streak - 1)) : 0;
      gain += combo;
      if (o.golden) gain *= C.GOLDEN.mult;
      this.completed++;
      this.serve = { t: 0 };
      var sub = '+' + gain + (combo ? '  (KOMBO +' + combo + ')' : '') + (speed >= S.speedMax ? '  HIZLI!' : '');
      MM.Audio.play(o.golden ? 'golden' : 'serve');
      MM.Mascot.say(o.golden ? 'golden' : (speed >= S.speedMax && perfect ? 'fast' : (this.streak >= 3 ? 'combo' : 'ok')));
      FX.confetti(cx, this.baseY - 80, o.golden ? 70 : 44);
      FX.text(cx, 392, o.golden ? 'ALTIN SİPARİŞ x' + C.GOLDEN.mult + '!' : (perfect ? 'MÜKEMMEL!' : 'SERVİS!'), { size: o.golden ? 46 : 54, color: o.golden ? '#ffe14a' : '#ffd23f', max: 1.2 });
      FX.text(cx, 448, sub, { size: 32, color: '#ffffff', max: 1.2 });
      if (perfect && C.TIME.perfectBonus) {
        var before = this.time;
        this.time = Math.min(C.TIME.max, this.time + C.TIME.perfectBonus);
        if (this.time > before) FX.text(cx, 496, '+' + C.TIME.perfectBonus + ' SN', { size: 34, color: '#7ee8ff', max: 1.2 });
      }
      this.addScore(gain);        // kupon kontrolü en sonda: afiş diğer yazıların üstünde kalsın
    },

    finish: function () {
      this.state = 'over';
      this.serve = null;
      MM.Audio.play('over');
      var isNew = MM.Storage.submit(this.score, this.coupon);
      this.result = { score: this.score, orders: this.completed, best: MM.Storage.get().best, isNew: isNew, bestStreak: this.bestStreak, coupon: this.coupon };
      if (isNew && this.score > 0) FX.confetti(L.stackCX, 520, 60);
    },

    onLand: function (it) {
      var ing = C.INGREDIENTS[it.key];
      FX.burst(L.stackCX, it.y - ing.h * 0.45, 7, ['#ffd23f', '#fff3b0', '#ffffff'], { speed: 200, size: 6, max: 0.5, up: 60 });
      FX.burst(L.stackCX - ing.w * 0.4, it.y - 4, 3, ['#ffffff'], { shape: 'circle', speed: 90, size: 4, max: 0.35, g: 0 });
      FX.burst(L.stackCX + ing.w * 0.4, it.y - 4, 3, ['#ffffff'], { shape: 'circle', speed: 90, size: 4, max: 0.35, g: 0 });
    },

    update: function (dt) {
      this.menuT += dt;
      if (this.state === 'paused') return;
      MM.Mascot.update(dt);
      FX.update(dt);
      this.shake = Math.max(0, this.shake - dt * 3.2);
      this.flash = Math.max(0, this.flash - dt * 2.6);
      this.scorePop = Math.max(0, this.scorePop - dt * 4);
      this.menuPop = Math.max(0, this.menuPop - dt * 3);
      this.introT += dt;
      if (this.banner) { this.banner.t += dt; if (this.banner.t > 3.2) this.banner = null; }

      for (var i = 0; i < this.stack.length; i++) {
        var it = this.stack[i];
        it.age += dt;
        if (!it.landed && it.age >= FALL) { it.landed = true; this.onLand(it); }
      }

      if (this.state === 'menu') {
        if (!this.menuSeq || this.menuT >= this.menuNext) this.newMenuDemo();
        if (Math.random() < dt * 3) {
          FX.spawn({ x: 150 + Math.random() * 240, y: 600, vx: (Math.random() - 0.5) * 20, vy: -60 - Math.random() * 50, g: -10, size: 4 + Math.random() * 4, color: '#ffe9a6', shape: 'star', max: 1.6, rot: Math.random() * 6, vr: 2 });
        }
        return;
      }
      if (this.state === 'countdown') {
        this.cd -= dt;
        if (this.cd <= 0) { this.state = 'playing'; this.cd = 0; MM.Mascot.say('start'); }
        return;
      }
      if (this.state === 'playing') {
        var prevSec = Math.ceil(this.time);
        this.time = Math.max(0, this.time - dt);
        if (this.serve) {
          this.serve.t += dt;
          if (this.serve.t >= SERVE) { this.serve = null; if (this.time > 0) this.nextOrder(); }
        } else if (this.order) {
          // müşteri sabrı (giriş animasyonundan sonra işler)
          if (this.introT > C.PATIENCE.grace) {
            this.order.left -= dt;
            if (this.order.left <= 0) { this.order.left = 0; this.failOrder(); }
          }
          // altın sipariş parıltısı
          if (this.order.golden && Math.random() < dt * 12) {
            FX.spawn({ x: L.card.x + 20 + Math.random() * (L.card.w - 40), y: L.card.y + 10 + Math.random() * (L.card.h - 20), vx: (Math.random() - 0.5) * 20, vy: -30, g: 0, size: 5 + Math.random() * 5, color: '#ffe45c', shape: 'star', max: 0.7, rot: Math.random() * 6, vr: 4 });
          }
          // buhar: sıcak yemeklerde yığının tepesinden yükselir
          if (this.order.hot && this.stack.length && Math.random() < dt * 7) {
            FX.spawn({ x: L.stackCX + (Math.random() - 0.5) * 130, y: this.baseY - 50, vx: (Math.random() - 0.5) * 14, vy: -38 - Math.random() * 24, g: -14, size: 16 + Math.random() * 10, color: '#ffffff', shape: 'steam', max: 1.3 });
          }
        }
        if (this.time <= 5 && Math.ceil(this.time) !== prevSec && this.time > 0) MM.Audio.play('tick');
        if (this.time <= 10 && this.time > 0 && !this.lowSaid) { this.lowSaid = true; MM.Mascot.say('low'); }
        if (this.time <= 0) this.finish();
      }
    }
  });
})();
