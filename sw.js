/* Network-first for page loads, cache fallback so the app opens offline.
   Only intercepts navigations — Supabase and map-tile requests pass straight through. */
const C = 'trip-v12';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(C).then(c => c.add('./')).catch(() => {}).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== C).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', e => {
  if (e.request.mode !== 'navigate') return;
  e.respondWith((async () => {
    try {
      const r = await fetch(e.request);
      const c = await caches.open(C);
      c.put('./', r.clone());
      return r;
    } catch {
      const c = await caches.open(C);
      return (await c.match('./')) || Response.error();
    }
  })());
});
