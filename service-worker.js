const CACHE_VERSION = 'v3';
const CACHE_NAME = 'hyperiumclient-page-cache-' + CACHE_VERSION;
const PRECACHE_URLS = [
  '/',
  '/favicon.png',
  '/css/main.css',
  '/js/common.js',
  '/js/pages/index.js',
  '/js/pages/downloads.js',
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
    return cache.addAll(PRECACHE_URLS);
  }).then(self.skipWaiting()));
});

self.addEventListener("fetch", function(event) {
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(caches.match(event.request).then(function(cached) {
    var networked = fetch(event.request).then(fetchedFromNetwork, unableToResolve).catch(unableToResolve);
    return cached || networked;

    function fetchedFromNetwork(response) {
      var cloned = response.clone();
      caches.open(CACHE_NAME).then(function add(cache) {
        cache.put(event.request, cloned);
      });
      return response;
    }

    function unableToResolve(response) {
      console.error('SW: fetch request failed in both cache and network.', event.request, response);
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
