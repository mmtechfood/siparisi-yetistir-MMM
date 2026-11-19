/* storage.js: kişisel rekor ve son kupon (localStorage; erişilemezse bellekte tutar) */
(function () {
  'use strict';
  var MM = window.MM;
  var mem = { best: 0, games: 0, coupon: null };

  function read() {
    try {
      var raw = localStorage.getItem(MM.CONFIG.STORAGE_KEY);
      if (raw) { var d = JSON.parse(raw); mem = { best: d.best | 0, games: d.games | 0, coupon: d.coupon || null }; }
    } catch (e) { /* gizli mod vb. */ }
    return mem;
  }
  function write() {
    try { localStorage.setItem(MM.CONFIG.STORAGE_KEY, JSON.stringify(mem)); } catch (e) { /* yoksay */ }
  }

  MM.Storage = {
    get: function () { return read(); },
    /* Oyun bitince çağrılır; yeni rekor ise true döner. coupon: kazanılan kupon ya da null. */
    submit: function (score, coupon) {
      read();
      mem.games++;
      var isNew = score > mem.best;
      if (isNew) mem.best = score;
      if (coupon) mem.coupon = coupon;
      write();
      return isNew;
    }
  };
})();
