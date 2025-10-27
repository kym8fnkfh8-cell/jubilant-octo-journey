// service-worker.js — OSRS Planner v4.3g-fix
const CACHE_NAME = 'osrs-planner-v4-3g-fix';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './favicon.png',
  './icon-192.png',
  './icon-512.png',
  './animated-icon.gif'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k === CACHE_NAME ? null : caches.delete(k))))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  e.respondWith(
    caches.match(req).then(
      res =>
        res ||
        fetch(req)
          .then(net => {
            if (req.method === 'GET' && new URL(req.url).origin === location.origin) {
              caches.open(CACHE_NAME).then(c => c.put(req, net.clone()));
            }
            return net;
          })
          .catch(() => caches.match('./index.html'))
    )
  );
});
