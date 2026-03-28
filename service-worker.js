const CACHE_NAME='fitnessrezepte-app-v12-style-story-sort';
const APP_SHELL=['./','./index.html','./manifest.webmanifest','./icons/icon.svg','./icons/icon-192.png','./icons/icon-512.png','./brand/logo.svg','./brand/logo-fit-coaching.png','./icons/favicon.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  const isImage=event.request.destination==='image' || url.pathname.includes('/images/') || url.pathname.includes('/brand/');
  const isHtml=event.request.mode==='navigate' || (event.request.destination==='' && url.pathname.endsWith('/index.html'));
  if(isImage || isHtml){
    event.respondWith(
      fetch(event.request,{cache:'no-store'}).then(response=>{
        if(response && response.status===200){
          const copy=response.clone();
          caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy)).catch(()=>{});
        }
        return response;
      }).catch(()=>caches.match(event.request).then(match=>match || (isHtml ? caches.match('./index.html') : Promise.reject('offline'))))
    );
    return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{
    if(!response || response.status!==200) return response;
    const copy=response.clone();
    caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy)).catch(()=>{});
    return response;
  })));
});