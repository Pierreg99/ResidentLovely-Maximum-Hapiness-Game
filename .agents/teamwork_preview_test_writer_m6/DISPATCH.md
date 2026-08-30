## 2026-08-28T02:16:21Z

You are the E2E Test Writer for Resident Lovely.

Working Directory: /data/data/com.termux/files/home/projects/resident-lovely-game/.agents/teamwork_preview_test_writer_m6
Project Root: /data/data/com.termux/files/home/projects/resident-lovely-game
Original Request: /data/data/com.termux/files/home/projects/resident-lovely-game/.agents/ORIGINAL_REQUEST.md
Reference Spec: /data/data/com.termux/files/home/projects/cryo-omega/docs/superpowers/specs/2026-08-28--resident-lovely-graphic-map-expansion.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All test implementations and verification must be genuine.

CRITICAL RULES:
- STRICT ZERO-EMOJI RULE across all test code, comments, output strings, and markdown (NEXUS PRIVÉ v6.0 rule).
- Native ECMAScript Modules (ESM) syntax awareness.
- File Write Ownership: tests/test_e2e_shaders_fx.py, TEST_READY.md, TEST_INFRA.md.

Tasks:
1. Fix the false positive in tests/test_e2e_shaders_fx.py line 184-189 (get_all_workspace_files) so it excludes .agents directory along with .git and __pycache__ when scanning project source files for emojis.
2. Update and expand tests/test_e2e_shaders_fx.py:
   - Update test_scenario_4_full_estate_18_sector_cycle to verify the full 32-sector cycle across S01-S32.
   - Add new E2E test cases covering:
     - R1: Sector Registry queries (getSector, getFloorSectors, getAdjacentSectors, 32 sectors).
     - R2: Backdrop Manager LRU cache (max 3 active textures), renderOrder -1, depthWrite false, parallax offset.
     - R3: 8 GLSL surface shaders, active + adjacent sector throttling flag, standard material fallback.
     - R4: Blueprint Map v2 SVG generation, 7 floor tabs, <= 180 SVG DOM node budget.
     - R5: Chamber geometry for S19-S32 (floor, 4 walls, ceiling, 2+ decorative props per chamber).
   - Ensure the total test count in tests/test_e2e_shaders_fx.py is at least 150+ tests across Tiers 1-4.
3. Run python3 tests/test_e2e_shaders_fx.py and python3 -m unittest discover -s tests -p "test_*.py" to ensure 100% of all tests pass with 0 failures and 0 errors.
4. Create/update TEST_READY.md and TEST_INFRA.md at project root with test runner commands and coverage summary.
5. Write handoff.md and send message to parent when completed.
