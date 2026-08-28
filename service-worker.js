const CACHE_NAME = 'resident-lovely-v2.0-cache';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './src/main.js',
  './src/engine/audio.js',
  './src/engine/camera.js',
  './src/engine/input.js',
  './src/entities/player.js',
  './src/entities/grump.js',
  './src/entities/boss.js',
  './src/weapons/arsenal.js',
  './src/world/scene.js',
  './src/world/rooms.js',
  './src/world/destructibles.js',
  './src/systems/inventory.js',
  './src/systems/quests.js',
  './src/systems/minimap.js',
  './src/systems/persistence.js',
  './assets/resident-lovely-banner.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResp) => {
      return cachedResp || fetch(event.request).catch(() => caches.match('./index.html'));
    })
  );
});
