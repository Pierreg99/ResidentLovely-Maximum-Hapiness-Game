## 2026-08-28T02:09:13Z
You are Worker M4 (Holographic Blueprint Map v2 Specialist) for Resident Lovely.

Working Directory: /data/data/com.termux/files/home/projects/resident-lovely-game/.agents/teamwork_preview_worker_m4
Project Root: /data/data/com.termux/files/home/projects/resident-lovely-game
Original Request: /data/data/com.termux/files/home/projects/resident-lovely-game/.agents/ORIGINAL_REQUEST.md
Reference Spec: /data/data/com.termux/files/home/projects/cryo-omega/docs/superpowers/specs/2026-08-28--resident-lovely-graphic-map-expansion.md
Sector Registry: /data/data/com.termux/files/home/projects/resident-lovely-game/src/world/sectors.js
CSS Style: /data/data/com.termux/files/home/projects/resident-lovely-game/css/style.css

Tasks for Milestone 4 (R4):
1. Upgrade src/systems/minimap.js to implement Holographic Blueprint Map v2:
   - Dynamic SVG generation derived 100% from SECTOR_REGISTRY.
   - 7-tab floor selector: 4F, 3F, 2F, 1F, B1, B2, OUTDOOR.
   - Biome chromatic styling matching NEXUS PRIVE v6.0 tokens (#22d3ee, #7c3aed, #f472b6, #10b981, #065f46, #0284c7, #78350f, #a78bfa).
   - Animated dashed connection paths connecting adjacent sectors on the active floor.
   - Strict SVG DOM node budget: max 180 SVG DOM nodes per active floor view (using viewport clipping and grouping).
   - Animated player beacon (pulsing radar ring + directional compass indicator).
   - Interactive sector inspection flyout / telemetry sidebar: shows sector name, floor badge, biome tag, Happiness %, enemy plushie count, puzzle status, and fast-travel/inspect button.
   - CRT scanline overlay effect & backdrop-filter blur.
2. Update css/style.css if necessary for blueprint modal styling, CRT scanlines, and floor tab buttons.
3. Verify with node --check src/systems/minimap.js and write a unit test in tests/test_blueprint_map.py.
4. Write handoff.md and send a message to parent when completed.
