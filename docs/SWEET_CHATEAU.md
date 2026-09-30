# Sweet Château · v9.0.0

A coordinated sweet kawaii art update for the playable root game on Windows, Linux, and Android.

## Before playing

The game opens with its settings screen. Select **Automatic**, **Gentle**, **Balanced**, **Beautiful**, or **Dreamy Ultra**, choose Starlight/Sakura/Jade, and adjust sound or reduced motion. Then press **Play**. Selecting graphics never starts gameplay. A separate graphics choice is required on each launch, including offline launches; character and comfort preferences are remembered. Settings remain available in Menu during play.

Gentle favors battery life. Beautiful enables bloom and 2048-pixel shadows; Dreamy Ultra uses 4096-pixel shadows and higher resolution. Automatic adapts resolution to the device. The settings screen scrolls on short screens and supports keyboard and touch input. Keyboard focus stays inside it, and hidden game controls become available only after Play.

## Art update

- Original generated heroine/château key art for the opening screen and a six-scene environment atlas for biome previews in every destination.
- The playable heroine has a layered dress with scalloped lace, puff sleeves, pearl accents, smooth swept hair, curved twin tails, satin bows, and a small smile. Three pastel palettes coordinate with the menu portraits.
- Shared material treatment across the complete estate, props, weapons, and bosses: softer color, corrected linear color values and consistent High/Ultra output encoding, floral damask walls, fine wood grain, restrained metal reflections, woven textiles, and porcelain details.
- Plush materials for grumps and newly recruited companions; flowers in porcelain vases in all 42 destinations use shared instanced geometry.
- A complete coordinated inventory icon set, new app/installation and action/weapon icons, and rose/lavender menu styling.

The illustrations are key art and biome mood previews. The interactive world uses optimized real-time 3D geometry and materials so it remains playable across desktop and mobile hardware.

## Run and install

Run `npm run dev` with Node.js 20+ and open `http://localhost:8080`. For installed/offline play, open the HTTPS game in Chrome or Edge and use Install; on Android use Chrome's Add to Home screen / Install option. Load once online to cache game assets.

## Validation

Run `python3 -m unittest discover -s tests -p 'test_*.py'`, `python3 check_imports.py`, and `npm run test:browser` after installing Playwright Chromium. `CHROMIUM_PATH` may point to a system Chromium.

The browser suite checks the graphics-before-Play gate on desktop and Android, blocked input before Play, character/material coverage, gameplay, map routes, rally scoring, quality changes, saved locations, offline loading, touch movement, and landscape startup scrolling. Android checks use Chromium emulation; physical device performance varies.
