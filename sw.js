self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('iptv-cache').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/app.js',
        '/style.css',
        '/manifest.json',
        'https://cdn.jsdelivr.net/npm/hls.js@latest'
      ]);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
