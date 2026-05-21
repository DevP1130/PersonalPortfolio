const CACHE_NAME = 'dev-patel-portfolio-v5';

const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/css/styles.css?v=5',
    '/js/main.js',
    '/assets/favicon.svg',
    '/assets/Dev_Resume.pdf',
    '/assets/OpenWide.jpg.webp',
    '/assets/ArenaVision.png',
    '/assets/GTWebDev.png.jpeg'
];

// Install: cache all core assets
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Activate: remove old caches
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(
                keys
                    .filter(function(key) { return key !== CACHE_NAME; })
                    .map(function(key) { return caches.delete(key); })
            );
        })
    );
    self.clients.claim();
});

// Fetch: cache-first for local assets, network-first for external
self.addEventListener('fetch', function(event) {
    // Skip non-GET and chrome-extension requests
    if (event.request.method !== 'GET') return;
    if (event.request.url.startsWith('chrome-extension')) return;

    const isExternal = !event.request.url.startsWith(self.location.origin);

    if (isExternal) {
        // Network-first for external resources (fonts, APIs)
        event.respondWith(
            fetch(event.request)
                .then(function(response) {
                    if (response && response.status === 200) {
                        var clone = response.clone();
                        caches.open(CACHE_NAME).then(function(cache) {
                            cache.put(event.request, clone);
                        });
                    }
                    return response;
                })
                .catch(function() {
                    return caches.match(event.request);
                })
        );
    } else {
        // Cache-first for local assets
        event.respondWith(
            caches.match(event.request).then(function(cached) {
                if (cached) return cached;

                return fetch(event.request).then(function(response) {
                    if (response && response.status === 200) {
                        var clone = response.clone();
                        caches.open(CACHE_NAME).then(function(cache) {
                            cache.put(event.request, clone);
                        });
                    }
                    return response;
                });
            })
        );
    }
});
