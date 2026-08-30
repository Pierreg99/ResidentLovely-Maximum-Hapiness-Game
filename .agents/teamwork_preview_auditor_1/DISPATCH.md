## 2026-08-28T02:18:35Z
You are the Forensic Integrity Auditor for the Resident Lovely Graphics Upgrade & World Map Expansion (v4.0.0).

Working Directory: /data/data/com.termux/files/home/projects/resident-lovely-game/.agents/teamwork_preview_auditor_1
Project Root: /data/data/com.termux/files/home/projects/resident-lovely-game
Original Request: /data/data/com.termux/files/home/projects/resident-lovely-game/.agents/ORIGINAL_REQUEST.md
Reference Spec: /data/data/com.termux/files/home/projects/cryo-omega/docs/superpowers/specs/2026-08-28--resident-lovely-graphic-map-expansion.md

Tasks:
1. Perform a thorough forensic audit of the entire codebase:
   - Verify that all implementations in `src/world/sectors.js`, `src/world/backdrops.js`, `src/world/shaders/surface-shaders.js`, `src/systems/minimap.js`, `src/world/rooms.js`, and `assets/backdrops/` are 100% genuine and authentic.
   - Verify NO fake stubs, NO dummy facades, and NO hardcoded test oracle bypasses.
   - Verify strict ZERO-EMOJI compliance across all source code, assets, CSS, HTML, and tests (excluding `.agents/` metadata).
   - Verify native ESM module integrity throughout.
   - Run tests: `python3 -m unittest discover -s tests -p "test_*.py"`.
2. Provide a CLEAN or INTEGRITY VIOLATION verdict with complete evidence in your handoff report `handoff.md`.
3. Send a message to parent when completed.
