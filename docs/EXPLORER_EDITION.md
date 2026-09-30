# Explorer Edition · v8.0.0

Resident Lovely runs as a browser game and installable progressive web app on Windows, Linux, and Android. The root `index.html` and `src/` remain the playable entry. No build or external asset service is required.

## Play and install

- **Windows and Linux:** open the hosted game in a current Chrome, Chromium, Edge, or Firefox browser with WebGL enabled. Chrome and Edge support installing it from the browser's app menu or the in-game Install button when available.
- **Android:** open it in Chrome. Use the left joystick to move, drag the right pad to look, and use the action buttons. Hold Sprint to run or tap Dash for a burst. Portrait and landscape are supported. Chrome's menu → Add to Home screen → Install creates the app.
- Load the game once online and let installation finish before playing offline. Saves and preferences are stored on that device in that browser.

For local play with Node.js 20 or newer:

```sh
npm run dev
```

Open `http://localhost:8080`. Alternatively, use `python3 -m http.server 8080` from the repository root. PWA installation and offline storage need HTTPS or localhost; a plain HTTP LAN address can play but is not an installable secure origin.

## What's new

**Visuals:** image-based PBR reflections, marble relief, architectural panel textures, woven costume and plush surfaces, character contact shadows, a simpler outdoor sky, ambient day-cycle lighting, and a real three-pass bloom compositor for High and Ultra. Floors use two instanced draw calls instead of one per tile. Whole rooms on other floors are hidden, nearby lights are capped, and the shadow camera follows the current destination.

**Quality:** Menu offers Automatic, Battery saver, Balanced, High, and Ultra. High uses 2048-pixel shadows and bloom; Ultra uses 4096-pixel shadows and a higher rendering resolution. Automatic reduces resolution under sustained slow frames and raises it again when there is room. Battery saver keeps effects and resolution capped. Choose the level that suits the device; there is no fixed frame-rate guarantee.

**World:** all 42 destinations can be explored through named travel gates and the blueprint. Rainbow Sky Garden adds a rainbow sculpture, sakura grove, and benches. Aurora Bay adds a lighthouse, mint grove, and animated aurora. Destination selection, route tracking, and cross-floor gate instructions make the estate easier to navigate. Every room has three persistent joy crystals. Discovering a room earns 100 points; each crystal earns 25 points and restores five vitality.

**Characters and icons:** Agent Joy has Starlight, Sakura, and Jade styles with matching portraits. Plush characters have fabric detail and companions retain species cues. Menus share a line-icon system, and the app has proper 192- and 512-pixel install icons and a vector favicon.

**Joy Rally:** collect five blue stars before the countdown expires. Stars add time, quick pickups build a multiplier up to 4x, and completing a wave creates a different trail with a shorter time limit. The menu can finish a rally early. Your best score is saved. Changing rooms starts a fresh trail in that room without resetting the countdown. The rally pauses while menus are open or the game loses focus.

**Controls:** WASD/arrows move; mouse drag looks; right-click aims; Space blasts; E interacts or travels through a nearby gate; Shift sprints; C dashes; M opens the map; I opens inventory; Escape closes an overlay or pauses. Controller sticks move/look, A interacts, B dashes, RT fires, L3 sprints, View opens the map, and Menu pauses. Controller motion resets when sticks center or disconnect. Touch buttons support held fire and sprint, with large targets and safe-area spacing.

Room transitions now update both the character's movement position and its visible mesh. Movement uses each destination's dimensions, and saved room positions restore correctly. The camera settles immediately after travel, and the game waits for the player to start before simulation begins.

## Validation

```sh
python3 -m unittest discover -s tests -p 'test_*.py'
python3 check_imports.py
npm ci
npx playwright install chromium
npm run test:browser
```

For an existing Chromium installation, set `CHROMIUM_PATH` to its executable when running the browser suite. The suite checks a real WebGL scene, all destinations and routes, movement/sprint/dash, pause, room travel and bounds, crystal collection, rally wave progression, controller reset, graphics presets, saved locations, offline reload, and Android portrait/landscape controls. Screenshots go into the ignored `test-artifacts/` directory.

Browser tests use headless Chromium and Android touch/viewport emulation. Physical Android devices and Windows-specific browsers still need device testing; graphics performance depends on the GPU.
