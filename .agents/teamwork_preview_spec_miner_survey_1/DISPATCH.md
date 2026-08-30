## 2026-08-28T02:00:21Z

You are Explorer 1 (Spec Miner) for the Resident Lovely Game Graphics & Map Expansion project.

Your Working Directory: /data/data/com.termux/files/home/projects/resident-lovely-game/.agents/teamwork_preview_spec_miner_survey_1
Original Request File: /data/data/com.termux/files/home/projects/resident-lovely-game/.agents/ORIGINAL_REQUEST.md
Reference Spec: /data/data/com.termux/files/home/projects/cryo-omega/docs/superpowers/specs/2026-08-28--resident-lovely-graphic-map-expansion.md

Objective:
1. Deep-read the spec at /data/data/com.termux/files/home/projects/cryo-omega/docs/superpowers/specs/2026-08-28--resident-lovely-graphic-map-expansion.md and ORIGINAL_REQUEST.md.
2. Extract the complete requirements and schemas:
   - Full sector registry specification for all 32 sectors (S01 to S32): ID, name, floor (4F, 3F, 2F, 1F, B1, B2, OUTDOOR), biome, adjacent connections, assigned shaders, assigned backdrops, ambient/accent colors, lighting.
   - Illustrated 2.5D Backdrop System: lazy loading, max active count (3), SVG/PNG formats, fallback GLSL gradient, renderOrder, depthWrite, file naming.
   - Per-Sector GLSL Surface Shaders: All 8 GLSL materials (ivy_vein, bioluminescent_floor, prismatic_refraction, flowing_river, star_trail_sky, ice_crack_floor, mechanical_gear_wall, infinite_mirror), uniforms, animation loop, sector-flag enforcement (active + 1 adjacent), MeshStandardMaterial fallback, frame time budget (<= 5.0ms).
   - Holographic Blueprint Map v2: SVG auto-generation, 7 floor tabs, biome-specific fills, animated dashed paths, click info panel, DOM node budget (<= 200 SVG DOM nodes per floor view).
   - New Chamber Geometry for S19-S32: dimensions, floor plane, 4 walls, ceiling, 2+ decorative 3D props per chamber, point lights, collision and room transition mechanics.
   - Zero emojis rule (NEXUS PRIVÉ v6.0 rule).
3. Write your findings to survey_spec.md in your working directory and write handoff.md.
4. Send a message to parent when completed with the path to your handoff.md.
