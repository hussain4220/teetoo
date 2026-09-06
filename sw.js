/* TeeToo service worker — network-first (site hamesha fresh), offline par cached shell */
const CACHE='teetoo-v1';
const SHELL=['/','/manifest.json','/icon-192.png','/icon-512.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).catch(()=>{})); self.skipWaiting(); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const u=new URL(e.request.url);
  if(u.origin!==location.origin) return;              /* Firebase/CDN ko na chherein */
  e.respondWith(
    fetch(e.request).then(r=>{ const cp=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,cp)).catch(()=>{}); return r; })
    .catch(()=>caches.match(e.request).then(m=>m||caches.match('/')))
  );
});
