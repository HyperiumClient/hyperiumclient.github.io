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
const isLocalhost = window.location.hostname === 'localhost'
  || window.location.hostname === '[::1]'
  || window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/);

self.addEventListener('install', function(event) {
  log('SW: install event in progress.');
  event.waitUntil(caches.open(CACHE_NAME).then(function(cache) {
    return cache.addAll(URLS_TO_CACHE);
  }).then(function() {
    log('SW: install completed');
  }));
});

self.addEventListener("fetch", function(event) {
  log('SW: fetch event in progress.');

  if (event.request.method !== 'GET') {
    log('SW: fetch event ignored.', event.request.method, event.request.url);
    return;
  }

  event.respondWith(caches.match(event.request).then(function(cached) {
    var networked = fetch(event.request).then(fetchedFromNetwork, unableToResolve).catch(unableToResolve);

    log(
      'SW: fetch event', cached
      ? '(cached)'
      : '(network)',
    event.request.url);
    return cached || networked;

    function fetchedFromNetwork(response) {
      var cacheCopy = response.clone();

      log('SW: fetch response from network.', event.request.url);

      caches.open(CACHE_NAME).then(function add(cache) {
        cache.put(event.request, cacheCopy);
      }).then(function() {
        log('SW: fetch response stored in cache.', event.request.url);
      });

      return response;
    }

    function unableToResolve() {
      log('SW: fetch request failed in both cache and network.');
      return new Response('<h1>Service Unavailable</h1>', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: new Headers({'Content-Type': 'text/html'})
      });
    }
  }));
});

self.addEventListener("activate", function(event) {
  log('SW: activate event in progress.');

  event.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.filter(function(key) {
      return !key.endsWith(CACHE_VERSION);
    }).map(function(key) {
      return caches.delete(key);
    }));
  }).then(function() {
    log('SW: activate completed.');
  }));
});

function log(string) {
  if (isLocalhost)
    console.log(string);
}
