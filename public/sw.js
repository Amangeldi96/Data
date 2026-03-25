const CACHE_NAME = 'eni-cache-v3';
const OFFLINE_URL = '/index.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Башкы бетти сөзсүз каштайбыз
      return cache.addAll(['/', OFFLINE_URL]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Интернет бар болсо, файлдарды кашка сактап коёбуз
        const cln = response.clone();
        caches.open(CACHE_NAME).then(c => c.put(event.request, cln));
        return response;
      })
      .catch(() => {
        // Интернет жок болсо, каштан издейбиз
        return caches.match(event.request).then(res => res || caches.match(OFFLINE_URL));
      })
  );
});