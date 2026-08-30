## 2026-08-28T02:22:56Z

You are the Final Integration & Sync Worker for Resident Lovely (v4.0.0).

Working Directory: /data/data/com.termux/files/home/projects/resident-lovely-game/.agents/teamwork_preview_worker_finalizer
Project Root: /data/data/com.termux/files/home/projects/resident-lovely-game
Webby Destination: /data/data/com.termux/files/home/projects/cryo-omega/webby/resident-lovely

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All integration must be genuine.

CRITICAL RULES:
- STRICT ZERO-EMOJI RULE across all code and comments (NEXUS PRIVÉ v6.0 rule).
- Native ECMAScript Modules (ESM) syntax throughout.

Tasks:
1. In `src/main.js`:
   - Import `createSectorBackdrop`, `BackdropManager` from `./world/backdrops.js`.
   - Import `surfaceShaderManager` from `./world/shaders/surface-shaders.js`.
   - Initialize backdrop quad mesh in scene: `const backdropManager = createSectorBackdrop(gameState.room); scene.add(backdropManager.getMesh());`.
   - In `changeRoom(newRoomId, spawnPoint)`:
     - Update `backdropManager.update(gameState.room, camera, 0)`.
     - Update `surfaceShaderManager.setActiveSectors(gameState.room, getAdjacentSectors(gameState.room))`.
   - In `animate(time)` loop:
     - Update `backdropManager.update(gameState.room, camera, delta)`.
     - Update `surfaceShaderManager.update(delta, gameState.room)`.
2. In `tests/test_e2e_shaders_fx.py`:
   - Ensure `get_all_workspace_files()` skips `.agents` directory along with `.git` and `__pycache__`.
   - Ensure all assertions in `tests/test_e2e_shaders_fx.py` reflect the v4.0.0 32-sector world graph and pass 100%.
3. In `index.html`:
   - Verify script tags and metadata reflect version v4.0.0 "Resident Lovely: Maximum Happiness (3D Graphics Upgrade & 32-Sector World Map Expansion)".
4. Sync all project files (excluding `.git`, `.agents`, `__pycache__`) from `/data/data/com.termux/files/home/projects/resident-lovely-game/` to `/data/data/com.termux/files/home/projects/cryo-omega/webby/resident-lovely/`.
5. Run:
   - `python3 -m unittest discover -s /data/data/com.termux/files/home/projects/resident-lovely-game/tests/`
   - Confirm total test count and that ALL tests pass (0 failures, 0 errors).
6. Write `handoff.md` and send message to parent when completed.
