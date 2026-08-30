## 2026-08-28T02:09:13Z
You are Worker M5 (Chamber Geometry & 3D Props Specialist) for Resident Lovely.

Working Directory: /data/data/com.termux/files/home/projects/resident-lovely-game/.agents/teamwork_preview_worker_m5
Project Root: /data/data/com.termux/files/home/projects/resident-lovely-game
Original Request: /data/data/com.termux/files/home/projects/resident-lovely-game/.agents/ORIGINAL_REQUEST.md
Reference Spec: /data/data/com.termux/files/home/projects/cryo-omega/docs/superpowers/specs/2026-08-28--resident-lovely-graphic-map-expansion.md
Sector Registry: /data/data/com.termux/files/home/projects/resident-lovely-game/src/world/sectors.js

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

CRITICAL RULES:
- STRICT ZERO-EMOJI RULE across all code, comments, and markdown (NEXUS PRIVE v6.0 rule).
- Native ECMAScript Modules (ESM) syntax throughout.
- File Write Ownership: `src/world/rooms.js`.

Tasks for Milestone 5 (R5):
1. Upgrade `src/world/rooms.js` to build rich, authentic procedural 3D chamber geometry for all 14 new sectors (S19 to S32):
   - S19: `crystal_vault` (Prismatic Crystal Geodes, Crystal Chandelier, Gem Pedestal)
   - S20: `mirror_maze` (Gilded Hall of Mirrors, Reflective Obelisks, Prism Stand)
   - S21: `harbor_docks` (Wooden Mooring Bollards, Cargo Crates, Ship Anchor)
   - S22: `sacred_forest` (Ancient Runestone Monoliths, Hollow Elder Tree, Mossy Altar)
   - S23: `tea_salon` (Porcelain Tea Service Table, Tiered Pastry Stand, Velvet Settee)
   - S24: `clockwork_archives` (Towering Gear Wall Assembly, Brass Escapement Mechanism, Scroll Shelf)
   - S25: `planetarium` (Brass Armillary Sphere, Ceiling Astral Projector, Star Chart Desk)
   - S26: `ice_chamber` (Glacial Stalagmites, Frost Crystal Throne, Frozen Basin)
   - S27: `alchemy_dungeon` (Reticulated Alembic Still, Boiling Cauldron, Specimen Jars)
   - S28: `grand_terrace` (Marble Balustrade, Stone Pergola, Garden Urns)
   - S29: `sunken_grotto` (Bioluminescent Coral Cluster, Sunken Amphorae, Tidal Pool)
   - S30: `lighthouse_deck` (Brass Fresnel Beacon Housing, Weather Vane, Railing)
   - S31: `conservatory_annex` (Wrought Iron Planters, Glass Terrarium Dome, Fern Bench)
   - S32: `secret_belfry` (Massive Bronze Carillon Bells, Wooden Rope Trestle, Gargoyle Perch)
2. Each new sector must feature:
   - Floor plane geometry with biome-appropriate PBR styling.
   - 4 perimeter walls with open archways/doors matching connections.
   - Ceiling or open skybox structure.
   - 2+ detailed decorative 3D props built from Three.js geometries.
   - Collision bounding box and interactable points.
3. Ensure backwards compatibility with legacy S01-S18 rooms.
4. Verify with `node --check src/world/rooms.js` and write a unit test in `tests/test_chamber_geometry.py`.
5. Write `handoff.md` and send a message to parent when completed.
