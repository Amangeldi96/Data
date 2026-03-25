// public/sw.js
const CACHE_NAME = 'eni-v2';
const assetsToCache = [
  '/',
  '/index.html',
  // Бул жерге башка файлдарды жазуунун кереги жок, 
  // анткени Vite аларды динамикалык түрдө өзгөртөт.
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(assetsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Эгер кэште болсо бер, болбосо интернеттен ал жана кэшке сакта
      return response || fetch(event.request).then(fetchRes => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request.url, fetchRes.clone());
          return fetchRes;
        });
      });
    }).catch(() => caches.match('/')) // Интернет такыр жок болсо башкы бетти бер
  );
});