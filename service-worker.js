const CACHE_VERSION = 'v1';
const CACHE_NAME = 'hyperiumclient-page-chache-' + CACHE_VERSION;
const URLS_TO_CACHE = [
  '/',
  '/favicon.png',
  '/css/main.css',
  '/js/main.js',
  '/images/arrow-drop-down.png',
  '/images/discord-large.png',
  '/images/discord-small.png',
  '/images/github.png',
  '/images/hyperium-small.png',
  '/images/mc-cinematic-blured.png',
  '/images/twitter.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(caches.open(CACHE_NAME).then(function(cache) {
    return cache.addAll(URLS_TO_CACHE);
  }));
});

self.addEventListener("fetch", function(event) {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(caches.match(event.request).then(function(cached) {
    var networked = fetch(event.request).then(fetchedFromNetwork, unableToResolve).catch(unableToResolve);
    return cached || networked;

    function fetchedFromNetwork(response) {
      var cacheCopy = response.clone();
      caches.open(CACHE_NAME).then(function add(cache) {
        cache.put(event.request, cacheCopy);
      });
      return response;
    }

    function unableToResolve() {
      console.error('SW: fetch request failed in both cache and network.', event.request.method, event.request.url);
      return new Response('<h1>Service Unavailable</h1>', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: new Headers({'Content-Type': 'text/html'})
      });
    }
  }));
});

self.addEventListener("activate", function(event) {
  event.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.filter(function(key) {
      return !key.endsWith(CACHE_VERSION);
    }).map(function(key) {
      return caches.delete(key);
    }));
  }));
});
