/* ui.js: DOM ekranları, HUD ve (yemeğe göre değişen) malzeme butonları */
(function () {
  'use strict';
  var MM = window.MM, C = MM.CONFIG, G = MM.Game;
  function $(id) { return document.getElementById(id); }

  var el = {}, last = {}, lastState = 'menu', overTimer = 0;

  /* Animasyon sınıfını yeniden başlatır ve bitince kaldırır. */
  function flash(node, cls, ms) {
    node.classList.remove(cls); void node.offsetWidth; node.classList.add(cls);
    clearTimeout(node['_t' + cls]);
    node['_t' + cls] = setTimeout(function () { node.classList.remove(cls); }, ms || 450);
  }

  function showScreen(name) {
    ['Menu', 'How', 'Pause', 'Over', 'Set', 'Install'].forEach(function (n) { $('scr' + n).classList.toggle('hidden', n !== name); });
  }
  function showGameLayers(on) { el.hud.classList.toggle('hidden', !on); el.tray.classList.toggle('hidden', !on); }

  /* Sipariş değişince alttaki butonlar o yemeğin malzemeleriyle yeniden kurulur. */
  function buildTray(menu) {
    el.tray.innerHTML = '';
    var grid = document.createElement('div'); grid.className = 'tray-grid';
    menu.forEach(function (key, i) {
      var ing = C.INGREDIENTS[key], b = document.createElement('button');
      b.className = 'ing in'; b.type = 'button'; b.dataset.key = key;
      b.style.setProperty('--dk', ing.dark); b.style.animationDelay = (i * 35) + 'ms';
      b.innerHTML = '<img alt="" draggable="false" src="' + MM.Assets.url(ing.iconKey) + '"><span>' + ing.label + '</span>';
      b.addEventListener('pointerdown', function (e) { e.preventDefault(); press(key, b); });
      grid.appendChild(b);
    });
    el.tray.appendChild(grid);
  }

  function press(key, btn) {
    var r = G.tap(key);
    if (!btn) return;
    btn.classList.remove('in');
    if (r === 'ok') flash(btn, 'ok'); else if (r === 'wrong') flash(btn, 'bad');
  }

  function goFullscreen() {
    try {
      var coarse = window.matchMedia && matchMedia('(pointer: coarse)').matches;
      var standalone = (window.matchMedia && matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches) || navigator.standalone === true;
      var de = document.documentElement;
      if (!coarse || standalone || document.fullscreenElement || !de.requestFullscreen) return;
      var p = de.requestFullscreen({ navigationUI: 'hide' });
      if (p && p.then) p.then(function () { if (screen.orientation && screen.orientation.lock) screen.orientation.lock('portrait').catch(function () {}); }).catch(function () {});
    } catch (e) { /* yoksay */ }
  }

  function startGame() {
    goFullscreen();
    clearTimeout(overTimer);
    G.start(); showScreen(null); showGameLayers(true);
    el.timer.classList.remove('low'); last = {};
  }
  function toMenu() {
    clearTimeout(overTimer); G.toMenu(); showGameLayers(false); showScreen('Menu'); refreshMenu();
  }

  function refreshMenu() {
    var d = MM.Storage.get();
    el.menuBest.textContent = d.best;
    $('menuTip').textContent = d.coupon ? 'KUPONUN: ' + d.coupon.text + '  ·  ' + d.coupon.code : C.REWARD.score + ' PUANA ULAŞ, İNDİRİM KAZAN!';
    $('menuTip').classList.toggle('has', !!d.coupon);
  }

  function countUp(node, to) {
    var t0 = performance.now(), dur = 900;
    (function step(now) {
      var p = Math.min(1, (now - t0) / dur);
      node.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1 && G.state === 'over') requestAnimationFrame(step);
    })(t0);
  }

  function showOver() {
    var r = G.result; if (!r) return;
    $('overOrders').textContent = r.orders; $('overBest').textContent = r.best;
    $('newRecord').classList.toggle('hidden', !(r.isNew && r.score > 0));
    var box = $('overCoupon');
    if (r.coupon) {
      box.className = 'coupon won';
      box.innerHTML = '<small>İNDİRİM KUPONUN</small><b>' + r.coupon.text + '</b><span>' + r.coupon.code + '</span><em>Garsona göster</em>';
    } else {
      box.className = 'coupon';
      box.innerHTML = '<small>İNDİRİM İÇİN</small><b>' + Math.max(1, C.REWARD.score - r.score) + ' puan daha lazım</b><em>Hedef: ' + C.REWARD.score + ' puan</em>';
    }
    countUp($('overScore'), r.score);
    showGameLayers(false); showScreen('Over');
  }

  var UI = (MM.UI = {
    init: function () {
      el.hud = $('hud'); el.tray = $('tray'); el.timer = $('timer'); el.score = $('score');
      el.timeVal = $('timeVal'); el.timeBar = $('timeBar'); el.scoreVal = $('scoreVal');
      el.combo = $('combo'); el.comboVal = $('comboVal'); el.menuBest = $('menuBest');
      el.reward = $('reward'); el.rewardFill = $('rewardFill'); el.rewardText = $('rewardText');

      if (MM.Assets.isCustom('logo')) { var li = $('logoImg'); li.src = MM.Assets.url('logo'); li.hidden = false; $('logoText').hidden = true; }

      // Ses: ilk dokunuşta açılır (tarayıcı kuralı)
      ['pointerdown', 'touchend', 'click', 'keydown'].forEach(function (ev) {
        document.addEventListener(ev, function () { MM.Audio.unlock(); }, { capture: true, passive: true });
      });
      // Mobil: uzun basma menüsü, çift dokunma yakınlaştırma ve sıkıştırma kapalı
      document.addEventListener('contextmenu', function (e) { e.preventDefault(); });
      ['gesturestart', 'gesturechange', 'gestureend'].forEach(function (ev) { document.addEventListener(ev, function (e) { e.preventDefault(); }); });

      // Ana ekrana ekle
      var inst = $('btnInstall'), deferred = null;
      var standalone = (window.matchMedia && matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches) || navigator.standalone === true;
      var ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; if (!standalone) inst.classList.remove('hidden'); });
      window.addEventListener('appinstalled', function () { deferred = null; inst.classList.add('hidden'); });
      if (!standalone && ios) inst.classList.remove('hidden');
      inst.addEventListener('click', function () {
        if (deferred) { deferred.prompt(); deferred.userChoice.then(function () { deferred = null; inst.classList.add('hidden'); }); return; }
        $('installSteps').innerHTML = ios
          ? '<li><i>1</i><p><b>Safari</b> ile aç (Chrome\'da olmaz).</p></li><li><i>2</i><p>Alttaki <b>Paylaş</b> düğmesine dokun.</p></li><li><i>3</i><p><b>Ana Ekrana Ekle</b>\'yi seç, sonra <b>Ekle</b>.</p></li>'
          : '<li><i>1</i><p>Chrome\'da sağ üstteki <b>üç nokta</b> menüsünü aç.</p></li><li><i>2</i><p><b>Ana ekrana ekle</b> ya da <b>Uygulamayı yükle</b>\'yi seç.</p></li><li><i>3</i><p><b>Yükle</b>\'ye dokun.</p></li>';
        showScreen('Install');
      });
      $('btnInstallBack').addEventListener('click', function () { showScreen('Menu'); });


      // Ayarlar
      var from = 'Menu', rm = $('rngMusic'), rs = $('rngSfx');
      function openSettings(origin) { from = origin; rm.value = Math.round(MM.Audio.cfg.music * 100); rs.value = Math.round(MM.Audio.cfg.sfx * 100); $('valMusic').textContent = rm.value; $('valSfx').textContent = rs.value; showScreen('Set'); }
      rm.addEventListener('input', function () { $('valMusic').textContent = rm.value; MM.Audio.setMusic(rm.value / 100); });
      rs.addEventListener('input', function () { $('valSfx').textContent = rs.value; MM.Audio.setSfx(rs.value / 100); });
      rs.addEventListener('change', function () { MM.Audio.play('serve'); });   // efekt sesini duyurur
      $('btnGear').addEventListener('click', function () { openSettings('Menu'); });
      $('btnPauseSet').addEventListener('click', function () { openSettings('Pause'); });
      $('btnSetBack').addEventListener('click', function () { showScreen(from); });

      $('btnPlay').addEventListener('click', startGame);
      $('btnAgain').addEventListener('click', startGame);
      $('btnHow').addEventListener('click', function () { showScreen('How'); });
      $('btnHowBack').addEventListener('click', function () { showScreen('Menu'); });
      $('btnPause').addEventListener('click', UI.pause);
      $('btnResume').addEventListener('click', UI.resume);
      $('btnPauseMenu').addEventListener('click', toMenu);
      $('btnOverMenu').addEventListener('click', toMenu);

      // Masaüstü testi için klavye: 1-6 malzeme, P duraklat
      window.addEventListener('keydown', function (e) {
        if (e.repeat) return;
        var i = '123456'.indexOf(e.key);
        if (i >= 0) { var b = el.tray.querySelectorAll('.ing')[i]; if (b) press(b.dataset.key, b); }
        else if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') { G.state === 'paused' ? UI.resume() : UI.pause(); }
      });
      document.addEventListener('visibilitychange', function () { if (document.hidden) UI.pause(); MM.Audio.onVisibility(document.hidden); });

      G.newMenuDemo();
      refreshMenu(); showScreen('Menu'); showGameLayers(false);
    },

    pause: function () {
      if (G.state !== 'playing' && G.state !== 'countdown') return;
      G.pause(); showScreen('Pause');
    },
    resume: function () { if (G.state === 'paused') { G.resume(); showScreen(null); } },

    /* Her karede HUD'u günceller (yalnızca değişen değerler DOM'a yazılır). */
    sync: function () {
      var secs = Math.max(0, Math.ceil(G.time - 0.0001));
      if (last.secs !== secs) { last.secs = secs; el.timeVal.textContent = secs; el.timer.classList.toggle('low', secs <= 10 && secs > 0 && G.state !== 'menu'); }
      var pct = Math.min(100, Math.max(0, G.time / C.GAME_SECONDS * 100)).toFixed(1);
      if (last.pct !== pct) { last.pct = pct; el.timeBar.style.width = pct + '%'; }
      if (last.hits !== G.timeHits) { if (last.hits !== undefined && G.timeHits > 0) flash(el.timer, 'hit', 600); last.hits = G.timeHits; }
      if (last.score !== G.score) {
        last.score = G.score; el.scoreVal.textContent = G.score; flash(el.score, 'pop', 320);
        var tgt = C.REWARD.score, sp = Math.min(tgt, G.score);
        el.rewardFill.style.width = (sp / tgt * 100) + '%';
        el.rewardText.textContent = G.coupon ? 'KUPON KAZANDIN!' : 'İNDİRİM  ' + sp + ' / ' + tgt;
        el.reward.classList.toggle('done', !!G.coupon);
      }
      var cs = G.streak >= 2 ? G.streak : 0;
      if (last.combo !== cs) {
        last.combo = cs;
        el.combo.classList.toggle('off', !cs);
        if (cs) { el.comboVal.textContent = 'x' + cs; flash(el.combo, 'bump', 350); }
      }
      if (G.order && last.orderId !== G.order.id) { last.orderId = G.order.id; buildTray(G.order.menu); }
      if (lastState !== G.state) {
        if (G.state === 'over') { clearTimeout(overTimer); overTimer = setTimeout(function () { if (G.state === 'over') showOver(); }, 650); }
        lastState = G.state;
      }
    }
  });
})();
