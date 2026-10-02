const V='guia-v18e-local-images';
const F=["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./images/escrita.jpg", "./images/gestao-cliente-furioso.svg", "./images/gestao-conta-em-risco.svg", "./images/gestao-crm.svg", "./images/gestao-oportunidade-de-expans-o.svg", "./images/gestao-qbr.svg", "./images/gestao-sla-em-risco.svg", "./images/gramatica.jpg", "./images/portugues-comunica-o-oral.svg", "./images/portugues-escrita-profissional.svg", "./images/portugues-leitura.svg", "./images/redes-desempenho.svg", "./images/redes-dhcp-ipv4.svg", "./images/redes-diagn-stico-de-redes.svg", "./images/redes-dns-web.svg", "./images/redes-gateway-responde.svg", "./images/redes-ip-169-254-x-x.svg", "./images/redes-lan-switch.svg", "./images/redes-rede-lenta.svg", "./images/redes-roteamento-isp.svg", "./images/redes-sem-internet.svg", "./images/redes-site-n-o-abre.svg", "./images/redes-um-pc-sem-rede.svg", "./images/vocab.jpg"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(F)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const url=new URL(e.request.url);
  // Never replace an external image response with index.html.
  // Cross-origin assets are fetched directly so a failed image stays a failed image.
  if(url.origin!==self.location.origin){ return; }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(n=>{
    if(n.ok){ const c=n.clone(); caches.open(V).then(x=>x.put(e.request,c)); }
    return n;
  }).catch(()=>new Response('Offline',{status:503,headers:{'Content-Type':'text/plain'}}))));
});
