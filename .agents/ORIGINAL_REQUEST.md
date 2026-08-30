# Original User Request

## Initial Request — 2026-08-28T02:41:05Z

Implement the Subterranean B2 Depths & Crystal Grotto interactive puzzle mechanics (S26 Crystal Grotto, S30 Underground River Cavern, S31 Crystal Vault, S32 Ancient Ruins) for Resident Lovely: Maximum Happiness 3D (Three.js r128 native ESM, NEXUS PRIVÉ v6.0).

Working directory: /data/data/com.termux/files/home/projects/resident-lovely-game
Integrity mode: development

Reference spec: /data/data/com.termux/files/home/projects/cryo-omega/docs/superpowers/specs/2026-08-28--resident-lovely-subterranean-b2-puzzles.md

## Requirements

### R1. Subterranean River Raft Navigation (S30)
In `src/world/rooms.js` and `src/main.js`, implement interactive Wooden Ferry Raft in `rooms.underground_river_cavern` (`S30`). Approaching and pressing E triggers a cinematic crossing across the cavern river, dynamically translating player position and unlocking the shortcut portal between S18 Crypt and S31 Crystal Vault.

### R2. Crystal Prism Laser Alignment Puzzle (S31)
In `src/world/rooms.js`, `src/main.js`, and `src/world/scene.js`, implement 3 interactive optical crystal prisms (`prism_alpha`, `prism_beta`, `prism_gamma`) in `rooms.crystal_vault` (`S31`). Interacting rotates each prism by 45°. When aligned to `[45, 90, 135]`, render dynamic Three.js laser reflection beam (`LineSegments` with additive emissive cyan/gold material) connecting the prisms to the vault gate, unlocking the **Prismatic Sun Sigil**.

### R3. Ancient Rune Door & Pedestal Offerings (S32)
In `src/world/rooms.js` and `src/main.js`, implement the Ancient Rune Gateway in `rooms.ancient_ruins` (`S32`) with 4 glowing elemental pedestals. Placing harvested crystal shards awakens the ancient rune glyphs, emits stardust particles, and grants a permanent Joy Capacity expansion (+50 Max Joy).

### R4. Procedural Synthesizer Audio Stems & Shaders
In `src/engine/audio.js`, add Web Audio API synthesizer methods:
- `playPrismRotateClick(freq)`
- `playLaserBeamHum()`
- `playAncientGateRumble()`
Ensure `flowing_river`, `prismatic_refraction`, and `ice_crack_floor` shaders in `src/world/shaders/surface-shaders.js` hook seamlessly into S30 and S31 chambers.

## Acceptance Criteria

### Raft Navigation
- [ ] Interacting with the raft in S30 smoothly animates player across the river channel without clipping or falling through floor.
- [ ] Shortcut connection state is persisted in `gameState`.

### Laser Puzzle
- [ ] Each of the 3 prisms in S31 rotates 45° per interaction.
- [ ] Laser reflection beam connects prisms when correct harmonic angles are reached.
- [ ] Unlocks Prismatic Sun Sigil item into inventory and updates quest HUD.

### Ancient Gateway
- [ ] Pedestals in S32 accept crystal shard offerings and illuminate corresponding glyphs.
- [ ] Rune gate opens with camera rumble shake and stardust particle burst.

### Code Quality & Standards
- [ ] Strict Zero-Emoji compliance across all modified and new files (Unicode symbols `★`, `❖`, `◈`, `▶`, `✔` only).
- [ ] Native ESM imports/exports throughout.
- [ ] All unit and E2E tests in `tests/` pass with 0 errors.
