/* main.js: açılış, ekrana sığdırma ve ana döngü */
(function () {
  'use strict';
  var MM = window.MM, C = MM.CONFIG;
  var stage = document.getElementById('stage'), canvas = document.getElementById('scene');

  /* 540x960 sahneyi 9:16 oranını koruyarak ekrana sığdırır. */
  function fit() {
    var vv = window.visualViewport, vw = Math.round(vv ? vv.width : window.innerWidth), vh = Math.round(vv ? vv.height : window.innerHeight);
    var s = Math.min(vw / C.W, vh / C.H), dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    var x = (vw - C.W * s) / 2, y = (vh - C.H * s) / 2;
    stage.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + s + ')';
    MM.Renderer.resize(s, dpr);
  }

  function boot() {
    MM.Renderer.init(canvas);
    fit();
    window.addEventListener('resize', fit);
    if (window.visualViewport) window.visualViewport.addEventListener('resize', fit);
    window.addEventListener('orientationchange', function () { setTimeout(fit, 120); });
    MM.UI.init();

    var last = performance.now();
    function loop(now) {
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      MM.Game.update(dt);
      MM.Renderer.frame(dt, MM.Game);
      MM.UI.sync();
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  MM.Assets.load().then(boot);

  // Çevrimdışı çalışma + kurulabilirlik (yalnızca https veya localhost'ta)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () { /* yoksay */ }); });
  }
})();
