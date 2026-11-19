/* fx.js: parçacık ve yüzen yazı efektleri (çizimi render.js yapar) */
(function () {
  'use strict';
  var MM = window.MM;
  var MAX_PARTS = 260;

  var FX = (MM.FX = {
    parts: [],
    texts: [],

    spawn: function (p) {
      if (this.parts.length >= MAX_PARTS) this.parts.shift();
      this.parts.push({
        x: p.x, y: p.y, vx: p.vx || 0, vy: p.vy || 0, g: p.g == null ? 520 : p.g,
        rot: p.rot || 0, vr: p.vr || 0, size: p.size || 6, color: p.color || '#fff',
        shape: p.shape || 'circle', life: 0, max: p.max || 0.8, drag: p.drag || 0
      });
    },

    /* Yıldız/daire patlaması */
    burst: function (x, y, n, colors, o) {
      o = o || {};
      for (var i = 0; i < n; i++) {
        var a = Math.random() * Math.PI * 2, s = (o.speed || 260) * (0.4 + Math.random() * 0.6);
        this.spawn({
          x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - (o.up || 0),
          g: o.g == null ? 520 : o.g, size: (o.size || 7) * (0.6 + Math.random() * 0.8),
          color: colors[i % colors.length], shape: o.shape || 'star',
          rot: Math.random() * 6, vr: (Math.random() - 0.5) * 10, max: (o.max || 0.7) * (0.7 + Math.random() * 0.5)
        });
      }
    },

    confetti: function (x, y, n) {
      var cols = ['#ffd23f', '#ff8a1f', '#ff4d4d', '#5ad66f', '#4db8ff', '#ffffff'];
      for (var i = 0; i < n; i++) {
        var a = -Math.PI / 2 + (Math.random() - 0.5) * 2.2, s = 280 + Math.random() * 380;
        this.spawn({
          x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, g: 760,
          size: 6 + Math.random() * 6, color: cols[i % cols.length], shape: 'rect',
          rot: Math.random() * 6, vr: (Math.random() - 0.5) * 18, max: 1.1 + Math.random() * 0.6, drag: 0.6
        });
      }
    },

    text: function (x, y, str, o) {
      o = o || {};
      this.texts.push({
        x: x, y: y, str: str, color: o.color || '#ffd23f', stroke: o.stroke || '#3a1a06',
        size: o.size || 40, life: 0, max: o.max || 0.95, vy: o.vy == null ? -70 : o.vy
      });
    },

    update: function (dt) {
      var i, p;
      for (i = this.parts.length - 1; i >= 0; i--) {
        p = this.parts[i];
        p.life += dt;
        if (p.life >= p.max) { this.parts.splice(i, 1); continue; }
        if (p.drag) { var d = Math.max(0, 1 - p.drag * dt); p.vx *= d; p.vy *= d; }
        p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
      }
      for (i = this.texts.length - 1; i >= 0; i--) {
        var t = this.texts[i];
        t.life += dt;
        if (t.life >= t.max) { this.texts.splice(i, 1); continue; }
        t.y += t.vy * dt;
      }
    },

    clear: function () { this.parts.length = 0; this.texts.length = 0; }
  });
})();
