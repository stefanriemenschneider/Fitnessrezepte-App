const CACHE_NAME='fitnessrezepte-app-v7-unified-premium';
const URLS=[
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './brand/logo.svg',
  './brand/logo-fit-coaching.png',
  './icons/favicon.png',
  './images/protein-pancakes.jpg',
  './images/chicken-rice-bowl.jpg',
  './images/skyr-berry-cup.jpg',
  './images/salmon-sweetpotato.jpg',
  './images/tuna-wrap.jpg',
  './images/overnight-oats.jpg',
  './images/turkey-pasta.jpg',
  './images/egg-avocado-toast.jpg',
  './images/cottage-cheese-bowl.jpg',
  './images/beef-burger-bowl.jpg',
  './images/protein-mug-cake.jpg',
  './images/shrimp-couscous.jpg'
];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(URLS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  event.respondWith(
    caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{
      if(!response || response.status!==200) return response;
      const copy=response.clone();
      caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy)).catch(()=>{});
      return response;
    }).catch(()=>caches.match('./index.html')))
  );
});
