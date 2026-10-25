// Service Worker — USXR Store PWA
const CACHE = 'usxrstore-v1';
const STATIC = [
  '/',
  '/index.html',
  '/streaming.html',
  '/gaming.html',
  '/multi.html',
  '/catalog.css',
  '/catalog.js',
  '/data.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC))
  );
});

self.addEventListener('fetch', e => {
  // API siempre en red (datos frescos)
  if (e.request.url.includes('/api/')) {
    e.respondWith(fetch(e.request).catch(() => new Response('{}', { headers: { 'Content-Type': 'application/json' } })));
    return;
  }
  // Archivos estáticos: cache primero
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
