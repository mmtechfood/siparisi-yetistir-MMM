/* render.js: tüm canvas çizimi (arka plan, sipariş kartı, hamburger, efektler) */
(function () {
  'use strict';
  var MM = window.MM, C = MM.CONFIG, L = C.LAYOUT, I = C.INGREDIENTS, E = MM.Ease, A = MM.Assets, FX = MM.FX;
  var FONT = '"Fredoka","Baloo 2","Trebuchet MS","Arial Rounded MT Bold",system-ui,sans-serif';
  var cv, ctx, k = 1, t = 0;
  var DEFAULT_MENU = ['bun_bottom', 'patty', 'cheese', 'lettuce', 'tomato', 'bun_top'];

  function sprite(name, x, y, w, h) { var im = A.get(name); if (im) ctx.drawImage(im, x, y, w, h); }

  function text(str, x, y, size, fill, stroke, sw, align) {
    ctx.font = '700 ' + size + 'px ' + FONT;
    ctx.textAlign = align || 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    if (stroke) { ctx.lineWidth = sw || 6; ctx.strokeStyle = stroke; ctx.strokeText(str, x, y); }
    ctx.fillStyle = fill; ctx.fillText(str, x, y);
  }

  function rrect(x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  function starPath(r) {
    ctx.beginPath();
    for (var i = 0; i < 10; i++) {
      var a = (i / 10) * Math.PI * 2 - Math.PI / 2, rad = i % 2 ? r * 0.45 : r;
      if (i) ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad); else ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
    }
    ctx.closePath();
  }

  /* ---------- hamburger yığını ---------- */
  function drawItem(it, cx, g) {
    var ing = I[it.key], dy = 0, rot = it.tilt, sx = 1, sy = 1, alpha = 1;
    if (it.age < g.FALL) {
      var p = it.age / g.FALL;
      dy = -(1 - E.inQuad(p)) * 250; rot = it.tilt * (1 - p); alpha = Math.min(1, it.age / 0.07);
    } else {
      var a = it.age - g.FALL, kk = Math.sin(a * 32) * Math.exp(-a * 11) * 0.17;
      sy = 1 - kk; sx = 1 + kk * 0.6; rot = 0;
    }
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(cx, it.y + dy); ctx.rotate(rot); ctx.scale(sx, sy);
    ctx.shadowColor = 'rgba(40,15,0,.38)'; ctx.shadowBlur = 6; ctx.shadowOffsetY = 3;   // alttaki katmana düşen gölge
    sprite(ing.sprite, -ing.w / 2, -ing.h, ing.w, ing.h);
    ctx.restore();
  }

  /* tabak / servis tahtası / kek standı (yemeğe göre) */
  function drawPlate(name, cx, py) {
    var im = A.get(name) || A.get('plate'); if (!im) return;
    ctx.drawImage(im, cx - 190, py - 28, 380, 380 * im.height / im.width);
  }

  /* bitmiş sandviçin üstüne kürdan ve bayrak */
  function drawPick(g, cx) {
    var last = g.stack[g.stack.length - 1]; if (!last) return;
    var top = last.y - I[last.key].h, p = E.clamp01(g.serve.t / 0.2), len = 62 * E.outBack(p);
    ctx.save(); ctx.translate(cx + 34, top + 24);
    ctx.strokeStyle = '#d9b27a'; ctx.lineWidth = 3.5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -len); ctx.stroke();
    ctx.fillStyle = '#ff5a3c'; ctx.beginPath(); ctx.moveTo(0, -len); ctx.lineTo(30 * p, -len + 9); ctx.lineTo(0, -len + 18); ctx.closePath(); ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = '#7a1c10'; ctx.lineJoin = 'round'; ctx.stroke();
    ctx.restore();
  }

  function drawPlateAndStack(g, ox, oy, rot) {
    var cx = L.stackCX + ox;
    ctx.save();
    if (rot) { ctx.translate(cx, L.plateY); ctx.rotate(rot); ctx.translate(-cx, -L.plateY); }
    ctx.translate(0, oy || 0);
    drawPlate(g.order.plate || 'plate', cx, L.plateY);
    for (var i = 0; i < g.stack.length; i++) drawItem(g.stack[i], cx, g);
    if (g.serve && !g.serve.fail && g.order.pick) drawPick(g, cx);
    ctx.restore();
  }

  /* müşteri yüzü: sabır azaldıkça gülümseme somurtmaya döner */
  var SKINS = ['#f6c9a0', '#e8a878', '#c98a5c', '#f3d2b8', '#a8744a'], HAIRS = ['#3a2414', '#1f1a18', '#8a4a1c', '#c9a040', '#6a2a1a'];
  function drawCustomer(o, mood, happy) {
    var cx = 36, cy = -2, R = 27, sk = SKINS[o.id % 5], hr = HAIRS[(o.id * 3) % 5], angry = !happy && mood < 0.28, mid = !happy && !angry && mood < 0.55;
    ctx.save();
    if (angry) ctx.translate(Math.sin(t * 40) * 1.2, 0);
    ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.arc(cx + 2, cy + 5, R, 0, 7); ctx.fill();
    ctx.fillStyle = sk; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
    if (angry) { ctx.fillStyle = 'rgba(255,50,30,.38)'; ctx.fill(); }
    ctx.fillStyle = hr; ctx.beginPath(); ctx.arc(cx, cy, R, Math.PI, 0); ctx.quadraticCurveTo(cx + 12, cy - 8, cx, cy - 11); ctx.quadraticCurveTo(cx - 12, cy - 8, cx - R, cy); ctx.fill();
    ctx.lineWidth = 3; ctx.strokeStyle = '#5a2d0c'; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
    ctx.fillStyle = '#3a1a06'; ctx.beginPath(); ctx.arc(cx - 9, cy + 3, 3.2, 0, 7); ctx.arc(cx + 9, cy + 3, 3.2, 0, 7); ctx.fill();
    ctx.lineCap = 'round'; ctx.lineWidth = 3;
    ctx.beginPath();
    if (angry) { ctx.moveTo(cx - 15, cy - 4); ctx.lineTo(cx - 5, cy); ctx.moveTo(cx + 15, cy - 4); ctx.lineTo(cx + 5, cy); }
    ctx.stroke();
    ctx.beginPath();
    if (happy || mood >= 0.55) ctx.arc(cx, cy + 6, 9, 0.2 * Math.PI, 0.8 * Math.PI);
    else if (mid) { ctx.moveTo(cx - 7, cy + 14); ctx.lineTo(cx + 7, cy + 14); }
    else ctx.arc(cx, cy + 20, 9, 1.2 * Math.PI, 1.8 * Math.PI);
    ctx.stroke();
    if (happy || mood >= 0.55) { ctx.fillStyle = 'rgba(255,120,110,.45)'; ctx.beginPath(); ctx.arc(cx - 17, cy + 9, 4, 0, 7); ctx.arc(cx + 17, cy + 9, 4, 0, 7); ctx.fill(); }
    ctx.restore();
  }

  /* ---------- sipariş kartı ---------- */
  function drawCard(g, yOff, sc) {
    var o = g.order, c = L.card, w = c.w, h = c.h, i;
    ctx.save();
    ctx.translate(c.x + w / 2, c.y + h / 2 + yOff); ctx.scale(sc, sc); ctx.translate(-w / 2, -h / 2);
    if (g.shake > 0) ctx.rotate(Math.sin(t * 60) * 0.012 * g.shake);

    // kâğıt (altı tırtıklı fiş)
    function body() {
      ctx.beginPath(); ctx.moveTo(14, 0); ctx.lineTo(w - 14, 0); ctx.quadraticCurveTo(w, 0, w, 14);
      var teeth = 30, tw = w / teeth;
      ctx.lineTo(w, h - 8);
      for (var j = 0; j < teeth; j++) { ctx.lineTo(w - tw * (j + 0.5), h); ctx.lineTo(w - tw * (j + 1), h - 8); }
      ctx.lineTo(0, 14); ctx.quadraticCurveTo(0, 0, 14, 0); ctx.closePath();
    }
    ctx.save(); ctx.translate(0, 8); body(); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fill(); ctx.restore();
    body(); ctx.fillStyle = o.golden ? '#fff1b8' : '#fff4d8'; ctx.fill();
    ctx.save(); body(); ctx.clip();
    var gold = o.golden, hg = ctx.createLinearGradient(0, 0, 0, 36);
    if (gold) { hg.addColorStop(0, '#ffe45c'); hg.addColorStop(1, '#f0a400'); } else { hg.addColorStop(0, '#ff9a2e'); hg.addColorStop(1, '#f2730a'); }
    ctx.fillStyle = hg; ctx.fillRect(0, 0, w, 36);
    ctx.fillStyle = 'rgba(255,255,255,.28)'; ctx.fillRect(0, 0, w, 4);
    ctx.fillStyle = 'rgba(120,40,0,.35)'; ctx.fillRect(0, 36, w, 3);
    ctx.restore();
    body(); ctx.lineWidth = 3; ctx.strokeStyle = '#5a2d0c'; ctx.lineJoin = 'round'; ctx.stroke();

    var title = (gold ? 'ALTIN  ' : '') + o.name.toLocaleUpperCase('tr') + '  #' + o.id;
    text(title, 66, 19, title.length > 20 ? 18 : 21, gold ? '#4a2a00' : '#ffffff', gold ? '#ffe9a0' : '#8a3a00', 5, 'left');
    if (gold) {
      text('PUAN x' + C.GOLDEN.mult, w - 16, 19, 20, '#7a1a00', '#fff3b0', 5, 'right');
    } else {
      var tag = o.mistakes === 0;
      ctx.globalAlpha = tag ? 1 : 0.45;
      ctx.save(); ctx.translate(w - 150, 19); ctx.fillStyle = '#ffe14a'; starPath(10); ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = '#8a3a00'; ctx.stroke(); ctx.restore();
      text('HATASIZ +' + C.TIME.perfectBonus + ' SN', w - 16, 19, 17, '#ffffff', '#8a3a00', 4, 'right');
      ctx.globalAlpha = 1;
    }

    // müşteri sabrı çubuğu
    var frac = Math.max(0, o.left / o.patience), low = frac < 0.28, bw = w - 36;
    ctx.fillStyle = 'rgba(60,30,0,.2)'; rrect(18, 44, bw, 11, 5.5); ctx.fill();
    if (frac > 0.01) {
      var pc = frac > 0.55 ? '#5ac02f' : frac > 0.28 ? '#ffb21f' : '#f0341f';
      ctx.save(); ctx.globalAlpha = low ? 0.65 + 0.35 * Math.sin(t * 18) : 1; ctx.fillStyle = pc; rrect(18, 44, Math.max(11, bw * frac), 11, 5.5); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.4)'; rrect(22, 46, Math.max(5, bw * frac - 8), 3, 1.5); ctx.fill(); ctx.restore();
    }
    ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(90,45,12,.5)'; rrect(18, 44, bw, 11, 5.5); ctx.stroke();

    // sol: hedef yemek (mini)
    var seq = o.seq, total = 0, d;
    for (i = 0; i < seq.length; i++) total += i === seq.length - 1 ? I[seq[i]].h : I[seq[i]].step;
    var s = Math.min(0.5, 104 / total), by = h - 14, cx0 = 100;
    ctx.fillStyle = 'rgba(80,40,10,.16)'; ctx.beginPath(); ctx.ellipse(cx0, by + 4, 78, 9, 0, 0, 7); ctx.fill();
    var y = by;
    for (i = 0; i < seq.length; i++) {
      d = I[seq[i]];
      ctx.globalAlpha = i < o.idx ? 1 : 0.42;
      sprite(d.sprite, cx0 - (d.w * s) / 2, y - d.h * s, d.w * s, d.h * s);
      y -= d.step * s;
    }
    ctx.globalAlpha = 1;

    // sağ: sıralı malzeme çipleri
    var n = seq.length, per = n <= 4 ? n : Math.ceil(n / 2), rows = n <= 4 ? 1 : 2, cs = rows === 1 ? 62 : 52, gap = 8;
    var areaX = 196, areaW = w - areaX - 14, areaY = 62, areaH = h - 62 - 14;
    var pulse = 0.5 + 0.5 * Math.sin(t * 7);
    for (i = 0; i < n; i++) {
      var row = Math.floor(i / per), col = i % per, inRow = row === 0 ? per : n - per;
      var rowW = inRow * cs + (inRow - 1) * gap, rx = areaX + (areaW - rowW) / 2 + col * (cs + gap);
      var rowsH = rows * cs + (rows - 1) * gap, ry = areaY + (areaH - rowsH) / 2 + row * (cs + gap);
      var done = i < o.idx, cur = i === o.idx;
      ctx.save();
      if (cur) { ctx.translate(rx + cs / 2, ry + cs / 2); var ps = 1 + pulse * 0.06; ctx.scale(ps, ps); ctx.translate(-cs / 2, -cs / 2); rx = 0; ry = 0; }
      if (cur) { ctx.shadowColor = 'rgba(255,140,20,.9)'; ctx.shadowBlur = 14 + pulse * 8; }
      rrect(rx, ry, cs, cs, 14);
      ctx.fillStyle = done ? '#cdeeb6' : cur ? '#ffffff' : '#f4e0b4'; ctx.fill();
      ctx.shadowBlur = 0;
      ctx.lineWidth = cur ? 4 : 2.5; ctx.strokeStyle = done ? '#58a83a' : cur ? '#ff8a1f' : '#c9a66a'; ctx.stroke();
      ctx.globalAlpha = done ? 0.55 : 1;
      sprite(I[seq[i]].iconKey, rx + 5, ry + 6, cs - 10, cs - 10);
      ctx.globalAlpha = 1;
      // sıra numarası
      ctx.fillStyle = done ? '#58a83a' : '#2a3b6b'; ctx.beginPath(); ctx.arc(rx + 10, ry + 10, 9, 0, 7); ctx.fill();
      text(String(i + 1), rx + 10, ry + 11, 13, '#fff', null);
      if (done) { // onay işareti
        ctx.fillStyle = '#3f9e2a'; ctx.beginPath(); ctx.arc(rx + cs - 12, ry + cs - 12, 12, 0, 7); ctx.fill();
        ctx.lineWidth = 3.5; ctx.strokeStyle = '#fff'; ctx.lineCap = 'round'; ctx.beginPath();
        ctx.moveTo(rx + cs - 18, ry + cs - 12); ctx.lineTo(rx + cs - 13, ry + cs - 7); ctx.lineTo(rx + cs - 5, ry + cs - 17); ctx.stroke();
      }
      ctx.restore();
    }
    drawCustomer(o, Math.max(0, o.left / o.patience), !!(g.serve && !g.serve.fail));
    ctx.restore();
  }

  /* ---------- ekran durumları ---------- */
  function drawMenu(g) {
    var bob = Math.sin(g.menuT * 2) * 6, py = L.menuPlateY, cx = L.stackCX, i, key, ing, y = py - 4;
    var MENU_STACK = g.menuSeq || DEFAULT_MENU, ps = 0.86 + Math.sin(g.menuPop * Math.PI) * 0.05;
    ctx.save();
    ctx.translate(cx, py); ctx.scale(ps, ps); ctx.rotate(Math.sin(g.menuT * 1.2) * 0.02); ctx.translate(-cx, -py + bob);
    drawPlate((C.DISHES[g.menuDish] || {}).plate || 'plate', cx, py);
    for (i = 0; i < MENU_STACK.length; i++) {
      key = MENU_STACK[i]; ing = I[key];
      var jig = Math.sin(g.menuT * 3 + i * 0.7) * 1.8;
      sprite(ing.sprite, cx - ing.w / 2, y - ing.h + jig, ing.w, ing.h);
      y -= ing.step;
    }
    ctx.restore();
  }

  function drawPlay(g) {
    var introP = E.clamp01(g.introT / g.INTRO_DUR), ox = 0, rot = 0;
    if (g.serve) { var sp = E.clamp01(g.serve.t / g.SERVE_DUR); ox = E.inBack(sp) * 760; rot = sp * 0.12; }
    else if (introP < 1) ox = -(1 - E.outCubic(introP)) * 680;
    var cardOff = introP < 1 ? -(1 - E.outBack(introP)) * 230 : 0;
    if (g.state === 'countdown' && g.introT < 0) cardOff = -300;
    drawCard(g, cardOff, 1);
    drawPlateAndStack(g, ox, 0, rot);
  }

  function drawFX() {
    var i, p, a;
    for (i = 0; i < FX.parts.length; i++) {
      p = FX.parts[i]; a = 1 - Math.pow(p.life / p.max, 2);
      ctx.save(); ctx.globalAlpha = Math.max(0, a); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.color;
      if (p.shape === 'steam') { var k2 = p.life / p.max; ctx.globalAlpha = 0.34 * (1 - k2); ctx.beginPath(); ctx.arc(0, 0, p.size * (0.6 + k2 * 1.1), 0, 7); ctx.fill(); }
      else if (p.shape === 'star') { starPath(p.size); ctx.fill(); }
      else if (p.shape === 'rect') ctx.fillRect(-p.size / 2, -p.size * 0.3, p.size, p.size * 0.6);
      else { ctx.beginPath(); ctx.arc(0, 0, p.size / 2, 0, 7); ctx.fill(); }
      ctx.restore();
    }
    for (i = 0; i < FX.texts.length; i++) {
      p = FX.texts[i];
      var pop = Math.min(1, p.life / 0.15), sc = 0.6 + E.outBack(pop) * 0.4, fade = p.life > p.max - 0.3 ? (p.max - p.life) / 0.3 : 1;
      ctx.save(); ctx.globalAlpha = Math.max(0, fade); ctx.translate(p.x, p.y); ctx.scale(sc, sc);
      text(p.str, 0, 0, p.size, p.color, p.stroke, 8); ctx.restore();
    }
  }

  /* Kupon kazanıldı afişi */
  function drawBanner(b) {
    var p = Math.min(1, b.t / 0.35), out = b.t > 2.7 ? Math.max(0, (3.2 - b.t) / 0.5) : 1, sc = (0.5 + E.outBack(p) * 0.5);
    ctx.save(); ctx.globalAlpha = out; ctx.translate(270, 560); ctx.scale(sc, sc);
    rrect(-220, -62, 440, 124, 28);
    var g = ctx.createLinearGradient(0, -62, 0, 62); g.addColorStop(0, '#ffe45c'); g.addColorStop(1, '#ff9a1f');
    ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8; ctx.fillStyle = g; ctx.fill();
    ctx.shadowColor = 'transparent'; ctx.lineWidth = 5; ctx.strokeStyle = '#7a3a00'; ctx.stroke();
    text(b.text, 0, -26, 40, '#ffffff', '#7a3a00', 8);
    text(b.sub, 0, 22, b.sub.length > 24 ? 27 : 31, '#4a1c00', null);
    ctx.restore();
  }

  function drawCountdown(g) {
    var c = g.countdown(), sc = 0.55 + E.outBack(Math.min(1, c.p * 2)) * 0.6, a = c.p > 0.8 ? (1 - c.p) / 0.2 : 1;
    ctx.save(); ctx.globalAlpha = Math.max(0, a); ctx.translate(270, 470); ctx.scale(sc, sc);
    text(c.text, 0, 0, c.text.length > 1 ? 86 : 150, '#ffd23f', '#4a1c00', 14);
    ctx.restore();
  }

  /* ---------- ana kare ---------- */
  MM.Renderer = {
    init: function (canvas) { cv = canvas; ctx = cv.getContext('2d'); },
    resize: function (scale, dpr) {
      cv.width = Math.round(C.W * scale * dpr); cv.height = Math.round(C.H * scale * dpr); k = cv.width / C.W;
    },
    frame: function (dt, g) {
      t += dt;
      ctx.setTransform(k, 0, 0, k, 0, 0);
      ctx.clearRect(0, 0, C.W, C.H);
      sprite('bg_kitchen', 0, 0, C.W, C.H);
      ctx.save();
      if (g.shake > 0.01) ctx.translate((Math.random() - 0.5) * g.shake * 12, (Math.random() - 0.5) * g.shake * 8);
      if (g.state === 'menu' || !g.order) drawMenu(g); else { MM.Mascot.draw(ctx, t); drawPlay(g); }
      drawFX();
      ctx.restore();
      if (g.flash > 0.01) { // yanlış: kırmızı kenar
        var gr = ctx.createRadialGradient(270, 480, 200, 270, 480, 620);
        gr.addColorStop(0, 'rgba(255,40,30,0)'); gr.addColorStop(1, 'rgba(255,40,30,' + (g.flash * 0.5) + ')');
        ctx.fillStyle = gr; ctx.fillRect(0, 0, C.W, C.H);
      }
      if (g.state === 'playing' && g.time <= 10 && g.time > 0) { // son 10 sn nabız
        var pa = (0.5 + 0.5 * Math.sin(t * 8)) * 0.18, gg = ctx.createRadialGradient(270, 480, 260, 270, 480, 640);
        gg.addColorStop(0, 'rgba(255,60,40,0)'); gg.addColorStop(1, 'rgba(255,60,40,' + pa + ')');
        ctx.fillStyle = gg; ctx.fillRect(0, 0, C.W, C.H);
      }
      if (g.state === 'countdown') drawCountdown(g);
      if (g.state !== 'menu' && g.order) MM.Mascot.drawBubble(ctx);
      if (g.banner) drawBanner(g.banner);
    }
  };
})();
