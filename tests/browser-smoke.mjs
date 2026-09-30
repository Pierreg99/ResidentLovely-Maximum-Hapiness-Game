import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';

const artifacts = 'test-artifacts';
await mkdir(artifacts, { recursive: true });
const port = process.env.TEST_PORT || '8091';
const baseURL = process.env.TEST_URL || `http://127.0.0.1:${port}`;
const server = process.env.TEST_URL ? null : spawn(process.execPath, ['scripts/serve.mjs'], { env: { ...process.env, PORT: port }, stdio: 'ignore' });
for (let i = 0; i < 50; i++) {
  try { if ((await fetch(baseURL)).ok) break; } catch (_) {}
  await new Promise(resolve => setTimeout(resolve, 100));
}
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  headless: true
});
const failures = [];
const filter = process.env.TEST_FILTER ? new RegExp(process.env.TEST_FILTER) : null;
async function check(name, fn) {
  if (filter && !filter.test(name)) { console.log(`SKIP ${name}`); return; }
  try { await fn(); console.log(`PASS ${name}`); } catch (error) { failures.push({ name, error }); console.error(`FAIL ${name}: ${error.message}`); }
}
async function start(context, name) {
  const page = await context.newPage();
  page.setDefaultTimeout(60000);
  page.errors = [];
  page.on('pageerror', error => page.errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') page.errors.push(message.text()); });
  await page.addInitScript(() => localStorage.setItem('resident-lovely-preferences-v8', JSON.stringify({ quality: 'low', reducedMotion: true })));
  await page.goto(baseURL);
  await page.locator('#btn-enter-chateau').waitFor({ state: 'visible' });
  await page.evaluate(async () => { window.testMain = await import('/src/main.js'); window.testPlayer = (await import('/src/entities/player.js')).player; });
  assert.equal(await page.locator('#btn-enter-chateau').isDisabled(), true);
  assert.equal(await page.locator('#hud').evaluate(el => el.inert), true);
  for (let i = 0; i < 15; i++) {
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => !!document.activeElement.closest('#loading-screen')), true);
  }
  const resting = await page.evaluate(() => window.testPlayer.position.toArray());
  await page.locator('#btn-enter-chateau').dispatchEvent('click');
  await page.keyboard.press('KeyW');
  assert.equal(await page.evaluate(() => window.testMain.gameState.started), false);
  assert.deepEqual(await page.evaluate(() => window.testPlayer.position.toArray()), resting);
  await page.locator('[data-start-quality="low"]').click();
  await page.waitForFunction(() => window.testMain.startupSettings.canPlay);
  assert.equal(await page.evaluate(() => window.testMain.gameState.started), false);
  assert.equal(await page.locator('[data-start-quality="low"]').getAttribute('aria-pressed'), 'true');
  await page.screenshot({ path: `${artifacts}/${name.replaceAll(' ', '-')}-startup.png`, fullPage: true });
  await page.locator('#btn-enter-chateau').click({ force: true });
  await page.evaluate(async () => { window.testMain = await import('/src/main.js'); window.testPlayer = (await import('/src/entities/player.js')).player; window.testInput = (await import('/src/engine/input.js')).input; window.testScene = await import('/src/world/scene.js'); });
  await page.waitForFunction(() => window.testMain.gameState.started);
  assert.equal(await page.locator('#hud').evaluate(el => el.inert), false);
  await page.evaluate(() => document.activeElement?.blur());
  console.log(`Started ${name}`); return page;
}
try {
  const desktop = await browser.newContext({ viewport: { width: 900, height: 600 } });
  const page = await start(desktop, 'desktop');
  await check('42 complete rooms, reachable routes, and instanced floors', async () => {
    const result = await page.evaluate(async () => {
      const { SECTOR_REGISTRY } = await import('/src/world/sectors.js');
      const { rooms } = await import('/src/world/rooms.js');
      const { findRoute } = await import('/src/systems/exploration.js');
      return { count: SECTOR_REGISTRY.length, complete: SECTOR_REGISTRY.every(s => rooms[s.slug].children.length > 0), reachable: SECTOR_REGISTRY.every(s => findRoute('S01', s.id).length), instanced: rooms.foyer.getObjectByName('chamber_floor').children.every(o => o.isInstancedMesh) };
    });
    assert.deepEqual(result, { count: 42, complete: true, reachable: true, instanced: true });
    assert.equal(await page.evaluate(() => window.testMain.visualUpgrade.assetCoverage.decoratedRooms), 42);
    assert.ok(await page.evaluate(() => window.testMain.visualUpgrade.assetCoverage.materialCount > 100));
  });
  await check('keyboard movement, sprint, dash, and pause isolation', async () => {
    const before = await page.evaluate(async () => (await import('/src/entities/player.js')).player.position.z);
    await page.keyboard.down('KeyW');
    await page.waitForFunction(z => Math.abs(window.testPlayer.position.z - z) > .2, before);
    await page.keyboard.down('Shift');
    await page.waitForFunction(() => window.testPlayer.stamina < 99);
    await page.keyboard.up('Shift'); await page.keyboard.up('KeyW');
    await page.keyboard.press('KeyC');
    assert.ok(await page.evaluate(async () => (await import('/src/entities/player.js')).player.stamina < 80));
    await page.keyboard.press('Escape');
    const paused = await page.evaluate(async () => { const { player } = await import('/src/entities/player.js'); return [player.position.x, player.position.z]; });
    await page.keyboard.down('KeyW'); await page.waitForTimeout(250); await page.keyboard.up('KeyW');
    assert.deepEqual(await page.evaluate(async () => { const { player } = await import('/src/entities/player.js'); return [player.position.x, player.position.z]; }), paused);
    await page.locator('[data-skin="jade"]').click({ force: true });
    assert.equal(await page.locator('[data-skin="jade"]').getAttribute('aria-pressed'), 'true');
    await page.locator('#btn-resume').click({ force: true }); await page.evaluate(() => document.activeElement?.blur());
  });
  await check('map route, S41 travel, floor bounds, and immediate visibility', async () => {
    await page.keyboard.press('KeyM');
    await page.locator('#map-destination').selectOption('S41');
    await page.locator('#btn-track-destination').click({ force: true });
    assert.equal(await page.evaluate(async () => (await import('/src/main.js')).explorationSystem.waypoint), 'S41');
    await page.locator('#btn-map-travel').click({ force: true });
    await page.waitForFunction(() => window.testMain.gameState.room === 'rainbow_sky_garden' && !window.testMain.gameState.transitioning);
    await page.waitForFunction(() => window.testMain.visualUpgrade.lastRoom === 'rainbow_sky_garden');
    const result = await page.evaluate(async () => {
      const { player } = await import('/src/entities/player.js'); const { rooms } = await import('/src/world/rooms.js');
      return { y: player.position.y, z: player.position.z, visible: rooms.rainbow_sky_garden.visible };
    });
    assert.equal(result.y, 0); assert.ok(result.z > 210 && result.z < 242, JSON.stringify(result)); assert.equal(result.visible, true);
    await page.evaluate(() => document.activeElement?.blur()); await page.keyboard.down('KeyW');
    await page.waitForFunction(() => window.testPlayer.position.z < 224.8);
    await page.keyboard.up('KeyW');
    assert.ok(await page.evaluate(async () => (await import('/src/entities/player.js')).player.position.z > 210));
    await page.screenshot({ path: `${artifacts}/desktop-garden.png` });
  });
  await check('crystal collection and replayable rally waves', async () => {
    await page.evaluate(async () => {
      const { explorationSystem } = await import('/src/main.js'); const { player } = await import('/src/entities/player.js');
      const { rooms } = await import('/src/world/rooms.js');
      const crystal = explorationSystem.crystals.find(c => c.sector === 'S41');
      player.position.copy(rooms.rainbow_sky_garden.position).add(crystal.group.position); player.position.y = 0; player.group.position.copy(player.position);
      explorationSystem.update(.016, 1);
    });
    assert.ok(await page.evaluate(async () => (await import('/src/main.js')).explorationSystem.collected.has('S41-0')));
    await page.evaluate(async () => {
      const { explorationSystem } = await import('/src/main.js'); const { player } = await import('/src/entities/player.js');
      const { rooms } = await import('/src/world/rooms.js'); explorationSystem.startRally();
      const pickups = [...explorationSystem.rally.pickups];
      for (const pickup of pickups) { player.position.copy(rooms.rainbow_sky_garden.position).add(pickup.position); player.position.y = 0; player.group.position.copy(player.position); explorationSystem.update(.016, 2); }
    });
    assert.equal(await page.evaluate(async () => (await import('/src/main.js')).explorationSystem.rally.wave), 2);
    await page.evaluate(async () => (await import('/src/main.js')).explorationSystem.stopRally());
    assert.ok(await page.evaluate(async () => (await import('/src/main.js')).explorationSystem.best > 0));
  });
  await check('centered and disconnected gamepad stops movement', async () => {
    await page.evaluate(() => { window.testPad = { axes: [.8, 0, 0, 0], buttons: Array.from({ length: 16 }, () => ({ pressed: false })) }; navigator.getGamepads = () => [window.testPad]; });
    await page.waitForFunction(() => window.testInput.moveX > .5);
    await page.evaluate(() => window.testPad.axes[0] = 0);
    await page.waitForFunction(() => window.testInput.moveX === 0);
    await page.evaluate(() => { window.testPad.axes[0] = .8; });
    await page.waitForFunction(() => window.testInput.moveX > .5);
    await page.evaluate(() => navigator.getGamepads = () => []);
    await page.waitForFunction(() => window.testInput.moveX === 0);
  });
  await check('high and ultra rendering produce valid WebGL frames', async () => {
    await page.locator('#btn-menu').click({ force: true });
    for (const mode of ['high', 'ultra']) {
      const frame = await page.evaluate(() => window.testScene.renderer.info.render.frame);
      await page.locator('#graphics-quality').selectOption(mode);
      await page.waitForFunction(frame => window.testScene.renderer.info.render.frame > frame + 3, frame);
      await page.waitForFunction(mode => window.testScene.graphicsQuality.shadowMapSize === (mode === 'ultra' ? 4096 : 2048), mode);
      const colors = await page.evaluate(() => {
        const { scene, renderer } = window.testScene;
        const visible = scene.children.map(child => [child, child.visible]);
        const material = new THREE.MeshBasicMaterial({ toneMapped: false, fog: false });
        material.color.setRGB(.214, .214, .214);
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, .1, 10);
        camera.position.z = 2;
        const read = () => {
          const size = renderer.getDrawingBufferSize(new THREE.Vector2());
          const pixel = new Uint8Array(4);
          renderer.getContext().readPixels(Math.floor(size.x / 2), Math.floor(size.y / 2), 1, 1, renderer.getContext().RGBA, renderer.getContext().UNSIGNED_BYTE, pixel);
          return [...pixel].slice(0, 3);
        };
        try {
          visible.forEach(([child]) => child.visible = false); scene.add(plane);
          renderer.setRenderTarget(null); renderer.render(scene, camera); const direct = read();
          window.testMain.visualUpgrade.render(camera); return { direct, composite: read() };
        } finally {
          scene.remove(plane); plane.geometry.dispose(); material.dispose();
          visible.forEach(([child, shown]) => child.visible = shown);
        }
      });
      assert.ok(colors.direct.every((value, index) => Math.abs(value - colors.composite[index]) <= 3), `Graphics mode changed the color encoding: ${JSON.stringify(colors)}`);
    }
    assert.ok(await page.evaluate(async () => { const { renderer } = await import('/src/world/scene.js'); return renderer.getContext().getError() === 0; }));
    await page.locator('#graphics-quality').selectOption('low'); await page.locator('#btn-resume').click({ force: true });
  });
  await check('progress and player location survive reload', async () => {
    await page.locator('#btn-menu').click({ force: true }); await page.locator('#btn-save-now').click({ force: true });
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('resident_lovely_save_v3')));
    await page.reload(); await page.locator('#btn-enter-chateau').waitFor({ state: 'visible' });
    assert.equal(await page.evaluate(async () => (await import('/src/main.js')).gameState.room), saved.room);
    assert.deepEqual(await page.evaluate(async () => { const { player } = await import('/src/entities/player.js'); return { x: player.position.x, y: player.position.y, z: player.position.z }; }), saved.position);
  });
  await check('offline service worker reloads the complete game', async () => {
    await page.evaluate(async () => { await navigator.serviceWorker.ready; });
    assert.ok(await page.evaluate(async () => {
      const cache = await caches.open('resident-lovely-v9-sweet-cache');
      return !!(await cache.match('./src/world/visual-upgrade.js')) && !!(await cache.match('./assets/icons/icon-512.png')) && !!(await cache.match('./src/systems/startup-settings.js')) && !!(await cache.match('./assets/art/sweet-chateau.png'));
    }));
    await desktop.setOffline(true); await page.reload();
    await page.locator('#btn-enter-chateau').waitFor({ state: 'visible' });
    assert.ok(await page.evaluate(() => typeof THREE.WebGLRenderer === 'function'));
    await desktop.setOffline(false);
  });
  assert.deepEqual(page.errors, []);
  await desktop.close();

  await check('older cached page shells upgrade to settings before initialization', async () => {
    const legacy = await browser.newContext({ viewport: { width: 900, height: 600 } });
    const oldPage = await legacy.newPage(); oldPage.setDefaultTimeout(60000);
    await oldPage.addInitScript(() => localStorage.setItem('resident-lovely-preferences-v8', JSON.stringify({ quality: 'low', reducedMotion: true })));
    await oldPage.route('**/*', async route => {
      const request = route.request();
      if (request.isNavigationRequest() && (!new URL(request.url()).searchParams.has('edition') || new URL(request.url()).searchParams.has('blocked-shell'))) {
        const response = await route.fetch();
        await route.fulfill({ response, body: (await response.text()).replace('id="startup-quality-status"', 'id="legacy-status"') });
      } else await route.continue();
    });
    try {
      await oldPage.goto(baseURL, { waitUntil: 'domcontentloaded' });
      await oldPage.waitForURL(url => url.searchParams.get('edition') === 'sweet-v9');
      await oldPage.locator('#startup-quality-status').waitFor();
      assert.equal(await oldPage.locator('#btn-enter-chateau').isDisabled(), true);
      assert.equal(await oldPage.evaluate(async () => (await import('/src/main.js')).gameState.started), false);
      await oldPage.goto(`${baseURL}/?edition=sweet-v9&blocked-shell=1`, { waitUntil: 'commit' });
      await oldPage.locator('#btn-enter-chateau').filter({ hasText: 'UPDATE & RETRY' }).waitFor();
      assert.match(await oldPage.locator('#loading-status-text').textContent(), /Connect online/);
      assert.equal(await oldPage.evaluate(async () => (await import('/src/world/rooms.js')).rooms.foyer.children.length), 0);
    } finally { await legacy.close(); }
  });

  const android = await browser.newContext({ viewport: { width: 393, height: 851 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/131.0.0.0 Mobile Safari/537.36' });
  const mobile = await start(android, 'Android portrait');
  await check('Android touch joystick, release, and dash', async () => {
    const zone = await mobile.locator('#joystick-zone').boundingBox();
    const session = await mobile.context().newCDPSession(mobile);
    const x = zone.x + 60, y = zone.y + 75;
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id: 1 }] });
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + 35, y: y - 20, id: 1 }] });
    assert.ok(await mobile.evaluate(async () => (await import('/src/engine/input.js')).input.moveX > .2));
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    assert.equal(await mobile.evaluate(async () => (await import('/src/engine/input.js')).input.moveX), 0);
    await mobile.locator('#btn-dash').tap();
    assert.ok(await mobile.evaluate(async () => (await import('/src/entities/player.js')).player.stamina < 80));
    await mobile.screenshot({ path: `${artifacts}/android-portrait.png` });
  });
  await check('Android landscape controls and settings stay inside viewport', async () => {
    await mobile.setViewportSize({ width: 851, height: 393 });
    for (const id of ['btn-menu', 'btn-dash', 'btn-sprint', 'btn-fire', 'joystick-zone']) {
      const box = await mobile.locator('#' + id).boundingBox();
      assert.ok(box && box.x >= 0 && box.y >= 0 && box.x + box.width <= 852 && box.y + box.height <= 394, `${id} is outside viewport: ${JSON.stringify(box)}`);
    }
    await mobile.locator('#btn-menu').tap();
    assert.equal(await mobile.locator('#pause-modal').evaluate(el => getComputedStyle(el).display), 'flex');
    await mobile.screenshot({ path: `${artifacts}/android-landscape-menu.png` });
  });
  await check('Android landscape startup scrolls and waits for graphics then Play', async () => {
    await mobile.reload();
    await mobile.evaluate(async () => { window.testMain = await import('/src/main.js'); });
    assert.equal(await mobile.locator('#btn-enter-chateau').isDisabled(), true);
    const session = await mobile.context().newCDPSession(mobile);
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 720, y: 340, id: 1 }] });
    for (let y = 320; y >= 100; y -= 20) {
      await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 720, y, id: 1 }] });
      await mobile.waitForTimeout(20);
    }
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await mobile.waitForFunction(() => document.getElementById('loading-screen').scrollTop > 10);
    assert.equal(await mobile.evaluate(() => window.testMain.gameState.started), false);
    await mobile.locator('[data-start-quality="low"]').tap();
    await mobile.waitForFunction(() => window.testMain.startupSettings.canPlay);
    assert.equal(await mobile.evaluate(() => window.testMain.gameState.started), false);
    await mobile.locator('#btn-enter-chateau').tap();
    assert.equal(await mobile.evaluate(() => window.testMain.gameState.started), true);
  });
  assert.deepEqual(mobile.errors, []);
  await android.close();
} finally { await browser.close(); server?.kill(); }
if (failures.length) { console.error(`${failures.length} browser checks failed`); process.exitCode = 1; }
else console.log('All browser checks passed.');
