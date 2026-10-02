const V='guia-v18d';
const F=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(V).then(c=>c.addAll(F)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys()
      .then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;

  const url=new URL(e.request.url);
  const isImage=e.request.destination==='image';

  if(isImage && url.origin!==self.location.origin){
    /* Imagens externas: tenta a rede primeiro para evitar servir uma resposta antiga. */
    e.respondWith(
      fetch(e.request, {cache:'no-store'})
        .then(r=>{
          if(r.ok){
            const copy=r.clone();
            caches.open(V).then(c=>c.put(e.request,copy));
          }
          return r;
        })
        .catch(()=>caches.match(e.request))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(r=>
      r || fetch(e.request).then(n=>{
        const c=n.clone();
        caches.open(V).then(x=>x.put(e.request,c));
        return n;
      })
    )
  );
});