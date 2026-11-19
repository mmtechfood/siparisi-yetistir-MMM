/* sw.js: çevrimdışı çalışma için service worker.
 * - Tüm oyun dosyaları ilk açılışta önbelleğe alınır (müzik dahil), sonra internetsiz oynanır.
 * - HTML/JS/CSS "önce ağ, olmazsa önbellek": yeni sürüm yayınlayınca telefonlar kendiliğinden güncellenir.
 * - Görsel ve müzik "önce önbellek": hızlı açılır, veri harcamaz.
 * Dosya ekler/silerseniz PRECACHE listesini ve VERSION'ı güncelleyin. */
var VERSION = 'v1';
var CACHE = 'siparisi-yetistir-' + VERSION;
var PRECACHE = [
  './', './index.html', './manifest.webmanifest',
  './css/style.css',
  './js/config.js', './js/storage.js', './js/audio.js', './js/assets.js', './js/orders.js', './js/fx.js',
  './js/mascot.js', './js/game.js', './js/render.js', './js/ui.js', './js/main.js',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png', './icons/favicon-48.png',
  './assets/img/ui/mascot.png', './assets/img/ui/mascot_menu.png', './assets/img/ui/glove.png',
  './assets/audio/music.mp3'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(PRECACHE); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k.indexOf('siparisi-yetistir-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

/* Müzik gibi medya dosyaları "Range" ister (özellikle iPhone Safari). Önbellekten parça keser. */
function rangeFromCache(req) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(req.url).then(function (res) {
      if (!res) return fetch(req);
      return res.arrayBuffer().then(function (buf) {
        var m = /bytes=(\d*)-(\d*)/.exec(req.headers.get('range') || '');
        var start = m && m[1] ? parseInt(m[1], 10) : 0;
        var end = m && m[2] ? parseInt(m[2], 10) : buf.byteLength - 1;
        if (end >= buf.byteLength) end = buf.byteLength - 1;
        return new Response(buf.slice(start, end + 1), {
          status: 206,
          headers: {
            'Content-Type': res.headers.get('Content-Type') || 'audio/mpeg',
            'Content-Range': 'bytes ' + start + '-' + end + '/' + buf.byteLength,
            'Content-Length': String(end - start + 1),
            'Accept-Ranges': 'bytes'
          }
        });
      });
    });
  });
}

function networkFirst(req) {
  return fetch(req).then(function (res) {
    if (res && res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
    return res;
  }).catch(function () {
    return caches.match(req, { ignoreSearch: true }).then(function (r) { return r || caches.match('./index.html'); });
  });
}

function cacheFirst(req) {
  return caches.match(req, { ignoreSearch: true }).then(function (r) {
    if (r) return r;
    return fetch(req).then(function (res) {
      if (res && res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
      return res;
    });
  });
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);

  // Google Fonts (Fredoka): bir kez inince önbellekten gelir
  if (url.origin !== location.origin) {
    if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
      e.respondWith(caches.open(CACHE + '-fonts').then(function (c) {
        return c.match(req).then(function (hit) {
          var net = fetch(req).then(function (res) { c.put(req, res.clone()); return res; }).catch(function () { return hit; });
          return hit || net;
        });
      }));
    }
    return;
  }

  if (req.headers.get('range')) { e.respondWith(rangeFromCache(req)); return; }

  var isCode = req.mode === 'navigate' || /\.(html|js|css|webmanifest|json)$/.test(url.pathname) || url.pathname.slice(-1) === '/';
  e.respondWith(isCode ? networkFirst(req) : cacheFirst(req));
});
