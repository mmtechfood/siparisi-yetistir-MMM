/* orders.js: sipariş üretici. Her sipariş rastgele bir yemek seçer; yemeğin kendi malzeme seti vardır. */
(function () {
  'use strict';
  var MM = window.MM;

  function pick(arr, rand) { return arr[Math.floor(rand() * arr.length)]; }

  MM.Orders = {
    /* n: 0'dan başlayan sipariş sırası. prev: { key, dish } önceki sipariş. */
    create: function (n, prev, rand) {
      rand = rand || Math.random; prev = prev || {};
      var C = MM.CONFIG, dishes = Object.keys(C.DISHES).filter(function (k) { return C.DISHES[k].from <= n; });
      var cand = dishes.filter(function (k) { return k !== prev.dish; });
      if (!cand.length) cand = dishes;
      var dk = pick(cand, rand), d = C.DISHES[dk];
      var cap = d.pool.length + d.dups.length, count = Math.min(C.ORDER.middleCount(n), cap);
      var seq, key, tries = 0;
      do {
        var mid = d.must.slice(), cnt = {}, guard = 0, i;
        mid.forEach(function (k) { cnt[k] = (cnt[k] || 0) + 1; });
        while (mid.length < count && guard++ < 60) {
          var k = pick(d.pool, rand), lim = d.dups.indexOf(k) >= 0 ? 2 : 1;
          if ((cnt[k] || 0) < lim) { mid.push(k); cnt[k] = (cnt[k] || 0) + 1; }
        }
        for (i = mid.length - 1; i > 0; i--) { var j = Math.floor(rand() * (i + 1)), t = mid[i]; mid[i] = mid[j]; mid[j] = t; }
        if (d.first) d.first.slice().reverse().forEach(function (f) { var ix = mid.indexOf(f); if (ix > 0) { mid.splice(ix, 1); mid.unshift(f); } });
        seq = [d.base].concat(mid, [d.finish]);
        key = dk + ':' + seq.join(',');
        tries++;
      } while (key === prev.key && tries < 20);
      var g = C.GOLDEN, P = C.PATIENCE, golden = n >= g.from && rand() < g.chance;
      // müşteri sabrı: uzun sipariş daha çok süre, ama ilerledikçe ölçek düşer
      var scale = Math.max(P.min, 1 - n * P.decay) * (golden ? P.golden : 1);
      var patience = (P.base + seq.length * P.perStep) * scale;
      // butonların yeri belli bir siparişten sonra karışır
      var menu = d.menu.slice();
      if (n >= C.SHUFFLE_FROM) for (var a = menu.length - 1; a > 0; a--) { var b = Math.floor(rand() * (a + 1)), tmp = menu[a]; menu[a] = menu[b]; menu[b] = tmp; }
      return { id: n + 1, dish: dk, name: d.name, menu: menu, plate: d.plate, hot: d.hot, pick: d.pick, seq: seq, key: key, idx: 0, mistakes: 0,
               golden: golden, patience: patience, left: patience };
    }
  };
})();
