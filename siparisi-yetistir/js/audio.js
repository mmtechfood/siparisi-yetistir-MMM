/* audio.js: arka plan müziği, kısa efekt sesleri (WebAudio ile üretilir) ve ses ayarları.
 * Tarayıcılar sesi ancak bir dokunuştan sonra başlatır: unlock() ilk dokunuşta çağrılır. */
(function () {
  'use strict';
  var MM = window.MM, KEY = 'motionmenu.siparisiyetistir.ayar.v1';
  var cfg = { music: 0.5, sfx: 0.8 };
  var music = null, ctx = null, unlocked = false, wantMusic = true, musicGain = null, routed = false;

  try { var raw = localStorage.getItem(KEY); if (raw) { var d = JSON.parse(raw); cfg.music = clamp(d.music, 0.5); cfg.sfx = clamp(d.sfx, 0.8); } } catch (e) { /* yoksay */ }

  function clamp(v, def) { v = parseFloat(v); return isNaN(v) ? def : Math.max(0, Math.min(1, v)); }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(cfg)); } catch (e) { /* yoksay */ } }

  function ensureMusic() {
    if (music) return music;
    music = new Audio('assets/audio/music.mp3');
    music.loop = true; music.preload = 'auto';
    music.volume = 1;
    return music;
  }

  function ensureCtx() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (AC) { try { ctx = new AC(); } catch (e) { ctx = null; } }
    return ctx;
  }

  /* Müziği WebAudio kazanç düğümünden geçirir: iPhone ve Android'de ses seviyesi aynı çalışır. */
  function routeMusic() {
    var m = ensureMusic(), c = ensureCtx();
    if (c && !routed) {
      try {
        var src = c.createMediaElementSource(m); musicGain = c.createGain();
        src.connect(musicGain); musicGain.connect(c.destination); routed = true;
      } catch (e) { routed = false; musicGain = null; }
    }
    applyMusicVolume();
  }
  function applyMusicVolume() {
    var v = cfg.music * 0.7;                  // müzik efektlerin altında kalsın
    if (musicGain) { musicGain.gain.value = v; if (music) music.volume = 1; }
    else if (music) music.volume = v;
  }

  /* tek nota */
  function tone(freq, t0, dur, type, vol, slideTo) {
    var c = ensureCtx(); if (!c || cfg.sfx <= 0) return;
    var o = c.createOscillator(), g = c.createGain(), t = c.currentTime + t0;
    o.type = type || 'sine'; o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    var v = (vol || 0.3) * cfg.sfx;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + 0.03);
  }

  var SFX = {
    tap: function (n) { tone(520 + Math.min(n || 0, 8) * 40, 0, 0.09, 'triangle', 0.32); },
    wrong: function () { tone(160, 0, 0.28, 'sawtooth', 0.28, 80); tone(120, 0.06, 0.25, 'square', 0.15, 60); },
    serve: function () { tone(880, 0, 0.18, 'sine', 0.3); tone(1320, 0.09, 0.3, 'sine', 0.26); },
    golden: function () { [784, 988, 1175, 1568].forEach(function (f, i) { tone(f, i * 0.07, 0.25, 'triangle', 0.28); }); },
    coupon: function () { [523, 659, 784, 1047, 1319, 1568].forEach(function (f, i) { tone(f, i * 0.09, 0.32, 'triangle', 0.3); }); },
    fail: function () { tone(400, 0, 0.35, 'sawtooth', 0.22, 120); },
    tick: function () { tone(1000, 0, 0.05, 'square', 0.12); },
    over: function () { [440, 392, 330, 262].forEach(function (f, i) { tone(f, i * 0.16, 0.3, 'triangle', 0.28); }); },
    click: function () { tone(700, 0, 0.05, 'triangle', 0.2); }
  };

  MM.Audio = {
    cfg: cfg,
    /* İlk kullanıcı dokunuşunda çağrılır: ses bağlamını açar ve müziği başlatır. */
    unlock: function () {
      var c = ensureCtx();
      if (c && c.state !== 'running' && c.resume) { try { c.resume(); } catch (e) { /* yoksay */ } }
      if (unlocked) return;
      unlocked = true;
      if (c) { try { var b = c.createBuffer(1, 1, 22050), s = c.createBufferSource(); s.buffer = b; s.connect(c.destination); s.start(0); } catch (e) { /* iOS ses kilidi */ } }
      if (wantMusic) this.playMusic();
    },
    playMusic: function () {
      wantMusic = true;
      if (!unlocked) return;
      var m = ensureMusic(); routeMusic();
      var p = m.play(); if (p && p.catch) p.catch(function () { /* tarayıcı engelledi; sonraki dokunuşta denenir */ unlocked = false; });
    },
    pauseMusic: function () { if (music) music.pause(); },
    /* Sekme gizlenince müzik durur, geri gelince devam eder. */
    onVisibility: function (hidden) {
      if (hidden) { if (music) music.pause(); if (ctx && ctx.suspend) ctx.suspend(); }
      else { if (ctx && ctx.resume) ctx.resume(); if (unlocked && wantMusic) this.playMusic(); }
    },
    setMusic: function (v) { cfg.music = clamp(v, 0.5); applyMusicVolume(); save(); },
    setSfx: function (v) { cfg.sfx = clamp(v, 0.8); save(); },
    play: function (name, arg) { if (!unlocked || cfg.sfx <= 0) return; var f = SFX[name]; if (f) f(arg); }
  };
})();
