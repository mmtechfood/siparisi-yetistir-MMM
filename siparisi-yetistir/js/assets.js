/* assets.js: görsel yükleyici + kodla çizilen (prosedürel) yedek görseller.
 * Her görsel için önce assets/img/... altındaki dosya denenir; yoksa config.js'teki tarifle çizilir.
 * Böylece PNG/WebP eklendiğinde kod değişmeden görünüm yükselir. */
(function () {
  'use strict';
  var MM = window.MM, C = MM.CONFIG, S = 2, OUT = '#4a230b', TAU = Math.PI * 2;

  /* ---------- yardımcılar ---------- */
  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function rr(ctx, x, y, w, h, r) {
    var a = Array.isArray(r) ? r : [r, r, r, r], tl = a[0], tr = a[1], br = a[2], bl = a[3];
    ctx.beginPath();
    ctx.moveTo(x + tl, y); ctx.lineTo(x + w - tr, y); ctx.quadraticCurveTo(x + w, y, x + w, y + tr);
    ctx.lineTo(x + w, y + h - br); ctx.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
    ctx.lineTo(x + bl, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - bl);
    ctx.lineTo(x, y + tl); ctx.quadraticCurveTo(x, y, x + tl, y); ctx.closePath();
  }
  function line(ctx, w) { ctx.lineWidth = w || 3; ctx.lineJoin = 'round'; ctx.strokeStyle = OUT; ctx.stroke(); }
  function lg(ctx, y0, y1, stops) {
    var g = ctx.createLinearGradient(0, y0, 0, y1);
    for (var i = 0; i < stops.length; i++) g.addColorStop(stops[i][0], stops[i][1]);
    return g;
  }
  function circle(ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); }
  function ell(ctx, x, y, rx, ry, rot) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot || 0, 0, TAU); }

  /* =====================================================
   *  SPRITE'LAR (yan görünüm; alt `step` px görünür kısım)
   * ===================================================== */
  var ART = {};

  ART.bunBottom = function (ctx, w, h) {
    rr(ctx, 3, 5, w - 6, h - 8, [12, 12, 28, 28]);
    ctx.fillStyle = lg(ctx, 5, h, [[0, '#f9cd6e'], [0.45, '#eaa53c'], [1, '#b96e14']]); ctx.fill();
    ctx.save(); ctx.clip();
    ctx.fillStyle = '#fde9b0'; ctx.fillRect(0, 0, w, 15);
    ctx.fillStyle = 'rgba(255,255,255,.2)'; ctx.fillRect(0, 15, w, 6);
    ctx.fillStyle = 'rgba(80,30,0,.28)'; ctx.fillRect(0, h - 15, w, 15);
    ctx.restore();
    rr(ctx, 3, 5, w - 6, h - 8, [12, 12, 28, 28]); line(ctx);
  };

  function domePath(ctx, w, h) {
    ctx.beginPath(); ctx.moveTo(4, h - 10);
    ctx.bezierCurveTo(-2, h * 0.1, w * 0.2, 3, w / 2, 3);
    ctx.bezierCurveTo(w * 0.8, 3, w + 2, h * 0.1, w - 4, h - 10);
    ctx.quadraticCurveTo(w - 4, h - 3, w - 16, h - 3); ctx.lineTo(16, h - 3);
    ctx.quadraticCurveTo(4, h - 3, 4, h - 10); ctx.closePath();
  }
  ART.bunTop = function (ctx, w, h) {
    domePath(ctx, w, h);
    ctx.fillStyle = lg(ctx, 0, h, [[0, '#ffd877'], [0.5, '#f0a22e'], [1, '#c4761a']]); ctx.fill();
    ctx.save(); ctx.clip();
    ctx.fillStyle = 'rgba(255,255,255,.34)'; ell(ctx, w * 0.34, h * 0.3, w * 0.22, h * 0.13, -0.25); ctx.fill();
    ctx.fillStyle = 'rgba(100,40,0,.25)'; ctx.fillRect(0, h - 15, w, 15);
    ctx.restore();
    var r = rng(11), cx = w / 2, cy = h - 6, rx = w / 2 - 22, ry = h - 22, n = 0, guard = 0;
    while (n < 15 && guard++ < 200) {
      var x = w * (0.15 + 0.7 * r()), y = h * (0.16 + 0.5 * r()), ex = (x - cx) / rx, ey = (y - cy) / ry;
      if (ex * ex + ey * ey > 0.78) continue;
      n++;
      ctx.save(); ctx.translate(x, y); ctx.rotate(r() * 3);
      ell(ctx, 0, 0, 6.5, 3.4); ctx.fillStyle = '#fff3d1'; ctx.fill(); ctx.lineWidth = 1.2; ctx.strokeStyle = 'rgba(120,60,10,.65)'; ctx.stroke();
      ctx.restore();
    }
    domePath(ctx, w, h); line(ctx);
  };

  ART.patty = function (ctx, w, h) {
    rr(ctx, 3, 3, w - 6, h - 6, 20);
    ctx.fillStyle = lg(ctx, 0, h, [[0, '#a2592f'], [0.5, '#6a3216'], [1, '#3b1a0a']]); ctx.fill();
    ctx.save(); ctx.clip();
    ctx.strokeStyle = 'rgba(25,8,0,.38)'; ctx.lineWidth = 5;
    for (var x = 16; x < w + 20; x += 34) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x - 16, h); ctx.stroke(); }
    var r = rng(5);
    for (var i = 0; i < 46; i++) { ctx.fillStyle = i % 3 ? 'rgba(255,200,150,.16)' : 'rgba(20,6,0,.28)'; circle(ctx, r() * w, r() * h, 1 + r() * 1.8); ctx.fill(); }
    ctx.fillStyle = 'rgba(255,225,190,.26)'; ctx.fillRect(0, 0, w, 7);
    ctx.restore();
    rr(ctx, 3, 3, w - 6, h - 6, 20); line(ctx);
  };

  /* peynir / kaşar: renkler o.top, o.c1..c3 */
  ART.cheese = function (ctx, w, h, o) {
    var top = 12, bot = 25, drips = [{ x: w - 64, r: 10, len: h - 3 }, { x: w * 0.5, r: 8, len: h - 9 }, { x: 70, r: 10, len: h - 2 }];
    ctx.beginPath(); ctx.moveTo(18, 2); ctx.lineTo(w - 18, 2); ctx.lineTo(w - 6, top); ctx.lineTo(6, top); ctx.closePath();
    ctx.fillStyle = o.top || '#fff0a0'; ctx.fill(); line(ctx, 2.5);
    ctx.beginPath(); ctx.moveTo(6, top); ctx.lineTo(w - 6, top); ctx.lineTo(w - 3, bot);
    for (var i = 0; i < drips.length; i++) {
      var d = drips[i];
      ctx.lineTo(d.x + d.r, bot); ctx.quadraticCurveTo(d.x + d.r, d.len, d.x, d.len); ctx.quadraticCurveTo(d.x - d.r, d.len, d.x - d.r, bot);
    }
    ctx.lineTo(3, bot); ctx.closePath();
    ctx.fillStyle = lg(ctx, top, h, [[0, o.c1 || '#ffe26a'], [0.6, o.c2 || '#fbb810'], [1, o.c3 || '#e58f00']]); ctx.fill();
    ctx.save(); ctx.clip(); ctx.fillStyle = 'rgba(255,255,255,.38)'; ctx.fillRect(0, top, w, 3); ctx.restore();
    line(ctx);
  };

  ART.lettuce = function (ctx, w, h, o) {
    o = o || {};
    function yt(x) { return 11 + Math.sin(x * 0.19) * 5 + Math.sin(x * 0.07 + 1) * 3; }
    function yb(x) { return h - 9 + Math.sin(x * 0.23 + 2) * 5 + Math.sin(x * 0.09) * 2; }
    var x;
    function path() {
      ctx.beginPath(); ctx.moveTo(2, yt(2));
      for (x = 2; x <= w - 2; x += 3) ctx.lineTo(x, yt(x));
      for (x = w - 2; x >= 2; x -= 3) ctx.lineTo(x, yb(x));
      ctx.closePath();
    }
    path(); ctx.fillStyle = lg(ctx, 4, h, [[0, o.c1 || '#b4f06c'], [0.5, o.c2 || '#6fcb3a'], [1, o.c3 || '#3f9f20']]); ctx.fill();
    ctx.save(); ctx.clip();
    ctx.strokeStyle = 'rgba(235,255,200,.5)'; ctx.lineWidth = 3;
    ctx.beginPath(); for (x = 2; x <= w; x += 3) { var y = yt(x) + 7; if (x === 2) ctx.moveTo(x, y); else ctx.lineTo(x, y); } ctx.stroke();
    ctx.strokeStyle = 'rgba(20,90,10,.28)'; ctx.lineWidth = 2;
    for (x = 24; x < w; x += 46) { ctx.beginPath(); ctx.moveTo(x, yt(x) + 8); ctx.lineTo(x + 8, yb(x) - 3); ctx.stroke(); }
    ctx.restore();
    path(); line(ctx);
  };

  /* dilim bant: domates, sucuk, turşu, soğan, çilek (o.pat: seeds | fat | rings | berry) */
  ART.slices = function (ctx, w, h, o) {
    rr(ctx, 4, 4, w - 8, h - 8, 14);
    ctx.fillStyle = lg(ctx, 0, h, [[0, o.top], [0.5, o.mid], [1, o.bot]]); ctx.fill();
    ctx.save(); ctx.clip();
    var segs = 4, sw = (w - 8) / segs, i, k, cx, cy = h / 2 + 1;
    ctx.strokeStyle = o.line; ctx.lineWidth = 3;
    for (i = 1; i < segs; i++) { ctx.beginPath(); ctx.moveTo(4 + sw * i, 0); ctx.lineTo(4 + sw * i, h); ctx.stroke(); }
    for (i = 0; i < segs; i++) {
      cx = 4 + sw * (i + 0.5);
      if (o.pat === 'seeds') { ctx.fillStyle = o.dot; for (k = 0; k < 3; k++) { ell(ctx, cx + (k - 1) * 14, cy, 3.4, 2, 0.4); ctx.fill(); } }
      else if (o.pat === 'fat') { ctx.fillStyle = o.dot; for (k = 0; k < 3; k++) { circle(ctx, cx + (k - 1) * 17, cy + ((k + i) % 2 ? -3 : 3), 3.6); ctx.fill(); } }
      else if (o.pat === 'berry') { ctx.fillStyle = o.dot; for (k = 0; k < 5; k++) { ell(ctx, cx + (k - 2) * 9, cy + (k % 2 ? 4 : -4), 1.8, 3, 0.2); ctx.fill(); } }
      else if (o.pat === 'bumps') { ctx.fillStyle = 'rgba(15,40,0,.3)'; for (k = 0; k < 5; k++) { circle(ctx, cx + (k - 2) * 8, cy + (k % 2 ? 4 : -4), 2.2); ctx.fill(); } ctx.fillStyle = o.dot; ell(ctx, cx, cy, 9, 3.2); ctx.fill(); }
      else if (o.pat === 'rings') { ctx.strokeStyle = o.line; ctx.lineWidth = 2.5; for (k = 1; k <= 2; k++) { ctx.beginPath(); ctx.ellipse(cx, cy, 9 * k, 5 + k * 1.5, 0, 0, TAU); ctx.stroke(); } }
    }
    ctx.fillStyle = 'rgba(255,255,255,.34)'; ctx.fillRect(0, 5, w, 4);
    ctx.restore();
    rr(ctx, 4, 4, w - 8, h - 8, 14); line(ctx);
  };

  /* ekmek / kek / pide / lavaş: o.top,mid,bot, crust, cw, r4, mark (grill|crumb|seed|spots), lip */
  ART.slab = function (ctx, w, h, o) {
    var r4 = o.r4 || [10, 10, 16, 16], rnd = rng(7), i;
    function P() { rr(ctx, 3, 4, w - 6, h - 6, r4); }
    P(); ctx.fillStyle = lg(ctx, 4, h, [[0, o.top], [0.5, o.mid], [1, o.bot]]); ctx.fill();
    ctx.save(); ctx.clip();
    if (o.lip) { ctx.fillStyle = o.lipc || 'rgba(255,255,255,.35)'; ctx.fillRect(0, 0, w, o.lip); }
    if (o.mark === 'grill') {
      ctx.strokeStyle = 'rgba(90,40,0,.42)'; ctx.lineWidth = 6;
      for (i = 12; i < w + h; i += 30) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i - h, h); ctx.stroke(); }
    } else if (o.mark === 'crumb') {
      for (i = 0; i < 50; i++) { ctx.fillStyle = i % 2 ? 'rgba(150,90,20,.28)' : 'rgba(255,255,230,.35)'; circle(ctx, rnd() * w, rnd() * h, 1 + rnd() * 2); ctx.fill(); }
    } else if (o.mark === 'seed') {
      ctx.fillStyle = '#3a2410';
      for (i = 0; i < 34; i++) { ell(ctx, 10 + rnd() * (w - 20), 6 + rnd() * (h - 12), 2.6, 1.4, rnd() * 3); ctx.fill(); }
    } else if (o.mark === 'grid') {
      ctx.strokeStyle = 'rgba(110,60,10,.5)'; ctx.lineWidth = 3.5;
      for (i = 18; i < w; i += 24) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
      for (i = 14; i < h; i += 14) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }
      ctx.fillStyle = 'rgba(255,235,180,.18)';
      for (i = 6; i < w; i += 24) ctx.fillRect(i, 4, 8, 6);
    } else if (o.mark === 'spots') {
      for (i = 0; i < 16; i++) { ctx.fillStyle = 'rgba(170,100,30,.32)'; ell(ctx, rnd() * w, rnd() * h, 5 + rnd() * 9, 3 + rnd() * 4, rnd() * 3); ctx.fill(); }
    }
    ctx.fillStyle = 'rgba(60,25,0,.2)'; ctx.fillRect(0, h - 12, w, 12);
    if (o.crust) { P(); ctx.lineWidth = o.cw || 8; ctx.strokeStyle = o.crust; ctx.stroke(); }
    ctx.restore();
    P(); line(ctx);
  };

  /* sos / yoğurt / krema / çikolata / tereyağı: dalgalı bant + damlalar */
  ART.drizzle = function (ctx, w, h, o) {
    var top = 7, body = h * 0.42, drips = o.drips || [0.2, 0.55, 0.82], ph = o.ph || 0, x, i;
    function yt(x) {
      var y = top + Math.sin(x * 0.12 + ph) * 2.5;
      if (o.bumps) y -= Math.abs(Math.sin(x * 0.17)) * 7;
      return y;
    }
    function yb(x) {
      var y = top + body;
      for (i = 0; i < drips.length; i++) {
        var d = (x - drips[i] * w) / (11 + (i % 2) * 3);
        if (Math.abs(d) < 1) y += (h - top - body - 3) * (0.72 + 0.28 * ((i * 37) % 10) / 10) * Math.sqrt(1 - d * d);
      }
      return y;
    }
    ctx.beginPath(); ctx.moveTo(4, yt(4));
    for (x = 4; x <= w - 4; x += 2) ctx.lineTo(x, yt(x));
    for (x = w - 4; x >= 4; x -= 1) ctx.lineTo(x, yb(x));
    ctx.closePath();
    ctx.fillStyle = lg(ctx, 0, h, [[0, o.c1], [1, o.c2]]); ctx.fill();
    ctx.save(); ctx.clip();
    ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 3; ctx.beginPath();
    for (x = 8; x <= w - 8; x += 2) { var y = yt(x) + 5; if (x === 8) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
    ctx.stroke(); ctx.restore();
    line(ctx);
  };

  ART.meat = function (ctx, w, h, o) {
    var r = rng(o.seed || 9), x;
    rr(ctx, 3, 3, w - 6, h - 6, 16); ctx.fillStyle = lg(ctx, 0, h, [[0, o.d1], [1, o.d2]]); ctx.fill();
    ctx.save(); ctx.clip();
    for (x = -14; x < w; x += 22) {
      var bw = 30 + r() * 34, by = 2 + r() * 14, tilt = (r() - 0.5) * 0.5;
      ctx.save(); ctx.translate(x + bw / 2, h / 2); ctx.rotate(tilt); ctx.translate(-bw / 2, -h / 2);
      rr(ctx, 0, by, bw, h - by + 2, 12 + r() * 6);
      ctx.fillStyle = lg(ctx, by, h, r() > 0.5 ? [[0, o.l1], [1, o.l2]] : [[0, o.l2], [1, o.d1]]); ctx.fill();
      ctx.lineWidth = 1.8; ctx.strokeStyle = 'rgba(60,25,0,.6)'; ctx.stroke();
      ctx.restore();
    }
    ctx.strokeStyle = 'rgba(50,20,0,.45)'; ctx.lineWidth = 2.5;
    for (x = 0; x < 16; x++) { var px = r() * w, py = 6 + r() * (h - 12); ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + 8, py + 2); ctx.stroke(); }
    ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(0, 3, w, 4);
    ctx.restore();
    rr(ctx, 3, 3, w - 6, h - 6, 16); line(ctx);
  };

  ART.cherry = function (ctx, w, h) {
    var i, c = [{ x: 28, y: 50 }, { x: 70, y: 52 }];
    ctx.strokeStyle = '#5a7a22'; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
    for (i = 0; i < 2; i++) { ctx.beginPath(); ctx.moveTo(c[i].x, c[i].y - 14); ctx.quadraticCurveTo(44 + i * 8, 16, 52, 6); ctx.stroke(); }
    ell(ctx, 58, 8, 10, 4, -0.5); ctx.fillStyle = '#5fb832'; ctx.fill(); line(ctx, 2);
    for (i = 0; i < 2; i++) {
      var g = ctx.createRadialGradient(c[i].x - 6, c[i].y - 8, 2, c[i].x, c[i].y, 24);
      g.addColorStop(0, '#ff6a6a'); g.addColorStop(0.6, '#d0182e'); g.addColorStop(1, '#8a0e20');
      circle(ctx, c[i].x, c[i].y, 21); ctx.fillStyle = g; ctx.fill(); line(ctx);
      ctx.fillStyle = 'rgba(255,255,255,.55)'; ell(ctx, c[i].x - 8, c[i].y - 9, 5, 3, -0.6); ctx.fill();
    }
  };

  ART.pepper = function (ctx, w, h) {
    ctx.beginPath(); ctx.moveTo(8, h * 0.55);
    ctx.bezierCurveTo(16, 3, w - 40, 2, w - 6, h * 0.5);
    ctx.bezierCurveTo(w - 40, h - 2, 26, h - 1, 8, h * 0.55); ctx.closePath();
    ctx.fillStyle = lg(ctx, 0, h, [[0, '#9bd95a'], [0.5, '#58a62a'], [1, '#2f6a14']]); ctx.fill();
    ctx.save(); ctx.clip();
    var r = rng(4); ctx.fillStyle = 'rgba(30,20,0,.42)';
    for (var i = 0; i < 9; i++) { ell(ctx, 20 + r() * (w - 50), 8 + r() * (h - 16), 7 + r() * 7, 3 + r() * 3, r() * 3); ctx.fill(); }
    ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.fillRect(14, 7, w - 50, 3);
    ctx.restore(); line(ctx);
    rr(ctx, w - 12, h * 0.38, 10, 12, 3); ctx.fillStyle = '#6a4a1a'; ctx.fill(); line(ctx, 2);
  };

  /* sosis */
  ART.tube = function (ctx, w, h, o) {
    rr(ctx, 4, 4, w - 8, h - 8, 17);
    ctx.fillStyle = lg(ctx, 0, h, [[0, o.c1], [0.5, o.c2], [1, o.c3]]); ctx.fill();
    ctx.save(); ctx.clip();
    ctx.strokeStyle = 'rgba(60,10,0,.28)'; ctx.lineWidth = 3;
    for (var x = 34; x < w - 20; x += 46) { ctx.beginPath(); ctx.moveTo(x, 6); ctx.lineTo(x + 12, h - 6); ctx.stroke(); }
    ctx.fillStyle = 'rgba(255,255,255,.4)'; rr(ctx, 14, 7, w - 28, 6, 3); ctx.fill();
    ctx.fillStyle = 'rgba(70,15,0,.25)'; ctx.fillRect(0, h - 12, w, 12);
    ctx.restore();
    rr(ctx, 4, 4, w - 8, h - 8, 17); line(ctx);
  };

  /* mantar dilimleri (yan kesit) */
  ART.mushroom = function (ctx, w, h) {
    var n = 4, i, cw = (w - 8) / n;
    for (i = 0; i < n; i++) {
      var cx = 4 + cw * (i + 0.5), top = 6 + (i % 2) * 2;
      ctx.beginPath();
      ctx.moveTo(cx - cw * 0.48, top + 16); ctx.bezierCurveTo(cx - cw * 0.48, top - 6, cx + cw * 0.48, top - 6, cx + cw * 0.48, top + 16);
      ctx.lineTo(cx + 10, top + 16); ctx.lineTo(cx + 10, h - 4); ctx.quadraticCurveTo(cx, h, cx - 10, h - 4); ctx.lineTo(cx - 10, top + 16); ctx.closePath();
      ctx.fillStyle = lg(ctx, top, h, [[0, '#d9a878'], [0.45, '#f2e2c8'], [1, '#c9ab82']]); ctx.fill();
      ctx.save(); ctx.clip();
      ctx.fillStyle = '#b07a4c'; ctx.fillRect(cx - cw, top - 4, cw * 2, 13);
      ctx.fillStyle = 'rgba(255,255,255,.3)'; ell(ctx, cx - 8, top + 4, 8, 3, -0.2); ctx.fill();
      ctx.restore(); line(ctx, 2.5);
    }
  };

  /* dondurma topu: pütürlü etek + küre */
  ART.scoop = function (ctx, w, h, o) {
    var cx = w / 2, x;
    ctx.beginPath(); ctx.moveTo(cx - 40, 50);
    for (x = cx - 40; x <= cx + 40; x += 2) ctx.lineTo(x, 66 + Math.sin(x * 0.42) * 4 + Math.sin(x * 0.15) * 2);
    ctx.lineTo(cx + 40, 50); ctx.closePath();
    ctx.fillStyle = lg(ctx, 52, 80, [[0, o.c2], [1, o.c3]]); ctx.fill(); line(ctx);
    var g = ctx.createRadialGradient(cx - 18, 24, 4, cx, 40, 46);
    g.addColorStop(0, o.c1); g.addColorStop(0.65, o.c2); g.addColorStop(1, o.c3);
    circle(ctx, cx, 40, 40); ctx.fillStyle = g; ctx.fill(); line(ctx);
    ctx.fillStyle = 'rgba(255,255,255,.5)'; ell(ctx, cx - 16, 24, 11, 6, -0.6); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,.08)'; for (x = 0; x < 6; x++) { circle(ctx, cx - 20 + x * 8, 44 + (x % 2) * 8, 2); ctx.fill(); }
  };

  /* cam dondurma kasesi */
  ART.cup = function (ctx, w, h) {
    ctx.beginPath(); ctx.moveTo(6, 12); ctx.lineTo(w - 6, 12); ctx.quadraticCurveTo(w - 10, 58, w - 66, 62); ctx.lineTo(66, 62); ctx.quadraticCurveTo(10, 58, 6, 12); ctx.closePath();
    ctx.fillStyle = lg(ctx, 12, 62, [[0, 'rgba(225,244,255,.92)'], [1, 'rgba(150,200,236,.95)']]); ctx.fill();
    ctx.save(); ctx.clip(); ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillRect(22, 14, 10, 40); ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.fillRect(w - 40, 16, 6, 30); ctx.restore();
    line(ctx);
    rr(ctx, w / 2 - 44, 60, 88, 9, 4); ctx.fillStyle = '#a9cbe6'; ctx.fill(); line(ctx, 2.5);
    ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(10, 14); ctx.lineTo(w - 10, 14); ctx.stroke();
  };

  /* =====================================================
   *  İKONLAR (120x120, 3/4 görünüm)
   * ===================================================== */
  var ICON = {};

  ICON.iconBunBottom = function (ctx) {
    rr(ctx, 10, 54, 100, 46, [10, 10, 24, 24]);
    ctx.fillStyle = lg(ctx, 54, 100, [[0, '#f6bf58'], [1, '#b96e14']]); ctx.fill(); line(ctx);
    ell(ctx, 60, 56, 50, 14); ctx.fillStyle = '#fde9b0'; ctx.fill(); line(ctx);
    ell(ctx, 60, 58, 36, 7); ctx.fillStyle = 'rgba(230,170,70,.5)'; ctx.fill();
  };
  ICON.iconPatty = function (ctx) {
    rr(ctx, 8, 54, 104, 36, [14, 14, 18, 18]);
    ctx.fillStyle = lg(ctx, 54, 90, [[0, '#8a4524'], [1, '#43200d']]); ctx.fill(); line(ctx);
    ell(ctx, 60, 56, 52, 16); ctx.fillStyle = '#7b3d1d'; ctx.fill();
    ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(25,8,0,.4)'; ctx.lineWidth = 4;
    for (var x = 14; x < 110; x += 18) { ctx.beginPath(); ctx.moveTo(x, 36); ctx.lineTo(x - 8, 76); ctx.stroke(); }
    ctx.restore();
    ell(ctx, 60, 56, 52, 16); line(ctx);
  };
  ICON.iconCheese = function (ctx, w, h, o) {
    ctx.save(); ctx.translate(60, 62); ctx.rotate(-0.22);
    rr(ctx, -42, -42, 84, 84, 8);
    ctx.fillStyle = lg(ctx, -42, 42, [[0, o.c1 || '#ffe778'], [1, o.c2 || '#f5a800']]); ctx.fill();
    ctx.save(); ctx.clip();
    ctx.fillStyle = 'rgba(190,105,0,.42)';
    [[-16, -14, 9], [16, 6, 7], [-8, 20, 6], [20, -24, 5], [-26, 12, 4]].forEach(function (c) { circle(ctx, c[0], c[1], c[2]); ctx.fill(); });
    ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.fillRect(-42, -42, 84, 6);
    ctx.restore();
    rr(ctx, -42, -42, 84, 84, 8); line(ctx);
    ctx.restore();
  };
  ICON.iconLettuce = function (ctx, w, h, o) {
    o = o || {};
    ctx.beginPath();
    for (var a = 0; a <= TAU + 0.05; a += 0.05) {
      var r = 40 + Math.sin(a * 9) * 5, x = 60 + Math.cos(a) * r * 1.05, y = 60 + Math.sin(a) * r * 0.92;
      if (a === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath(); ctx.fillStyle = lg(ctx, 15, 105, [[0, o.c1 || '#bff47a'], [1, o.c2 || '#3f9f20']]); ctx.fill(); line(ctx);
    ctx.strokeStyle = 'rgba(235,255,200,.6)'; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
    [[60, 98, 60, 26], [60, 84, 34, 44], [60, 84, 86, 44], [60, 68, 40, 62], [60, 68, 80, 62]].forEach(function (l) { ctx.beginPath(); ctx.moveTo(l[0], l[1]); ctx.lineTo(l[2], l[3]); ctx.stroke(); });
  };
  ICON.iconTomato = function (ctx) {
    circle(ctx, 60, 60, 42); ctx.fillStyle = lg(ctx, 18, 102, [[0, '#ff7a64'], [1, '#c52a1c']]); ctx.fill(); line(ctx);
    circle(ctx, 60, 60, 33); ctx.fillStyle = '#ff6a58'; ctx.fill();
    for (var i = 0; i < 5; i++) {
      var a = (i / 5) * TAU - Math.PI / 2;
      ctx.strokeStyle = 'rgba(255,225,205,.65)'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(60, 60); ctx.lineTo(60 + Math.cos(a) * 32, 60 + Math.sin(a) * 32); ctx.stroke();
      var b = a + Math.PI / 5;
      ctx.save(); ctx.translate(60 + Math.cos(b) * 19, 60 + Math.sin(b) * 19); ctx.rotate(b);
      ctx.fillStyle = '#ffe9a6'; ell(ctx, 0, 0, 5, 2.8); ctx.fill(); ctx.restore();
    }
    ctx.fillStyle = 'rgba(255,255,255,.4)'; ell(ctx, 40, 34, 10, 5, -0.7); ctx.fill();
  };
  ICON.iconBunTop = function (ctx) { ctx.save(); ctx.translate(6, 26); ART.bunTop(ctx, 108, 76); ctx.restore(); };

  /* tost dilimi: o.body [açık, koyu], o.crust, o.grill */
  ICON.iconToast = function (ctx, w, h, o) {
    function P() {
      ctx.beginPath(); ctx.moveTo(24, 98); ctx.lineTo(24, 54);
      ctx.bezierCurveTo(4, 48, 8, 14, 36, 18); ctx.bezierCurveTo(46, 6, 74, 6, 84, 18);
      ctx.bezierCurveTo(112, 14, 116, 48, 96, 54); ctx.lineTo(96, 98);
      ctx.quadraticCurveTo(96, 104, 90, 104); ctx.lineTo(30, 104); ctx.quadraticCurveTo(24, 104, 24, 98); ctx.closePath();
    }
    P(); ctx.fillStyle = lg(ctx, 8, 104, [[0, o.body[0]], [1, o.body[1]]]); ctx.fill();
    ctx.save(); ctx.clip(); P(); ctx.lineWidth = 14; ctx.strokeStyle = o.crust; ctx.stroke();
    if (o.grill) { ctx.strokeStyle = 'rgba(90,40,0,.5)'; ctx.lineWidth = 6; for (var i = -20; i < 130; i += 22) { ctx.beginPath(); ctx.moveTo(i, 100); ctx.lineTo(i + 40, 10); ctx.stroke(); } }
    ctx.restore(); P(); line(ctx);
  };

  /* yuvarlak dilim: sucuk, turşu, soğan */
  ICON.iconSlice = function (ctx, w, h, o) {
    var i;
    circle(ctx, 60, 60, 42); ctx.fillStyle = o.outer; ctx.fill(); line(ctx);
    circle(ctx, 60, 60, 33); ctx.fillStyle = o.inner; ctx.fill();
    if (o.pat === 'fat') { ctx.fillStyle = o.dot; for (i = 0; i < 6; i++) { circle(ctx, 60 + Math.cos(i * 1.047) * 20, 60 + Math.sin(i * 1.047) * 20, 5.5); ctx.fill(); } circle(ctx, 60, 60, 5); ctx.fill(); }
    else if (o.pat === 'seeds') { ctx.fillStyle = o.dot; for (i = 0; i < 8; i++) { ctx.save(); ctx.translate(60 + Math.cos(i * 0.785) * 20, 60 + Math.sin(i * 0.785) * 20); ctx.rotate(i * 0.785); ell(ctx, 0, 0, 5, 2.6); ctx.fill(); ctx.restore(); } }
    else if (o.pat === 'rings') { ctx.strokeStyle = 'rgba(130,60,160,.5)'; ctx.lineWidth = 3; [10, 19, 28].forEach(function (r) { circle(ctx, 60, 60, r); ctx.stroke(); }); }
    ctx.fillStyle = 'rgba(255,255,255,.38)'; ell(ctx, 42, 36, 10, 5, -0.7); ctx.fill();
  };

  ICON.iconBerry = function (ctx) {
    ctx.beginPath(); ctx.moveTo(60, 106);
    ctx.bezierCurveTo(26, 90, 10, 60, 18, 40); ctx.bezierCurveTo(26, 22, 50, 26, 60, 32);
    ctx.bezierCurveTo(70, 26, 94, 22, 102, 40); ctx.bezierCurveTo(110, 60, 94, 90, 60, 106); ctx.closePath();
    ctx.fillStyle = lg(ctx, 24, 106, [[0, '#ff7a7a'], [1, '#c8142a']]); ctx.fill(); line(ctx);
    ctx.fillStyle = '#ffe9a6'; var r = rng(2);
    for (var i = 0; i < 14; i++) { var x = 30 + r() * 60, y = 44 + r() * 50; if (Math.abs(x - 60) > 52 - (y - 44) * 0.7) continue; ell(ctx, x, y, 2.4, 3.8, 0.3); ctx.fill(); }
    ctx.fillStyle = '#4fae2c'; ctx.beginPath();
    for (var j = 0; j < 10; j++) { var a = (j / 10) * TAU - Math.PI / 2, rad = j % 2 ? 9 : 24; var px = 60 + Math.cos(a) * rad * 1.3, py = 30 + Math.sin(a) * rad * 0.6; if (j) ctx.lineTo(px, py); else ctx.moveTo(px, py); }
    ctx.closePath(); ctx.fill(); line(ctx, 2.5);
    ctx.fillStyle = 'rgba(255,255,255,.4)'; ell(ctx, 38, 58, 6, 11, 0.5); ctx.fill();
  };

  ICON.iconSpit = function (ctx) {
    ctx.strokeStyle = '#8f98ad'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(60, 6); ctx.lineTo(60, 116); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(20, 28); ctx.quadraticCurveTo(60, 14, 100, 28); ctx.lineTo(80, 98); ctx.quadraticCurveTo(60, 108, 40, 98); ctx.closePath();
    ctx.fillStyle = lg(ctx, 14, 108, [[0, '#e9b472'], [0.5, '#c47c38'], [1, '#8a4a20']]); ctx.fill();
    ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(70,30,5,.5)'; ctx.lineWidth = 3;
    for (var y = 40; y < 100; y += 13) { ctx.beginPath(); ctx.moveTo(10, y); ctx.quadraticCurveTo(60, y + 8, 110, y); ctx.stroke(); }
    ctx.fillStyle = 'rgba(255,255,255,.25)'; ell(ctx, 40, 50, 6, 24, 0.15); ctx.fill(); ctx.restore();
    ctx.beginPath(); ctx.moveTo(20, 28); ctx.quadraticCurveTo(60, 14, 100, 28); ctx.lineTo(80, 98); ctx.quadraticCurveTo(60, 108, 40, 98); ctx.closePath(); line(ctx);
  };

  ICON.iconFlat = function (ctx) {
    circle(ctx, 60, 60, 44); ctx.fillStyle = lg(ctx, 16, 104, [[0, '#fff3d4'], [1, '#e8c47e']]); ctx.fill(); line(ctx);
    var r = rng(8); ctx.fillStyle = 'rgba(170,100,30,.4)';
    for (var i = 0; i < 9; i++) { var a = r() * TAU, d = r() * 30; ell(ctx, 60 + Math.cos(a) * d, 60 + Math.sin(a) * d, 5 + r() * 6, 3 + r() * 3, r() * 3); ctx.fill(); }
    circle(ctx, 60, 60, 36); ctx.strokeStyle = 'rgba(190,140,70,.5)'; ctx.lineWidth = 2; ctx.stroke();
  };
  ICON.iconRoll = function (ctx) {
    ctx.save(); ctx.translate(60, 62); ctx.rotate(-0.5);
    rr(ctx, -46, -22, 86, 44, 20); ctx.fillStyle = lg(ctx, -22, 22, [[0, '#fff3d4'], [1, '#e2bf7a']]); ctx.fill(); line(ctx);
    ell(ctx, 40, 0, 12, 22); ctx.fillStyle = '#e8c47e'; ctx.fill(); line(ctx);
    ctx.fillStyle = '#7fcf46'; ell(ctx, 41, -6, 6, 6); ctx.fill(); ctx.fillStyle = '#e23a2b'; ell(ctx, 41, 6, 5, 5); ctx.fill(); ctx.fillStyle = '#c47c38'; ell(ctx, 38, 0, 4, 5); ctx.fill();
    ctx.strokeStyle = 'rgba(150,90,30,.45)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-30, -14); ctx.lineTo(28, -14); ctx.moveTo(-30, 12); ctx.lineTo(28, 12); ctx.stroke();
    ctx.restore();
  };
  ICON.iconPide = function (ctx) {
    function P() { ctx.beginPath(); ctx.moveTo(6, 64); ctx.bezierCurveTo(30, 28, 90, 28, 114, 64); ctx.bezierCurveTo(90, 100, 30, 100, 6, 64); ctx.closePath(); }
    P(); ctx.fillStyle = lg(ctx, 28, 100, [[0, '#f8d587'], [1, '#c98530']]); ctx.fill(); line(ctx);
    ctx.save(); P(); ctx.clip(); ctx.strokeStyle = 'rgba(120,60,0,.5)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(18, 64); ctx.lineTo(102, 64); ctx.stroke();
    ctx.fillStyle = '#3a2410'; var r = rng(6); for (var i = 0; i < 18; i++) { ell(ctx, 20 + r() * 80, 44 + r() * 40, 2.4, 1.3, r() * 3); ctx.fill(); }
    ctx.restore();
  };

  /* kase: o.bowl (kase rengi), o.c (içerik) */
  ICON.iconBowl = function (ctx, w, h, o) {
    ctx.beginPath(); ctx.moveTo(14, 56); ctx.quadraticCurveTo(14, 106, 60, 106); ctx.quadraticCurveTo(106, 106, 106, 56); ctx.closePath();
    ctx.fillStyle = o.bowl; ctx.fill(); line(ctx);
    ctx.fillStyle = 'rgba(0,0,0,.16)'; ctx.beginPath(); ctx.moveTo(18, 74); ctx.quadraticCurveTo(60, 100, 102, 74); ctx.quadraticCurveTo(100, 100, 60, 106); ctx.quadraticCurveTo(24, 100, 18, 74); ctx.fill();
    ell(ctx, 60, 56, 46, 14); ctx.fillStyle = o.bowl; ctx.fill(); line(ctx);
    ell(ctx, 60, 57, 38, 10); ctx.fillStyle = o.c; ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(60, 56, 22, 5, 0, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
  };
  ICON.iconCube = function (ctx) {
    ctx.beginPath(); ctx.moveTo(88, 58); ctx.lineTo(106, 40); ctx.lineTo(106, 78); ctx.lineTo(88, 98); ctx.closePath(); ctx.fillStyle = '#d9a21c'; ctx.fill(); line(ctx);
    ctx.beginPath(); ctx.moveTo(16, 58); ctx.lineTo(88, 58); ctx.lineTo(106, 40); ctx.lineTo(34, 40); ctx.closePath(); ctx.fillStyle = '#fff1a0'; ctx.fill(); line(ctx);
    rr(ctx, 16, 58, 72, 40, 5); ctx.fillStyle = lg(ctx, 58, 98, [[0, '#ffd84a'], [1, '#f0b41a']]); ctx.fill(); line(ctx);
    ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.fillRect(22, 63, 40, 4);
  };
  ICON.iconSwirl = function (ctx) {
    var tiers = [[60, 88, 40, 15], [60, 68, 31, 13], [60, 50, 22, 11]], i;
    for (i = 0; i < 3; i++) { ell(ctx, tiers[i][0], tiers[i][1], tiers[i][2], tiers[i][3]); ctx.fillStyle = lg(ctx, tiers[i][1] - 12, tiers[i][1] + 14, [[0, '#ffffff'], [1, '#f1dcbb']]); ctx.fill(); line(ctx); }
    ctx.beginPath(); ctx.moveTo(44, 46); ctx.quadraticCurveTo(58, 30, 62, 12); ctx.quadraticCurveTo(70, 30, 76, 46); ctx.closePath();
    ctx.fillStyle = '#fffaf0'; ctx.fill(); line(ctx);
  };
  ICON.iconCake = function (ctx) {
    ctx.beginPath(); ctx.moveTo(100, 52); ctx.lineTo(112, 38); ctx.lineTo(112, 84); ctx.lineTo(100, 100); ctx.closePath(); ctx.fillStyle = '#d9a040'; ctx.fill(); line(ctx);
    rr(ctx, 10, 52, 90, 48, 6); ctx.fillStyle = '#f4c96e'; ctx.fill();
    ctx.save(); ctx.clip(); ctx.fillStyle = '#fffdf6'; ctx.fillRect(0, 70, 130, 9); ctx.fillStyle = '#ffd88a'; ctx.fillRect(0, 52, 130, 6); ctx.restore();
    rr(ctx, 10, 52, 90, 48, 6); line(ctx);
    ctx.beginPath(); ctx.moveTo(10, 52); ctx.lineTo(100, 52); ctx.lineTo(112, 38); ctx.lineTo(24, 38); ctx.closePath(); ctx.fillStyle = '#fffdf6'; ctx.fill(); line(ctx);
    circle(ctx, 62, 34, 10); ctx.fillStyle = '#d0182e'; ctx.fill(); line(ctx, 2.5); ctx.fillStyle = 'rgba(255,255,255,.6)'; circle(ctx, 59, 31, 3); ctx.fill();
  };
  ICON.iconCherries = function (ctx) {
    var c = [[38, 82], [82, 86]], i;
    ctx.strokeStyle = '#5a7a22'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    for (i = 0; i < 2; i++) { ctx.beginPath(); ctx.moveTo(c[i][0], c[i][1] - 20); ctx.quadraticCurveTo(52 + i * 14, 20, 64, 12); ctx.stroke(); }
    ell(ctx, 76, 14, 14, 6, -0.4); ctx.fillStyle = '#5fb832'; ctx.fill(); line(ctx, 2.5);
    for (i = 0; i < 2; i++) {
      var g = ctx.createRadialGradient(c[i][0] - 7, c[i][1] - 9, 2, c[i][0], c[i][1], 28);
      g.addColorStop(0, '#ff6a6a'); g.addColorStop(0.6, '#d0182e'); g.addColorStop(1, '#8a0e20');
      circle(ctx, c[i][0], c[i][1], 24); ctx.fillStyle = g; ctx.fill(); line(ctx);
      ctx.fillStyle = 'rgba(255,255,255,.55)'; ell(ctx, c[i][0] - 9, c[i][1] - 10, 6, 3.5, -0.6); ctx.fill();
    }
  };
  ICON.iconPepper = function (ctx) {
    ctx.save(); ctx.translate(60, 62); ctx.rotate(-0.55);
    ctx.beginPath(); ctx.moveTo(-50, 8); ctx.bezierCurveTo(-42, -24, 34, -26, 46, -2); ctx.bezierCurveTo(32, 16, -30, 24, -50, 8); ctx.closePath();
    ctx.fillStyle = lg(ctx, -24, 22, [[0, '#a6e062'], [0.5, '#58a62a'], [1, '#2f6a14']]); ctx.fill();
    ctx.save(); ctx.clip(); ctx.fillStyle = 'rgba(30,20,0,.45)'; var r = rng(3);
    for (var i = 0; i < 7; i++) { ell(ctx, -36 + r() * 76, -12 + r() * 26, 5 + r() * 6, 3 + r() * 3, r() * 3); ctx.fill(); }
    ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.fillRect(-34, -14, 60, 3); ctx.restore(); line(ctx);
    rr(ctx, 42, -9, 14, 14, 4); ctx.fillStyle = '#6a4a1a'; ctx.fill(); line(ctx, 2.5);
    ctx.restore();
  };

  ICON.iconPickle = function (ctx) {
    ctx.beginPath();
    for (var a2 = 0; a2 <= TAU + 0.05; a2 += 0.04) { var r = 42 + Math.sin(a2 * 16) * 2.2, x = 60 + Math.cos(a2) * r, y = 62 + Math.sin(a2) * r; if (a2 === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
    ctx.closePath(); ctx.fillStyle = lg(ctx, 20, 104, [[0, '#5f9a2a'], [1, '#2f5a14']]); ctx.fill(); line(ctx);
    circle(ctx, 60, 62, 33); ctx.fillStyle = '#e2ecb0'; ctx.fill(); ctx.strokeStyle = 'rgba(70,110,20,.5)'; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.fillStyle = '#b9cf72';
    for (var i = 0; i < 3; i++) { ctx.save(); ctx.translate(60, 62); ctx.rotate(i * 2.094 - 1.57); ell(ctx, 15, 0, 11, 6); ctx.fill(); ctx.restore(); }
    ctx.fillStyle = 'rgba(255,255,255,.4)'; ell(ctx, 42, 38, 9, 4, -0.7); ctx.fill();
  };
  ICON.iconPancake = function (ctx) {
    rr(ctx, 12, 56, 96, 34, [14, 14, 18, 18]); ctx.fillStyle = lg(ctx, 56, 90, [[0, '#e8ad5c'], [1, '#b9732a']]); ctx.fill(); line(ctx);
    ell(ctx, 60, 58, 48, 16); ctx.fillStyle = lg(ctx, 42, 74, [[0, '#fbdca0'], [1, '#e9b062']]); ctx.fill(); line(ctx);
    ctx.fillStyle = 'rgba(190,120,40,.4)'; var r = rng(5); for (var i = 0; i < 9; i++) { ell(ctx, 28 + r() * 64, 52 + r() * 12, 3 + r() * 4, 1.6 + r() * 2, 0); ctx.fill(); }
    rr(ctx, 46, 44, 28, 16, 4); ctx.fillStyle = lg(ctx, 44, 60, [[0, '#fff3a0'], [1, '#f6c92a']]); ctx.fill(); line(ctx, 2.5);
  };
  ICON.iconJar = function (ctx, w, h, o) {
    rr(ctx, 28, 36, 64, 68, 14); ctx.fillStyle = lg(ctx, 36, 104, [[0, '#ffd96a'], [1, o.c]]); ctx.fill(); line(ctx);
    ctx.save(); ctx.clip(); ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.fillRect(34, 42, 8, 54); ctx.restore();
    rr(ctx, 32, 22, 56, 18, 6); ctx.fillStyle = '#9a6a3a'; ctx.fill(); line(ctx, 2.5);
    rr(ctx, 40, 58, 40, 28, 6); ctx.fillStyle = '#fff6dc'; ctx.fill(); ctx.strokeStyle = 'rgba(120,70,20,.5)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#d98a00'; ctx.beginPath(); ctx.moveTo(60, 64); ctx.quadraticCurveTo(70, 74, 60, 82); ctx.quadraticCurveTo(50, 74, 60, 64); ctx.fill();
  };
  ICON.iconSausage = function (ctx) {
    ctx.save(); ctx.translate(60, 62); ctx.rotate(-0.5);
    rr(ctx, -52, -20, 104, 40, 20); ctx.fillStyle = lg(ctx, -20, 20, [[0, '#f09a80'], [0.5, '#c0502e'], [1, '#7a2414']]); ctx.fill();
    ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(60,10,0,.3)'; ctx.lineWidth = 3;
    for (var x = -34; x < 40; x += 22) { ctx.beginPath(); ctx.moveTo(x, -20); ctx.lineTo(x + 8, 20); ctx.stroke(); }
    ctx.fillStyle = 'rgba(255,255,255,.4)'; rr(ctx, -42, -15, 80, 6, 3); ctx.fill(); ctx.restore();
    rr(ctx, -52, -20, 104, 40, 20); line(ctx); ctx.restore();
  };
  ICON.iconBottle = function (ctx, w, h, o) {
    ctx.beginPath(); ctx.moveTo(52, 22); ctx.lineTo(68, 22); ctx.lineTo(72, 40); ctx.lineTo(48, 40); ctx.closePath(); ctx.fillStyle = o.cap; ctx.fill(); line(ctx, 2.5);
    ctx.beginPath(); ctx.moveTo(58, 8); ctx.lineTo(62, 8); ctx.lineTo(66, 22); ctx.lineTo(54, 22); ctx.closePath(); ctx.fillStyle = o.c; ctx.fill(); line(ctx, 2.5);
    rr(ctx, 36, 38, 48, 70, [10, 10, 16, 16]); ctx.fillStyle = lg(ctx, 38, 108, [[0, o.c], [1, o.c]]); ctx.fill();
    ctx.save(); ctx.clip(); ctx.fillStyle = 'rgba(255,255,255,.32)'; ctx.fillRect(42, 44, 8, 54); ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fillRect(72, 40, 14, 70);
    ctx.fillStyle = '#fff'; rr(ctx, 44, 62, 32, 22, 6); ctx.fill(); ctx.restore();
    rr(ctx, 36, 38, 48, 70, [10, 10, 16, 16]); line(ctx);
  };
  ICON.iconDough = function (ctx) {
    circle(ctx, 60, 62, 44); ctx.fillStyle = lg(ctx, 18, 106, [[0, '#f6cf84'], [1, '#d49a42']]); ctx.fill(); line(ctx);
    circle(ctx, 60, 62, 33); ctx.fillStyle = '#fde8b4'; ctx.fill(); ctx.strokeStyle = 'rgba(170,110,40,.5)'; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.fillStyle = 'rgba(190,120,40,.35)'; var r = rng(12); for (var i = 0; i < 14; i++) { circle(ctx, 60 + (r() - 0.5) * 50, 62 + (r() - 0.5) * 50, 1.5 + r() * 2); ctx.fill(); }
    ctx.fillStyle = 'rgba(255,255,255,.4)'; ell(ctx, 40, 36, 12, 5, -0.7); ctx.fill();
  };
  ICON.iconMushroom = function (ctx) {
    rr(ctx, 44, 60, 32, 44, 12); ctx.fillStyle = lg(ctx, 60, 104, [[0, '#f6ead6'], [1, '#c9ab82']]); ctx.fill(); line(ctx);
    ctx.beginPath(); ctx.moveTo(10, 66); ctx.bezierCurveTo(8, 14, 112, 14, 110, 66); ctx.quadraticCurveTo(60, 76, 10, 66); ctx.closePath();
    ctx.fillStyle = lg(ctx, 20, 70, [[0, '#c48e5c'], [1, '#8a5a30']]); ctx.fill(); line(ctx);
    ctx.fillStyle = 'rgba(255,240,220,.4)'; [[34, 36, 6], [66, 30, 5], [82, 46, 4]].forEach(function (s) { circle(ctx, s[0], s[1], s[2]); ctx.fill(); });
    ctx.fillStyle = 'rgba(255,255,255,.35)'; ell(ctx, 34, 28, 14, 5, -0.5); ctx.fill();
  };
  ICON.iconWaffle = function (ctx) {
    ctx.save(); ctx.translate(60, 62); ctx.rotate(-0.2);
    rr(ctx, -44, -44, 88, 88, 12); ctx.fillStyle = lg(ctx, -44, 44, [[0, '#f8d584'], [1, '#d9983c']]); ctx.fill();
    ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(120,64,10,.55)'; ctx.lineWidth = 4;
    for (var i = -26; i <= 26; i += 22) { ctx.beginPath(); ctx.moveTo(i, -44); ctx.lineTo(i, 44); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-44, i); ctx.lineTo(44, i); ctx.stroke(); }
    ctx.restore(); rr(ctx, -44, -44, 88, 88, 12); line(ctx); ctx.restore();
  };
  ICON.iconBanana = function (ctx) {
    ctx.beginPath(); ctx.moveTo(22, 30); ctx.bezierCurveTo(14, 98, 84, 116, 108, 56); ctx.bezierCurveTo(88, 82, 48, 86, 34, 40); ctx.closePath();
    ctx.fillStyle = lg(ctx, 30, 110, [[0, '#fff08a'], [0.6, '#f6d23c'], [1, '#d4a01c']]); ctx.fill(); line(ctx);
    rr(ctx, 18, 16, 14, 18, 4); ctx.fillStyle = '#7a5a1a'; ctx.fill(); line(ctx, 2.5);
    ctx.beginPath(); ctx.arc(108, 56, 4, 0, 7); ctx.fillStyle = '#4a2f0a'; ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(30, 52); ctx.quadraticCurveTo(48, 92, 88, 88); ctx.stroke();
  };
  ICON.iconCup = function (ctx) {
    circle(ctx, 60, 44, 28); ctx.fillStyle = '#ffd0de'; ctx.fill(); line(ctx);
    ctx.beginPath(); ctx.moveTo(14, 52); ctx.lineTo(106, 52); ctx.quadraticCurveTo(100, 94, 74, 98); ctx.lineTo(46, 98); ctx.quadraticCurveTo(20, 94, 14, 52); ctx.closePath();
    ctx.fillStyle = lg(ctx, 52, 98, [[0, 'rgba(225,244,255,.95)'], [1, 'rgba(140,196,236,.95)']]); ctx.fill(); line(ctx);
    rr(ctx, 34, 96, 52, 10, 5); ctx.fillStyle = '#a9cbe6'; ctx.fill(); line(ctx, 2.5);
    ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fillRect(24, 58, 7, 28);
  };
  ICON.iconScoop = function (ctx, w, h, o) {
    ctx.beginPath(); ctx.moveTo(32, 66); ctx.lineTo(88, 66); ctx.lineTo(60, 114); ctx.closePath(); ctx.fillStyle = lg(ctx, 66, 114, [[0, '#f0c070'], [1, '#c98a35']]); ctx.fill();
    ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(120,64,10,.5)'; ctx.lineWidth = 3;
    for (var i = -40; i < 160; i += 16) { ctx.beginPath(); ctx.moveTo(i, 60); ctx.lineTo(i + 40, 116); ctx.stroke(); ctx.beginPath(); ctx.moveTo(i + 40, 60); ctx.lineTo(i, 116); ctx.stroke(); }
    ctx.restore(); ctx.beginPath(); ctx.moveTo(32, 66); ctx.lineTo(88, 66); ctx.lineTo(60, 114); ctx.closePath(); line(ctx);
    ctx.beginPath(); ctx.moveTo(22, 60); for (var x = 22; x <= 98; x += 2) ctx.lineTo(x, 70 + Math.sin(x * 0.4) * 4); ctx.lineTo(98, 56); ctx.closePath(); ctx.fillStyle = o.c2; ctx.fill(); line(ctx);
    var g = ctx.createRadialGradient(48, 30, 3, 60, 42, 40); g.addColorStop(0, o.c1); g.addColorStop(1, o.c2);
    circle(ctx, 60, 42, 34); ctx.fillStyle = g; ctx.fill(); line(ctx);
    ctx.fillStyle = 'rgba(255,255,255,.5)'; ell(ctx, 46, 28, 9, 5, -0.6); ctx.fill();
  };

  /* ---------- sahne: tabak, tahta, kek standı, mutfak ---------- */
  function board(ctx, w) {
    ctx.fillStyle = 'rgba(0,0,0,.35)'; rr(ctx, 14, 38, w - 28, 14, 7); ctx.fill();
    rr(ctx, 10, 28, w - 20, 18, [4, 4, 10, 10]); ctx.fillStyle = '#8a5628'; ctx.fill(); line(ctx, 2.5);
    rr(ctx, 10, 8, w - 20, 28, 12); ctx.fillStyle = lg(ctx, 8, 36, [[0, '#e8b878'], [1, '#c48a4a']]); ctx.fill();
    ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(120,70,20,.22)'; ctx.lineWidth = 2;
    var r = rng(4); for (var i = 0; i < 14; i++) { var y = 10 + r() * 24; ctx.beginPath(); ctx.moveTo(10, y); ctx.bezierCurveTo(w * 0.3, y + 3, w * 0.6, y - 3, w - 10, y + 1); ctx.stroke(); }
    ctx.restore(); rr(ctx, 10, 8, w - 20, 28, 12); line(ctx, 2.5);
    ell(ctx, w - 40, 22, 11, 5); ctx.fillStyle = '#7a4a1c'; ctx.fill();
  }
  function stand(ctx, w) {
    ctx.fillStyle = 'rgba(0,0,0,.3)'; ell(ctx, w / 2, 70, 64, 6); ctx.fill();
    ctx.beginPath(); ctx.moveTo(w / 2 - 14, 44); ctx.lineTo(w / 2 + 14, 44); ctx.lineTo(w / 2 + 8, 64); ctx.lineTo(w / 2 - 8, 64); ctx.closePath(); ctx.fillStyle = lg(ctx, 44, 64, [[0, '#d9c4d8'], [1, '#a88aa6']]); ctx.fill(); line(ctx, 2.5);
    ell(ctx, w / 2, 66, 56, 8); ctx.fillStyle = '#d3bad2'; ctx.fill(); line(ctx, 2.5);
    ell(ctx, w / 2, 30, w / 2 - 6, 21); ctx.fillStyle = lg(ctx, 9, 51, [[0, '#fff8fd'], [1, '#d9c2d6']]); ctx.fill(); line(ctx, 2.5);
    ell(ctx, w / 2, 28, w / 2 - 38, 13); ctx.fillStyle = lg(ctx, 15, 41, [[0, '#efe0ec'], [1, '#fffafc']]); ctx.fill();
    ctx.strokeStyle = 'rgba(160,120,160,.45)'; ctx.lineWidth = 1.5; ctx.stroke();
  }

  /* ---------- sahne: tabak ve mutfak ---------- */
  function plate(ctx, w) {
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ell(ctx, w / 2, 40, w / 2 - 6, 13); ctx.fill();
    ell(ctx, w / 2, 30, w / 2 - 6, 21); ctx.fillStyle = lg(ctx, 9, 51, [[0, '#ffffff'], [1, '#cfc6b8']]); ctx.fill(); line(ctx, 2.5);
    ell(ctx, w / 2, 28, w / 2 - 38, 13); ctx.fillStyle = lg(ctx, 15, 41, [[0, '#e9e1d3'], [1, '#f8f4ec']]); ctx.fill();
    ctx.strokeStyle = 'rgba(120,100,70,.4)'; ctx.lineWidth = 1.5; ctx.stroke();
  }

  function kitchen(ctx, w, h) {
    var i, x, y, g, r;
    ctx.fillStyle = lg(ctx, 0, 700, [[0, '#2b1a12'], [0.4, '#5c3421'], [1, '#8a5430']]); ctx.fillRect(0, 0, w, 700);
    ctx.strokeStyle = 'rgba(255,225,180,.075)'; ctx.lineWidth = 2;
    for (y = 70, i = 0; y < 700; y += 30, i++) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      for (x = (i % 2) * 30; x < w; x += 60) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 30); ctx.stroke(); }
    }
    ctx.fillStyle = lg(ctx, 0, 72, [[0, '#0c1430'], [1, '#1b2850']]); ctx.fillRect(0, 0, w, 72);
    ctx.fillStyle = '#ff8a1f'; ctx.fillRect(0, 70, w, 4);
    ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(0, 74, w, 6);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    [[90, 80], [270, 80], [450, 80]].forEach(function (p) {
      g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 330);
      g.addColorStop(0, 'rgba(255,190,90,.34)'); g.addColorStop(1, 'rgba(255,190,90,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, 700);
    });
    g = ctx.createRadialGradient(270, 500, 20, 270, 500, 300);
    g.addColorStop(0, 'rgba(255,170,70,.28)'); g.addColorStop(1, 'rgba(255,170,70,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 280, w, 420);
    ctx.restore();

    ctx.fillStyle = '#1a2547'; rr(ctx, -4, 322, 104, 9, 4); ctx.fill(); ctx.strokeStyle = '#2f3f72'; ctx.lineWidth = 2; ctx.stroke();
    function hang(x0, draw) { ctx.strokeStyle = '#27345f'; ctx.fillStyle = '#27345f'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.save(); ctx.translate(x0, 331); draw(); ctx.restore(); }
    hang(18, function () { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 62); ctx.stroke(); rr(ctx, -9, 62, 18, 38, 8); ctx.fill(); });
    hang(48, function () { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 70); ctx.stroke(); circle(ctx, 0, 82, 13); ctx.fill(); });
    hang(80, function () { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 28); ctx.stroke(); circle(ctx, 0, 62, 24); ctx.fill(); });
    function shelf(y) { ctx.fillStyle = '#7a4a22'; rr(ctx, 440, y, 110, 10, 3); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(440, y + 10, 110, 4); }
    shelf(430); shelf(540);
    [['#e8531f', 458, 430], ['#d9a021', 488, 430], ['#4aa02c', 518, 430], ['#d23a2b', 464, 540], ['#2c6fc0', 498, 540]].forEach(function (j) {
      var hh = 40 + (j[1] % 3) * 6;
      ctx.fillStyle = j[0]; rr(ctx, j[1], j[2] - hh, 24, hh, 6); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.fillRect(j[1] + 4, j[2] - hh + 6, 4, hh - 14);
      ctx.fillStyle = '#e9e1d3'; rr(ctx, j[1] - 1, j[2] - hh - 7, 26, 9, 3); ctx.fill();
    });
    r = rng(3);
    for (i = 0; i < 18; i++) { ctx.fillStyle = 'rgba(255,200,120,' + (0.035 + r() * 0.05) + ')'; circle(ctx, r() * w, 290 + r() * 330, 10 + r() * 26); ctx.fill(); }
    ctx.fillStyle = lg(ctx, 634, 706, [[0, '#c98642'], [0.15, '#b5712e'], [1, '#7c4519']]); ctx.fillRect(0, 634, w, 72);
    ctx.fillStyle = 'rgba(255,235,190,.5)'; ctx.fillRect(0, 634, w, 3);
    ctx.fillStyle = 'rgba(60,25,0,.22)';
    for (x = 0; x < w; x += 90) { ctx.fillRect(x + 20, 650, 50, 2); ctx.fillRect(x + 50, 680, 34, 2); }
    ctx.fillStyle = lg(ctx, 706, h, [[0, '#17264a'], [1, '#080d20']]); ctx.fillRect(0, 706, w, h - 706);
    ctx.fillStyle = '#ff8a1f'; ctx.fillRect(0, 706, w, 4);
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(0, 710, w, 8);
    ctx.fillStyle = 'rgba(255,255,255,.04)'; for (x = 0; x < w; x += 54) ctx.fillRect(x, 720, 2, h - 720);
    g = ctx.createRadialGradient(w / 2, h * 0.5, h * 0.35, w / 2, h * 0.5, h * 0.78);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.5)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }

  /* ---------- kayıt tablosu (config'ten üretilir) ---------- */
  var DEFS = {
    plate: { w: 360, h: 56, draw: plate },
    board: { w: 360, h: 56, draw: board },
    stand: { w: 360, h: 74, draw: stand },
    bg_kitchen: { w: C.W, h: C.H, draw: kitchen, scale: 2 },
    logo: null                       // yalnızca dosya; yoksa HTML yazı logosu kullanılır
  };
  Object.keys(C.INGREDIENTS).forEach(function (key) {
    var ing = C.INGREDIENTS[key];
    DEFS[key] = { w: ing.w, h: ing.h, shade: true, draw: function (ctx, w, h) { ART[ing.art.fn](ctx, w, h, ing.art); } };
    DEFS['icon_' + key] = { w: 120, h: 120, draw: function (ctx, w, h) { ICON[ing.icon.fn](ctx, w, h, ing.icon); } };
  });

  var store = {}, custom = {}, urlCache = {};

  function makeProcedural(name, def) {
    var sc = def.scale || S, c = document.createElement('canvas');
    c.width = Math.round(def.w * sc); c.height = Math.round(def.h * sc);
    var ctx = c.getContext('2d'); ctx.scale(sc, sc);
    def.draw(ctx, def.w, def.h);
    if (def.shade) { // tüm malzemelere ortak ışık (üst) ve gölge (alt): hacim hissi
      ctx.save(); ctx.globalCompositeOperation = 'source-atop';
      var g = ctx.createLinearGradient(0, 0, 0, def.h);
      g.addColorStop(0, 'rgba(255,255,255,.22)'); g.addColorStop(0.35, 'rgba(255,255,255,0)'); g.addColorStop(0.72, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(50,15,0,.24)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, def.w, def.h); ctx.restore();
    }
    store[name] = c;
  }

  function tryFile(name) {
    return new Promise(function (resolve) {
      var rel = C.ASSET_FILES[name];
      if (!rel || !(C.TRY_ALL_FILES || C.AVAILABLE[name])) return resolve();
      var img = new Image(), done = false;
      function fin(ok) { if (done) return; done = true; if (ok) { store[name] = img; custom[name] = img.src; } resolve(); }
      img.onload = function () { fin(img.naturalWidth > 0); };
      img.onerror = function () { fin(false); };
      img.src = C.ASSET_DIR + rel + '.' + C.ASSET_EXT;
    });
  }

  MM.Assets = {
    /* Yedek görselleri hemen üretir, dosyaları paralel dener (en çok 2 sn bekler). */
    load: function () {
      var names = Object.keys(C.ASSET_FILES), i;
      for (i = 0; i < names.length; i++) if (DEFS[names[i]]) makeProcedural(names[i], DEFS[names[i]]);
      var extras = ['mascot'].map(function (n) { return new Promise(function (res) { var im = new Image(); im.onload = function () { store[n] = im; res(); }; im.onerror = res; im.src = C.ASSET_DIR + 'ui/' + n + '.png'; }); });
      var all = Promise.all(names.map(tryFile).concat(extras));
      var timeout = new Promise(function (r) { setTimeout(r, 2000); });
      return Promise.race([all, timeout]);
    },
    get: function (name) { return store[name]; },
    has: function (name) { return !!store[name]; },
    url: function (name) {
      if (custom[name]) return custom[name];
      if (!urlCache[name] && store[name]) urlCache[name] = store[name].toDataURL('image/png');
      return urlCache[name] || '';
    },
    isCustom: function (name) { return !!custom[name]; }
  };
})();
