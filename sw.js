// Service Worker — USXR Store PWA v2
const CACHE = 'usxrstore-v2';
const STATIC = ['/', '/streaming', '/recargas', '/multiservicios',
  '/catalog.css', '/catalog.js', '/data.js'];

// Mapa de URLs limpias
const CLEAN = {
  '/index.html':     '/',
  '/streaming.html': '/streaming',
  '/gaming.html':    '/recargas',
  '/multi.html':     '/multiservicios'
};

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Redirigir URLs con .html a rutas limpias
  if (CLEAN[url.pathname]) {
    e.respondWith(Response.redirect(url.origin + CLEAN[url.pathname], 301));
    return;
  }

  // API siempre en red
  if (url.pathname.startsWith('/api/')) {
    e.respondWith(fetch(e.request).catch(() =>
      new Response('{}', { headers: { 'Content-Type': 'application/json' } })
    ));
    return;
  }

  // Cache first para estáticos
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
