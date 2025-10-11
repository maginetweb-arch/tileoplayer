self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('iptv-cache').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/app.js',
        '/manifest.json',
        '/icon.png',
        'https://cdn.jsdelivr.net/npm/hls.js@latest',
        'https://cdn.dashjs.org/latest/dash.all.min.js'
      ]);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
