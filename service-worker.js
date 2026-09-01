const CACHE_NAME = 'resident-lovely-v6.3.1-cache';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/three.min.js',
  './src/main.js',
  './src/engine/audio.js',
  './src/engine/camera.js',
  './src/engine/input.js',
  './src/entities/player.js',
  './src/entities/grump.js',
  './src/entities/boss.js',
  './src/entities/companion.js',
  './src/weapons/arsenal.js',
  './src/world/scene.js',
  './src/world/rooms.js',
  './src/world/destructibles.js',
  './src/world/sectors.js',
  './src/world/backdrops.js',
  './src/world/atmosphere.js',
  './src/world/shaders/surface-shaders.js',
  './src/systems/inventory.js',
  './src/systems/quests.js',
  './src/systems/minimap.js',
  './src/systems/persistence.js',
  './src/systems/game_modes.js',
  './src/systems/endless_generator.js',
  './src/systems/ai_dialogue.js',
  './assets/resident-lovely-banner.svg',
  './assets/backdrops/backdrop_alchemy_dungeon.svg',
  './assets/backdrops/backdrop_ancient_ruins.svg',
  './assets/backdrops/backdrop_clock_tower_belfry.svg',
  './assets/backdrops/backdrop_clockwork_archives.svg',
  './assets/backdrops/backdrop_conservatory_annex.svg',
  './assets/backdrops/backdrop_crystal_grotto.svg',
  './assets/backdrops/backdrop_crystal_vault.svg',
  './assets/backdrops/backdrop_grand_terrace.svg',
  './assets/backdrops/backdrop_harbor_docks.svg',
  './assets/backdrops/backdrop_haunted_conservatory.svg',
  './assets/backdrops/backdrop_ice_chamber.svg',
  './assets/backdrops/backdrop_lighthouse_deck.svg',
  './assets/backdrops/backdrop_mirror_maze.svg',
  './assets/backdrops/backdrop_mirror_maze_gallery.svg',
  './assets/backdrops/backdrop_moonlit_meadow.svg',
  './assets/backdrops/backdrop_moonlit_rooftop.svg',
  './assets/backdrops/backdrop_music_parlor.svg',
  './assets/backdrops/backdrop_planetarium.svg',
  './assets/backdrops/backdrop_sacred_forest.svg',
  './assets/backdrops/backdrop_sacred_forest_trail.svg',
  './assets/backdrops/backdrop_secret_belfry.svg',
  './assets/backdrops/backdrop_sunken_grotto.svg',
  './assets/backdrops/backdrop_tea_salon.svg',
  './assets/backdrops/backdrop_underground_river_cavern.svg',
  './assets/backdrops/backdrop_village_district.svg',
  './assets/backdrops/backdrop_foyer.svg',
  './assets/backdrops/backdrop_library.svg',
  './assets/backdrops/backdrop_garden.svg',
  './assets/backdrops/backdrop_greenhouse.svg',
  './assets/backdrops/backdrop_dining.svg',
  './assets/backdrops/backdrop_gallery.svg',
  './assets/backdrops/backdrop_bakery.svg',
  './assets/backdrops/backdrop_observatory.svg',
  './assets/backdrops/backdrop_clocktower.svg',
  './assets/backdrops/backdrop_mastersuite.svg',
  './assets/backdrops/backdrop_ballroom.svg',
  './assets/backdrops/backdrop_cathedral.svg',
  './assets/backdrops/backdrop_lab.svg',
  './assets/backdrops/backdrop_crypt.svg'
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
      return cachedResp || fetch(event.request).catch((err) => {
        // Prevent JS modules from falling back to index.html (which causes opaque syntax errors)
        if (event.request.url.endsWith('.js')) {
          return new Response('console.error("SW: Failed to fetch module", "' + event.request.url + '");', {
            status: 404,
            headers: { 'Content-Type': 'application/javascript' }
          });
        }
        return caches.match('./index.html');
      });
    })
  );
});
