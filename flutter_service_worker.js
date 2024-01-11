'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "bde6894d877079fe13c22225c5d6d934",
"assets/AssetManifest.bin.json": "fe53e019a509275db569c91581ffc5af",
"assets/AssetManifest.json": "cf4599b5adedcd6a8fb34141565bfd55",
"assets/assets/banner.png": "e8e2c4fc7532e5418f0e322cead047f9",
"assets/assets/brown_wooden_door.png": "2416a2be03144c9691affed8c5b85a36",
"assets/assets/brown_wooden_door2.png": "d2cdca3945433e6dc96e098f7b01d350",
"assets/assets/brown_wooden_door3.png": "28e37b951ecd3a14afff1c8cf55d27f2",
"assets/assets/like.png": "99a3d4be3c2a3b2489a27d1b07e146d6",
"assets/assets/logo.png": "608b8c4c942fac73554aaa7cdefbc62c",
"assets/assets/peyk.png": "9ae14a92c7d1a9ab968bb5eb0f5f9665",
"assets/assets/price.png": "e5ffbabf284f2738b1b1069f995f575e",
"assets/assets/store.png": "b2f4b7162ba7f81738a0a542cab06b7c",
"assets/FontManifest.json": "805503b086d18c3e16d3727680033553",
"assets/fonts/AnjomanMax-Black.ttf": "348bb5f3dcb5a957b79ab21c33c68664",
"assets/fonts/AnjomanMax-Bold.ttf": "baefb55767b586bb68a745fac4723bbe",
"assets/fonts/AnjomanMax-Light.ttf": "79d5e421358ceb5b43a1fb2f553a7da7",
"assets/fonts/AnjomanMax-Medium.ttf": "4b202c5896d5433819d1a4007fee11e0",
"assets/fonts/AnjomanMax-Regular.ttf": "7cf70a51116a8638e74388b73939f4c0",
"assets/fonts/AnjomanMax-SemiBold.ttf": "cadc455915559d4911d8ae795a831cf6",
"assets/fonts/MaterialIcons-Regular.otf": "c835cb667a89abe5725578dc43223ffa",
"assets/fonts/MaterialIcons-Regular.ttf": "4e85bc9ebe07e0340c9c4fc2f6c38908",
"assets/NOTICES": "1392aed28bd2b72104a5a345de55c4ed",
"assets/shaders/ink_sparkle.frag": "4096b5150bac93c41cbc9b45276bd90f",
"assets/web/assets/fonts/AnjomanMax-Black.ttf": "348bb5f3dcb5a957b79ab21c33c68664",
"assets/web/assets/fonts/AnjomanMax-Bold.ttf": "baefb55767b586bb68a745fac4723bbe",
"assets/web/assets/fonts/AnjomanMax-Light.ttf": "79d5e421358ceb5b43a1fb2f553a7da7",
"assets/web/assets/fonts/AnjomanMax-Medium.ttf": "4b202c5896d5433819d1a4007fee11e0",
"assets/web/assets/fonts/AnjomanMax-Regular.ttf": "7cf70a51116a8638e74388b73939f4c0",
"assets/web/assets/fonts/AnjomanMax-SemiBold.ttf": "cadc455915559d4911d8ae795a831cf6",
"canvaskit/canvaskit.js": "eb8797020acdbdf96a12fb0405582c1b",
"canvaskit/canvaskit.wasm": "73584c1a3367e3eaf757647a8f5c5989",
"canvaskit/chromium/canvaskit.js": "0ae8bbcc58155679458a0f7a00f66873",
"canvaskit/chromium/canvaskit.wasm": "143af6ff368f9cd21c863bfa4274c406",
"canvaskit/skwasm.js": "87063acf45c5e1ab9565dcf06b0c18b8",
"canvaskit/skwasm.wasm": "2fc47c0a0c3c7af8542b601634fe9674",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03",
"favicon.png": "bbe46bdef9b70fec9cdb2b224a5c068d",
"flutter.js": "59a12ab9d00ae8f8096fffc417b6e84f",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "3722b29ff71ae6c6be1dd067a605d553",
"/": "3722b29ff71ae6c6be1dd067a605d553",
"main-icon.png": "f91ee3fd55f74e01bb10c8cd4c1ef70d",
"main.dart.js": "efb6a3bf141f0354e5a0f5caa6ca09ca",
"manifest.json": "0484d3b655d3da286d3c8576d0b37111",
"version.json": "037d91f3f4a75ab1cc60f3f16b5fe73c"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
