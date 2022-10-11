const cacheName = 'cacheAssets-v10';

/**
 * On Install Event
 * Triggered when the service worker is installed
 */
self.addEventListener('install', function (event) {

  // This causes your service worker to kick out the 
  // current active worker and activate itself as 
  // soon as it enters the waiting phase .
  self.skipWaiting();

  // Cache some assets during the SW intallation.
  // It makes sure to wait for the caching before
  // continuing to the next cycle.
  event.waitUntil(
    caches.open(cacheName)
      .then(function (cache) {
        cache.addAll([
          '/',
          '/index.html',
          '/manifest.json',
          '/css/styles.css',
          '/js/scripts.js',
          '/images/logo.png',
          '/pages/add/',
          '/pages/add/index.html',
          '/pages/add/styles.css',
          '/pages/list/',
          '/pages/list/index.html',
          '/pages/list/styles.css',
          '/icons/favicon-196.png',
          '/icons/manifest-icon-192.maskable.png',
          '/offline.html'
        ])
      })
  );
});

/**
 * On Activate Event
 * Triggered when the service worker is activated
 */
self.addEventListener('activate', function (event) {

  // When a service worker is initially registered,
  // pages won't use it until they next load. 
  // The claim() method causes those pages to be 
  // controlled immediately.
  event.waitUntil(clients.claim());

  // Delete the old versions of the cache
  event.waitUntil(
    caches.keys()
      .then(function (cacheNames) {
        return Promise.all(
          cacheNames
            .filter(item => item !== cacheName)
            .map(item => caches.delete(item))
        )
      })
  );

});

/**
 * On Fetch Event
 * Triggered when the service worker retrieves an asset
 */
self.addEventListener('fetch', function (event) {

  // // Cache strategy: Cache Only
  // event.respondWith(
  //   caches.open(cacheName)
  //     .then(function (cache) {
  //       return cache.match(event.request)
  //         .then(function (response) {
  //           return response;
  //         })
  //     })
  // );

  // // Cache strategy: Cache Only (alternative)
  // event.respondWith(
  //   caches.open(cacheName)
  //     .then(function (cache) {
  //       return cache.match(event.request)
  //     })
  // );

  // // Cache strategy: Network Only
  // event.respondWith(
  //   fetch(event.request)
  //     .then(function (response) {
  //       return response
  //     })
  // );

  // // Cache strategy: Network Only (alternative)
  // event.respondWith(
  //   fetch(event.request)
  // );

  // // Cache strategy: Cache with Network Fallback Example
  // event.respondWith(
  //   caches.open(cacheName)
  //     .then(function (cache) {
  //       return cache.match(event.request)
  //         .then(function (response) {
  //           return response || fetch(event.request);
  //         })
  //     })
  // );

  // // Cache strategy: Network with Cache Fallback
  // event.respondWith(
  //   fetch(event.request)
  //     .catch(function () {
  //       return caches.open(cacheName)
  //         .then(function (cache) {
  //           return cache.match(event.request)
  //         })
  //     })
  // );

  // Cache strategy: Stale While Revalidate
  event.respondWith(
    caches.open(cacheName)
      .then(function (cache) {
        return cache.match(event.request)
          .then(function (cachedResponse) {
            const fetchedResponse = fetch(event.request)
              .then(function (networkResponse) {
                cache.put(
                  event.request,
                  networkResponse.clone()
                );

                return networkResponse;
              })
              .catch(function () {
                return cache.match('/offline.html');
              });

            return cachedResponse || fetchedResponse;
          })
      })
  );

});