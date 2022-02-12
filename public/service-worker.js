const APP_PREFIX = 'BudgetTracker-';     
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION
const FILES_TO_CACHE = [
    "/",
  "/index.html",
  "/manifest.json",
  "/css/styles.css",
  "/js/index.js",
  "/icons/icon-72x72.png",
  "/icons/icon-96x96.png",
  "/icons/icon-128x128.png",
  "/icons/icon-144x144.png",
  "/icons/icon-152x152.png",
  "/icons/icon-192x192.png",
  "/icons/icon-384x384.png",
  "/icons/icon-512x512.png",
];

// Respond with cached resources
self.addEventListener('fetch', function (evt) {
  console.log('fetch request : ' + evt.request.url)
  evt.respondWith(
    caches
    .open(DATA_CACHE_NAME)
    .then(cache => {
      return fetch(evt.request)
        .then(response => {
          // If the response was good, clone it and store it in the cache.
          if (response.status === 200) {
            cache.put(evt.request.url, response.clone());
          }

          return response;
        })
        .catch(err => {
          // Network request failed, try to get it from the cache.
          return cache.match(evt.request);
        });
    })
    .catch(err => console.log(err))
  );

  return;
})

// Cache resources
// install service worker 
self.addEventListener('install', function (e) {
  // ensures that the service worker doesnt move on from installin g phase until it s 
  // ..executed all of its code 
  e.waitUntil(
    // find specific cache by name, then add every file in the files to cache array to cache
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('installing cache : ' + CACHE_NAME)
      return cache.addAll(FILES_TO_CACHE)
    })
  )
})

// Delete outdated caches
self.addEventListener('activate', function (e) {
  e.waitUntil(
    // .keys returns an array of all cache names to Keylist
    caches.keys().then(function (keyList) {
      // `keyList` contains all cache names under your username.github.io
      // filter out ones that has this app prefix to create keeplist
      let cacheKeeplist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      })
      // add current cache name to keeplist
      cacheKeeplist.push(CACHE_NAME);

      return Promise.all(keyList.map(function (key, i) {
        if (cacheKeeplist.indexOf(key) === -1) {
          console.log('deleting cache : ' + keyList[i] );
          return caches.delete(keyList[i]);
        }
      }));
    })
  );
});