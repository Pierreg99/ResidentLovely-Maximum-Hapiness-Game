const CACHE_NAME = 'resident-lovely-v7.1.0-cache';
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
];

function stripUrl(url) {
  return String(url || '').split('?')[0].split('#')[0];
}

function isScriptRequest(request, url) {
  return url.endsWith('.js') || request.destination === 'script' || request.destination === 'worker';
}

function isStyleRequest(request, url) {
  return url.endsWith('.css') || request.destination === 'style';
}

function isHtmlResponse(response) {
  if (!response) return false;
  const ct = (response.headers && response.headers.get('content-type')) || '';
  if (ct.includes('text/html') || ct.includes('application/xhtml')) return true;
  return false;
}

function scriptErrorResponse(url) {
  return new Response(
    'console.error("SW: Failed to fetch module", ' + JSON.stringify(url) + ');',
    { status: 404, headers: { 'Content-Type': 'application/javascript; charset=utf-8' } }
  );
}

function styleErrorResponse() {
  return new Response('/* SW: CSS fetch failed */', {
    status: 404,
    headers: { 'Content-Type': 'text/css; charset=utf-8' }
  });
}

async function cachePutSafe(cache, request, response) {
  if (!response || !response.ok) return;
  if (isHtmlResponse(response) && !stripUrl(request.url).endsWith('.html') && stripUrl(request.url).slice(-1) !== '/') {
    return;
  }
  try {
    await cache.put(request, response.clone());
  } catch (_) {
    // Ignore QuotaExceeded / opaque failures on mobile.
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const asset of ASSETS_TO_CACHE) {
        try {
          await cache.add(asset);
        } catch (_) {
          // Skip missing assets so install still completes.
        }
      }
      return self.skipWaiting();
    })
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
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = stripUrl(request.url);
  const scriptReq = isScriptRequest(request, url);
  const styleReq = isStyleRequest(request, url);

  // Network-first for JS/CSS: never serve HTML disguised as modules/styles.
  if (scriptReq || styleReq) {
    event.respondWith((async () => {
      try {
        const networkResp = await fetch(request);
        if (networkResp && networkResp.ok && !isHtmlResponse(networkResp)) {
          const cache = await caches.open(CACHE_NAME);
          await cachePutSafe(cache, request, networkResp);
          return networkResp.clone();
        }
        if (networkResp && isHtmlResponse(networkResp)) {
          return scriptReq ? scriptErrorResponse(request.url) : styleErrorResponse();
        }
      } catch (_) {
        // Fall through to cache.
      }

      const cached = await caches.match(request);
      if (cached && !isHtmlResponse(cached)) {
        return cached;
      }

      return scriptReq ? scriptErrorResponse(request.url) : styleErrorResponse();
    })());
    return;
  }

  // Cache-first for HTML, images, SVG, and other static assets.
  event.respondWith(
    caches.match(request).then((cachedResp) => {
      if (cachedResp) return cachedResp;
      return fetch(request).then(async (networkResp) => {
        if (networkResp && networkResp.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cachePutSafe(cache, request, networkResp);
        }
        return networkResp;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
