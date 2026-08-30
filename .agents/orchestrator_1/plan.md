# Orchestration Plan — Subterranean B2 Puzzles

## 1. Survey Phase (Phase 0)
- Dispatch 3 Explorers / Spec Miners:
  - `explorer_1`: Mine reference spec `/data/data/com.termux/files/home/projects/cryo-omega/docs/superpowers/specs/2026-08-28--resident-lovely-subterranean-b2-puzzles.md` and list all detailed requirements, math/angles, item IDs, state keys, and audio frequencies.
  - `explorer_2`: Map existing codebase layout, `src/world/rooms.js`, `src/main.js`, `src/world/scene.js`, `src/engine/audio.js`, `src/world/shaders/surface-shaders.js`, and existing puzzle/interaction conventions.
  - `explorer_3`: Audit existing test suite in `tests/`, test execution commands (node test runner / vitest / playwright etc.), and verify how interactions/gamestate are tested.

## 2. Decomposition & Master Project Architecture (Phase 1)
- Synthesize findings into `PROJECT.md` with:
  - Architecture & Code Layout
  - Feature Inventory (every requirement mapped)
  - Milestones (M1: Audio & Shaders, M2: Subterranean River Raft S30, M3: Crystal Prism Laser Alignment Puzzle S31, M4: Ancient Rune Door & Pedestals S32, M5: E2E Integration & Verification)
  - Interface Contracts
- Initialize `TEST_INFRA.md` for the parallel E2E test track.

## 3. Dual-Track Execution (Phase 2)
- **Track A (Implementation)**:
  - Milestone by milestone loop: Explorer -> Worker -> Reviewers (2) -> Challengers (2) -> Forensic Auditor -> Gate Check.
  - Strictly enforce Zero-Emoji, Native ESM, Clean Audit.
- **Track B (E2E Testing)**:
  - Build comprehensive test suites across 4 tiers (Feature, Boundary, Combinatorial, Real-World Application scenarios).
  - Publish `TEST_READY.md`.

## 4. Final Verification & Acceptance (Phase 3)
- Execute complete test suite.
- Run multi-perspective review and forensic audit on full project.
- Report victory with full verification evidence back to parent.
