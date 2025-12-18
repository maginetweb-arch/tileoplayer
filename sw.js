const CACHE_NAME = 'tileoplay-v18';
const ASSETS_TO_CACHE = [
  '/tileoplay/assets/index.html',
  '/tileoplay/assets/manifest.json',
  '/tileoplay/assets/img/icon-192.png',
  '/tileoplay/assets/img/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache v18');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (!url.protocol.startsWith('http')) return;

  // Non cachare stream multimediali o pagine PHP dinamiche
  if (url.pathname.endsWith('.m3u8') || 
      url.pathname.endsWith('.ts') || 
      url.pathname.endsWith('.mp3') || 
      url.pathname.endsWith('.aac') ||
      url.pathname.endsWith('.php')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }).catch(() => {
      // Offline fallback
    })
  );
});