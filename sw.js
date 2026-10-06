// Orbit: guarda la app en el iPhone para usarla sin internet.
const V='orbit-v47';
const CORE=['./','./index.html','./manifest.webmanifest','./jspdf.umd.min.js','./xlsx.full.min.js','./car.webp','./house.webp','./cat.webp','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET')return;
  const u=new URL(r.url);
  const font=/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if(u.origin!==location.origin&&!font)return;
  if(r.mode==='navigate'){
    // red primero para recibir actualizaciones; sin red, la copia guardada
    const sub=!/\/Orbit\/(index\.html)?$/i.test(u.pathname);
    e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(V).then(x=>x.put(sub?r:'./index.html',c));return res}).catch(()=>caches.match(sub?r:'./index.html').then(m=>m||caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const c=res.clone();caches.open(V).then(x=>x.put(r,c))}return res})));
});
