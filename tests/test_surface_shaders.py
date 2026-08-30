#!/usr/bin/env python3
"""
================================================================================
RESIDENT LOVELY v3.5.0 - PER-SECTOR GLSL SURFACE SHADERS TEST SUITE
================================================================================
Standard: NEXUS PRIVE v6.0 | Strict Zero-Emoji Compliance
Authoritative Specs: ORIGINAL_REQUEST.md, PROJECT.md, surface-shaders.js
Target Platform: Mobile WebGL (60 FPS, Frame Time Budget <= 5.0ms)
Test Framework: Python 3.14 unittest + Node.js Execution Verifier
================================================================================
"""

import unittest
import os
import subprocess
import re
import json

GAME_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SURFACE_SHADERS_JS = os.path.join(GAME_DIR, 'src', 'world', 'shaders', 'surface-shaders.js')
SECTORS_JS = os.path.join(GAME_DIR, 'src', 'world', 'sectors.js')

def read_file(path):
    if not os.path.exists(path):
        return ""
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        return f.read()

class TestSurfaceShadersGLSL(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.code = read_file(SURFACE_SHADERS_JS)
        cls.sectors_code = read_file(SECTORS_JS)
        cls.assertTrue(len(cls.code) > 0, "surface-shaders.js must not be empty.")

    # -------------------------------------------------------------------------
    # 1. Syntax and Zero-Emoji Compliance
    # -------------------------------------------------------------------------
    def test_01_syntax_node_check(self):
        """Verify surface-shaders.js passes node --check without syntax errors."""
        res = subprocess.run(['node', '--check', SURFACE_SHADERS_JS], capture_output=True, text=True)
        self.assertEqual(res.returncode, 0, f"node --check failed: {res.stderr}")

    def test_02_zero_emoji_compliance(self):
        """Verify strict zero-emoji compliance in surface-shaders.js and test file."""
        for path in [SURFACE_SHADERS_JS, __file__]:
            content = read_file(path)
            violations = []
            for i, line in enumerate(content.splitlines(), 1):
                for ch in line:
                    cp = ord(ch)
                    if (0x1F300 <= cp <= 0x1F9FF) or (0x2600 <= cp <= 0x27BF and ch not in {
                        '★', '❖', '◈', '➔', '✔', '•', '▶', '▼', '►', '▲', '◄',
                        '■', '□', '◆', '◇', '○', '●', '█', '░', '─', '├', '│', '└',
                        '✖', '✓', '✕', '–', '—', '’', '“', '”', '…', '·', '©', '®', '™',
                        '±', '×', '÷', '≤', '≥', '≠', '°'
                    }):
                        violations.append((i, ch, hex(cp)))
            self.assertEqual(len(violations), 0, f"Found emojis in {path}: {violations}")

    # -------------------------------------------------------------------------
    # 2. All 8 GLSL Shader Material Exports
    # -------------------------------------------------------------------------
    def test_03_all_8_shader_vertex_and_fragment_exports(self):
        """Verify all 8 surface shader materials have exported vertex and fragment strings."""
        expected_shaders = [
            ('ivyVeinVertexShader', 'ivyVeinFragmentShader'),
            ('bioluminescentFloorVertexShader', 'bioluminescentFloorFragmentShader'),
            ('prismaticRefractionVertexShader', 'prismaticRefractionFragmentShader'),
            ('flowingRiverVertexShader', 'flowingRiverFragmentShader'),
            ('starTrailSkyVertexShader', 'starTrailSkyFragmentShader'),
            ('iceCrackFloorVertexShader', 'iceCrackFloorFragmentShader'),
            ('mechanicalGearWallVertexShader', 'mechanicalGearWallFragmentShader'),
            ('infiniteMirrorVertexShader', 'infiniteMirrorFragmentShader')
        ]

        for vert, frag in expected_shaders:
            self.assertIn(f"export const {vert}", self.code, f"Missing export for {vert}")
            self.assertIn(f"export const {frag}", self.code, f"Missing export for {frag}")

    def test_04_surface_shader_definitions_registry(self):
        """Verify SURFACE_SHADER_DEFINITIONS table contains all 8 shader keys."""
        self.assertIn("export const SURFACE_SHADER_DEFINITIONS", self.code)
        keys = [
            'ivy_vein', 'bioluminescent_floor', 'prismatic_refraction', 'flowing_river',
            'star_trail_sky', 'ice_crack_floor', 'mechanical_gear_wall', 'infinite_mirror'
        ]
        for key in keys:
            self.assertIn(f"{key}:", self.code, f"Missing key '{key}' in SURFACE_SHADER_DEFINITIONS")

    # -------------------------------------------------------------------------
    # 3. Uniforms and GLSL Functionality Verification
    # -------------------------------------------------------------------------
    def test_05_common_noise_and_math_chunks(self):
        """Verify GLSL procedural noise functions (hash21, valueNoise2D, fbm2D, voronoi2D)."""
        self.assertIn("GLSL_COMMON_NOISE", self.code)
        self.assertIn("float hash21", self.code)
        self.assertIn("float valueNoise2D", self.code)
        self.assertIn("float fbm2D", self.code)
        self.assertIn("vec2 voronoi2D", self.code)

    def test_06_ivy_vein_shader_structure(self):
        """Verify ivy_vein shader contains voronoi distance field and sap pulsing."""
        self.assertIn("uVeinColor", self.code)
        self.assertIn("uPulseSpeed", self.code)
        self.assertIn("uVeinDensity", self.code)
        self.assertIn("uGlowIntensity", self.code)
        self.assertIn("uAdjacentInfluence", self.code)
        self.assertIn("sapPulse", self.code)

    def test_07_bioluminescent_floor_shader_structure(self):
        """Verify bioluminescent_floor shader contains marble grid, ripple, and spore motes."""
        self.assertIn("uGlowColor", self.code)
        self.assertIn("uTileScale", self.code)
        self.assertIn("uRippleRadius", self.code)
        self.assertIn("marbleBase", self.code)
        self.assertIn("nodeGlow", self.code)

    def test_08_prismatic_refraction_shader_structure(self):
        """Verify prismatic_refraction shader contains Cauchy dispersion and facet normals."""
        self.assertIn("uFacetScale", self.code)
        self.assertIn("uDispersionStrength", self.code)
        self.assertIn("uFresnelPower", self.code)
        self.assertIn("spectralColor", self.code)
        self.assertIn("rainbowR", self.code)

    def test_09_flowing_river_shader_structure(self):
        """Verify flowing_river shader contains Gerstner waves, dual caustics, and foam."""
        self.assertIn("uDeepColor", self.code)
        self.assertIn("uShallowColor", self.code)
        self.assertIn("uFoamColor", self.code)
        self.assertIn("uFlowSpeed", self.code)
        self.assertIn("uWaveHeight", self.code)
        self.assertIn("uCausticIntensity", self.code)
        self.assertIn("flowUv1", self.code)

    def test_10_star_trail_sky_shader_structure(self):
        """Verify star_trail_sky shader contains polar coordinates and circular star streaks."""
        self.assertIn("uZenithColor", self.code)
        self.assertIn("uHorizonColor", self.code)
        self.assertIn("uStarColor", self.code)
        self.assertIn("uNebulaColor", self.code)
        self.assertIn("uRotationSpeed", self.code)
        self.assertIn("trailAngle", self.code)

    def test_11_ice_crack_floor_shader_structure(self):
        """Verify ice_crack_floor shader contains multi-scale cracks and parallax depth."""
        self.assertIn("uIceBaseColor", self.code)
        self.assertIn("uCrackGlowColor", self.code)
        self.assertIn("uCrackDensity", self.code)
        self.assertIn("uParallaxDepth", self.code)
        self.assertIn("crackDeep", self.code)

    def test_12_mechanical_gear_wall_shader_structure(self):
        """Verify mechanical_gear_wall shader contains cog tooth distance estimator and alternating rotation."""
        self.assertIn("uBrassColor", self.code)
        self.assertIn("uCopperColor", self.code)
        self.assertIn("uGearSpeed", self.code)
        self.assertIn("uToothCount", self.code)
        self.assertIn("gearDist", self.code)

    def test_13_infinite_mirror_shader_structure(self):
        """Verify infinite_mirror shader contains recursive depth tunnel loop and edge falloff."""
        self.assertIn("uBorderColor", self.code)
        self.assertIn("uTunnelDepth", self.code)
        self.assertIn("uFadingFactor", self.code)
        self.assertIn("uIterationCount", self.code)
        self.assertIn("depthScale", self.code)

    # -------------------------------------------------------------------------
    # 4. SurfaceShaderManager and Throttling Architecture
    # -------------------------------------------------------------------------
    def test_14_surface_shader_manager_class_and_singleton(self):
        """Verify SurfaceShaderManager class and default singleton instance export."""
        self.assertIn("export class SurfaceShaderManager", self.code)
        self.assertIn("export const surfaceShaderManager = new SurfaceShaderManager()", self.code)

    def test_15_node_runtime_manager_execution(self):
        """Verify SurfaceShaderManager methods execute properly under Node.js runtime."""
        node_script = """
        import { SurfaceShaderManager, surfaceShaderManager, SURFACE_SHADER_DEFINITIONS, getBloomPassConfig, getPbrNormalPerturbationGLSL } from './src/world/shaders/surface-shaders.js';
        import { SECTOR_REGISTRY } from './src/world/sectors.js';

        const manager = new SurfaceShaderManager({ maxActiveShaders: 2, targetFrameTimeMs: 5.0 });

        // Test 1: Shader definition count
        if (Object.keys(manager.shaderDefinitions).length !== 8) {
          throw new Error('Expected 8 shader definitions, found ' + Object.keys(manager.shaderDefinitions).length);
        }

        // Test 2: Fallback material generation
        const s01 = SECTOR_REGISTRY.find(s => s.id === 'S01');
        const fallback = manager.createFallbackMaterial(s01);
        if (!fallback || fallback.type !== 'MeshStandardMaterial') {
          throw new Error('Fallback material invalid: ' + JSON.stringify(fallback));
        }

        // Test 3: Sector material creation
        const mat = manager.createSectorMaterial(s01);
        if (!mat) {
          throw new Error('createSectorMaterial failed for S01');
        }

        // Test 4: Active sectors throttling (S01 active, S02 adjacent)
        manager.setActiveSectors('S01', ['S02']);
        const tel1 = manager.getTelemetry();
        if (tel1.activeShaderCount < 1) {
          throw new Error('Telemetry active count should be >= 1');
        }

        // Test 5: Update loop
        manager.update(0.016, 1.25, 'S01', ['S02']);
        const tel2 = manager.getTelemetry();
        if (tel2.avgFrameTimeMs > 5.0) {
          throw new Error('Frame time exceeded 5.0ms budget: ' + tel2.avgFrameTimeMs);
        }

        // Test 6: Bloom pass config
        const bloom = getBloomPassConfig();
        if (bloom.threshold !== 0.85 || bloom.strength !== 0.4 || bloom.radius !== 0.6) {
          throw new Error('Bloom config mismatch: ' + JSON.stringify(bloom));
        }

        // Test 7: PBR GLSL helper
        const pbrGlsl = getPbrNormalPerturbationGLSL();
        if (!pbrGlsl.includes('perturbNormal')) {
          throw new Error('PBR GLSL missing perturbNormal');
        }

        // Test 8: Dispose
        manager.dispose();
        const tel3 = manager.getTelemetry();
        if (tel3.activeShaderCount !== 0 || tel3.cachedShaderCount !== 0) {
          throw new Error('Dispose failed to clear cache');
        }

        console.log(JSON.stringify({ success: true, telemetry: tel2 }));
        """

        res = subprocess.run(['node', '--input-type=module', '-e', node_script], cwd=GAME_DIR, capture_output=True, text=True)
        self.assertEqual(res.returncode, 0, f"Node.js manager execution error: {res.stderr}\nOutput: {res.stdout}")
        data = json.loads(res.stdout.strip())
        self.assertTrue(data.get('success'))
        self.assertLessEqual(data['telemetry']['avgFrameTimeMs'], 5.0)

    # -------------------------------------------------------------------------
    # 5. Sector Registry Shader Binding Coverage
    # -------------------------------------------------------------------------
    def test_16_sector_registry_all_sectors_use_valid_surface_shaders(self):
        """Verify all 32 sectors in SECTOR_REGISTRY map to one of the 8 surface shaders."""
        node_script = """
        import { SECTOR_REGISTRY } from './src/world/sectors.js';
        import { SURFACE_SHADER_DEFINITIONS } from './src/world/shaders/surface-shaders.js';

        const validNames = new Set(Object.keys(SURFACE_SHADER_DEFINITIONS));
        const results = [];

        for (const s of SECTOR_REGISTRY) {
          const shaderName = s.shader || (s.shaders && s.shaders[0]);
          if (!shaderName || !validNames.has(shaderName)) {
            results.push({ id: s.id, name: s.name, shader: shaderName, valid: false });
          } else {
            results.push({ id: s.id, name: s.name, shader: shaderName, valid: true });
          }
        }

        console.log(JSON.stringify({ count: results.length, invalid: results.filter(r => !r.valid) }));
        """

        res = subprocess.run(['node', '--input-type=module', '-e', node_script], cwd=GAME_DIR, capture_output=True, text=True)
        self.assertEqual(res.returncode, 0, f"Node sector verification error: {res.stderr}")
        data = json.loads(res.stdout.strip())
        self.assertEqual(data['count'], 32, f"Expected 32 sectors, got {data['count']}")
        self.assertEqual(len(data['invalid']), 0, f"Found sectors with invalid shaders: {data['invalid']}")

    # -------------------------------------------------------------------------
    # 6. Post-Processing & Volumetric Light Shaft Helpers
    # -------------------------------------------------------------------------
    def test_17_volumetric_light_shaft_factory(self):
        """Verify createVolumetricLightShaft constructs volumetric god-ray helper."""
        self.assertIn("export function createVolumetricLightShaft", self.code)
        self.assertIn("coneFalloff", self.code)
        self.assertIn("radialCore", self.code)
        self.assertIn("dustDensity", self.code)

    def test_18_post_processing_bloom_and_fxaa(self):
        """Verify getBloomPassConfig and createPostProcessingPipeline helpers."""
        self.assertIn("export function getBloomPassConfig", self.code)
        self.assertIn("threshold: 0.85", self.code)
        self.assertIn("strength: 0.4", self.code)
        self.assertIn("radius: 0.6", self.code)
        self.assertIn("export function createPostProcessingPipeline", self.code)

if __name__ == '__main__':
    unittest.main()
