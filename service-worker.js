const CACHE_NAME = 'osrs-planner-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  event.respondWith(
    caches.match(req).then((res) => res || fetch(req).then((netRes) => {
      // For same-origin GET requests, update cache
      if (req.method === 'GET' && new URL(req.url).origin === location.origin) {
        const clone = netRes.clone();
        caches.open(CACHE_NAME).then((cache)=> cache.put(req, clone));
      }
      return netRes;
    }).catch(() => caches.match('./index.html')))
  );
});