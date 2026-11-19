/* mascot.js: oyun içi karakter. Ekranın solunda yarısı görünür, oyuncuyu tatlı sözlerle destekler. */
(function () {
  'use strict';
  var MM = window.MM, C = MM.CONFIG, E = MM.Ease;
  var FONT = '"Fredoka","Baloo 2","Trebuchet MS","Arial Rounded MT Bold",system-ui,sans-serif';

  /* Söylenecekler: tür başına rastgele biri seçilir. Buradan istediğiniz gibi değiştirin. */
  var MSG = {
    start:  ['Hadi başlayalım!', 'Hazır mısın şef?', 'Bu işi sen çözersin!'],
    tap:    ['Aferin!', 'Evet, o!', 'Tam üstüne!', 'Güzel gidiyor!'],
    ok:     ['Tebrikler!', 'Harika!', 'Eline sağlık şef!', 'Müşteri çok mutlu!', 'Süpersin!', 'Bayıldım buna!'],
    fast:   ['Işık hızı!', 'Vay be, çok hızlısın!', 'Ne hız ama!', 'Şimşek gibisin!'],
    golden: ['Altın sipariş! Parlıyorsun!', 'Vay, altın yaptın!'],
    combo:  ['Kombo geliyor!', 'Durdurulamıyorsun!', 'Seri devam!', 'Kombo kralı sensin!'],
    near:   ['Az kaldı!', 'Kupon çok yakın!', 'Biraz daha, yapabilirsin!', 'Az kaldı, pes etme!'],
    coupon: ['İndirim senin!', 'Yaşasın, kupon kazandın!', 'Başardın şef!'],
    wrong:  ['Olsun, tekrar dene!', 'Yavaş ol şef!', 'Hay aksi!', 'Dikkat dikkat!', 'Üzülme, devam!', 'Tüh, biraz acele ettin!'],
    fail:   ['Müşteri kızdı…', 'Biraz daha hızlı!', 'Bekletme beni…', 'Hızlan şefim!'],
    low:    ['Son 10 saniye!', 'Hadi hadi, az kaldı!', 'Sakin kal, yapabilirsin!']
  };
  /* Aynı anda tek balon var; yüksek öncelikli söz düşük olanın yerine geçer. */
  var PRIO = { tap: 0, start: 1, ok: 2, fast: 2, low: 2, combo: 3, golden: 3, wrong: 3, fail: 3, near: 4, coupon: 5 };
  var SAD = { wrong: 1, fail: 1 };

  var st = { text: '', t: 99, max: 1.9, prio: -1, last: '', age: 0, jump: 0, shake: 0, sad: 0 };

  MM.Mascot = {
    MSG: MSG,
    reset: function () { st.text = ''; st.t = 99; st.prio = -1; st.age = 0; st.jump = 0; st.shake = 0; st.sad = 0; },

    say: function (kind) {
      var list = MSG[kind]; if (!list) return;
      var active = st.t < st.max, p = PRIO[kind] || 0;
      if (kind === 'tap') { if (active || Math.random() > 0.16) return; }   // her dokunuşta konuşmasın
      else if (active && p < st.prio) return;
      var txt, guard = 0;
      do { txt = list[Math.floor(Math.random() * list.length)]; } while (txt === st.last && list.length > 1 && guard++ < 6);
      st.text = txt; st.last = txt; st.t = 0; st.prio = p; st.max = 1.9;
      if (SAD[kind]) { st.shake = 1; st.sad = 1; st.jump = 0; } else { st.jump = 1; st.sad = 0; }
    },

    update: function (dt) {
      st.age += dt; st.t += dt;
      st.jump = Math.max(0, st.jump - dt * 2.6); st.shake = Math.max(0, st.shake - dt * 2.2);
      if (st.t >= st.max) { st.prio = -1; st.sad = Math.max(0, st.sad - dt * 3); }
    },

    /* karakter: sol kenarda yarım görünür, zemin tezgâhın üstünde */
    draw: function (ctx, t) {
      var img = MM.Assets.get('mascot'); if (!img) return;
      var H = 218, W = H * img.width / img.height;
      var enter = E.outBack(E.clamp01(st.age / 0.7));
      var hide = W * 0.5;                                   // yarısı ekranın dışında
      var x = -W + hide * enter + (W - hide) * 0;          // girişte soldan kayar
      x = -W + (W - hide) * enter;
      var bob = Math.sin(t * 2.4) * 4, jump = Math.sin(st.jump * Math.PI) * 22;
      var y = 642 - H + bob - jump;
      var tilt = Math.sin(t * 1.6) * 0.025 + (st.sad ? -0.1 * st.sad : 0) + Math.sin(t * 50) * 0.03 * st.shake;
      var sq = 1 + Math.sin(st.jump * Math.PI) * 0.05;
      ctx.save();
      ctx.translate(x + W / 2, y + H);                     // ayakların olduğu alt orta nokta
      ctx.rotate(tilt); ctx.scale(1 / sq, sq);
      ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 6;
      ctx.drawImage(img, -W / 2, -H, W, H);
      ctx.restore();
    },

    /* konuşma balonu: karakterin kafasının üstünde */
    drawBubble: function (ctx) {
      if (st.t >= st.max || !st.text) return;
      var pop = E.outBack(E.clamp01(st.t / 0.2)), fade = st.t > st.max - 0.25 ? (st.max - st.t) / 0.25 : 1;
      var size = st.text.length > 22 ? 21 : 24;
      ctx.save(); ctx.font = '700 ' + size + 'px ' + FONT;
      var tw = ctx.measureText(st.text).width, w = Math.min(300, tw + 40), h = 50, bx = 12, by = 366, tipX = 64, tipY = 438;
      ctx.translate(tipX, tipY); ctx.scale(Math.max(0.01, pop), Math.max(0.01, pop)); ctx.translate(-tipX, -tipY);
      ctx.globalAlpha = Math.max(0, fade);
      ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#4a230b'; ctx.lineWidth = 3.5; ctx.lineJoin = 'round';
      ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 4;
      ctx.beginPath();
      var r = 18, x2 = bx + w, y2 = by + h;
      ctx.moveTo(bx + r, by); ctx.lineTo(x2 - r, by); ctx.quadraticCurveTo(x2, by, x2, by + r);
      ctx.lineTo(x2, y2 - r); ctx.quadraticCurveTo(x2, y2, x2 - r, y2);
      ctx.lineTo(bx + 62, y2); ctx.lineTo(tipX, tipY); ctx.lineTo(bx + 34, y2);          // kuyruk
      ctx.lineTo(bx + r, y2); ctx.quadraticCurveTo(bx, y2, bx, y2 - r);
      ctx.lineTo(bx, by + r); ctx.quadraticCurveTo(bx, by, bx + r, by); ctx.closePath();
      ctx.fill(); ctx.shadowColor = 'transparent'; ctx.stroke();
      ctx.fillStyle = st.sad ? '#a8321f' : '#4a230b'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(st.text, bx + w / 2, by + h / 2 + 1);
      ctx.restore();
    }
  };
})();
