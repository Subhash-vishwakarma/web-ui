importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

// Note: Ignore the error that Glitch raises about workbox being undefined.
workbox.setConfig({
  debug: true,
});

workbox.precaching.precacheAndRoute([
  "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.34/browser.min.js",
  "https://unpkg.com/react@16/umd/react.development.js",
  "https://unpkg.com/react-dom@16/umd/react-dom.development.js",
  "https://unpkg.com/react-router-dom@5.0.0/umd/react-router-dom.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/uuid/8.3.2/uuid.min.js"
]);

// Demonstrates using default cache

workbox.routing.registerRoute(
  ({url}) => url.pathname.startsWith('https://ec-portal-1x.run.aws-usw02-dev.ice.predix.io/v1.2beta/assets/static/images/'),
  new workbox.strategies.NetworkFirst({
    networkTimeoutSeconds: 3,
    cacheName: 'stories',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 minutes
      }),
    ],
  })
);


workbox.routing.registerRoute(
  ({url}) => url.origin === 'https://ec-portal-1x.run.aws-usw02-dev.ice.predix.io/v1.2beta/assets/static/images/',
  new workbox.strategies.CacheFirst({
    cacheName: 'images',
    plugins: [
     new  workbox.expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 60 * 60,
      })
    ],
  })
);

// Demonstrates a custom cache name for a route.
workbox.routing.registerRoute(
    new RegExp('.*\\.(?:png|jpg|jpeg|svg|gif)'),
    new workbox.strategies.CacheFirst({
      cacheName: 'image-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 3,
        }),
      ],
    }),
);


/*const filesToCache = [
 'index.html',
  'App.js',
  'xcalrWebUI.js',
  './Dashboard/Dashboard.js ',
  './FloaterHelp/FloaterHelp.js',
  'static/images/info.svg'
];

const staticCacheName = 'pages-cache-v1';

self.addEventListener('install', event => {
  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches.open(staticCacheName)
    .then(cache => {
      return cache.addAll(filesToCache);
    })
  );
}); */

 /*const cacheName = "v1";

 const cacheAssets =[
  'index.html',
  'App.js',
  'xcalrWebUI.js',
  './Dashboard/Dashboard.js ',
  './FloaterHelp/FloaterHelp.js',
  'static/images/info.svg'
] 

//service worker install
self.addEventListener("install", (e) => {
  console.log("service Worker: Installed");
   e.waitUntil(
    caches
    .open(cacheName)
    .then(cache=>
    {  console.log('Service Worker: caching files');
      cache.addAll(cacheAssets)})
      .then(()=>self.skipWaiting())
  ) 
});

//service worker activated
self.addEventListener("activate", (e) => {
  console.log("service Worker: Activated");
    e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            console.log("service Worker: Clearing Old Cache");
            return caches.delete(cache);
          }
        })
      );
    })
  );  
});

//Call fetch event
self.addEventListener("fetch", (e) => {
  console.log("Service Worker : fetching");
   e.respondWith(
    fetch(e.request)
      .then((res) => {
        //make copy/clone of response
        const resClone = res.clone();
        caches.open(cacheName).then((cache) => {
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch((err) => caches.match(e.request).then((res) => res))
  ); 
 
/*  if (event.request.destination === 'image') {
    event.respondWith(fetch(e.request)
      .then((res) => {
        //make copy/clone of response
        const resClone = res.clone();
        caches.open(cacheName).then((cache) => {
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch((err) => caches.match(e.request).then((res) => res)));
  }
 
    e.respondWith(
    fetch(e.request)
    .catch(() => caches.match(e.request))
  ) 
  
  
}); */
