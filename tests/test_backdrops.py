#!/usr/bin/env python3
"""
================================================================================
RESIDENT LOVELY - ILLUSTRATED 2.5D BACKDROPS & BACKDROPMANAGER TEST SUITE
================================================================================
Standard: NEXUS PRIVE v6.0 | Strict Zero-Emoji Compliance | Native ESM
Target: Milestone 2 (R2) Verification
Test Framework: Python unittest + Node.js ESM evaluation
================================================================================
"""

import unittest
import subprocess
import os
import xml.etree.ElementTree as ET

PROJECT_ROOT = '/data/data/com.termux/files/home/projects/resident-lovely-game'
BACKDROPS_DIR = os.path.join(PROJECT_ROOT, 'assets', 'backdrops')
BACKDROPS_JS = os.path.join(PROJECT_ROOT, 'src', 'world', 'backdrops.js')

# Approved Unicode geometric glyphs
APPROVED_GLYPHS = {'★', '❖', '◈', '➔', '✔', '•', '▶', '▼', '►', '▲', '◄', '■', '□', '◆', '◇', '○', '●'}


class TestBackdropSystem(unittest.TestCase):
    """Unit test suite for BackdropManager, LRU Texture Cache, and 14 SVG Backdrops."""

    def run_node_eval(self, code):
        """Execute JavaScript snippet in Node.js environment with mocked Three.js context."""
        mock_three = """
        global.window = {
            innerWidth: 1920,
            innerHeight: 1080,
            devicePixelRatio: 1,
            addEventListener: () => {}
        };
        global.document = {
            getElementById: () => ({ appendChild: () => {} }),
            querySelectorAll: () => []
        };
        class MockObj {
            constructor() {
                this.position = { x: 0, y: 0, z: 0, set: (x,y,z)=>{this.position.x=x;this.position.y=y;this.position.z=z;}, copy: (p)=>{this.position.x=p.x;this.position.y=p.y;this.position.z=p.z;}, clone: ()=>({x:0,y:0,z:0,add:()=>{}}) };
                this.rotation = { x: 0, y: 0, z: 0, set: ()=>{} };
                this.scale = { x: 1, y: 1, z: 1, set: ()=>{}, setScalar: ()=>{} };
                this.color = { hex: 0, setHex: function(h){ this.hex=h; } };
                this.uniforms = {
                    uTexture: { value: null },
                    uUseTexture: { value: 0.0 },
                    uTime: { value: 0.0 },
                    uAlpha: { value: 1.0 },
                    uBiomeColor: { value: { hex: 0, setHex: function(h){ this.hex=h; } } },
                    uZenithColor: { value: { hex: 0, setHex: function(h){ this.hex=h; } } },
                    uHorizonColor: { value: { hex: 0, setHex: function(h){ this.hex=h; } } },
                    uVignetteInner: { value: 0.35 },
                    uVignetteOuter: { value: 0.50 },
                    uParallaxOffset: { value: { x: 0, y: 0, set: function(x,y){ this.x=x; this.y=y; } } }
                };
                this.material = this;
                this.geometry = { dispose: ()=>{} };
                this.renderOrder = 0;
                this.depthWrite = true;
                this.depthTest = true;
                this.transparent = false;
                this.disposed = false;
            }
            dispose() { this.disposed = true; }
        }
        global.THREE = {
            PlaneGeometry: function(w, h) {
                this.w = w; this.h = h;
                this.disposed = false;
                this.dispose = function() { this.disposed = true; };
            },
            ShaderMaterial: function(opts) {
                this.uniforms = opts.uniforms || {};
                this.depthWrite = opts.depthWrite !== undefined ? opts.depthWrite : true;
                this.depthTest = opts.depthTest !== undefined ? opts.depthTest : true;
                this.transparent = opts.transparent !== undefined ? opts.transparent : false;
                this.side = opts.side || 0;
                this.vertexShader = opts.vertexShader || '';
                this.fragmentShader = opts.fragmentShader || '';
                this.disposed = false;
                this.dispose = function() { this.disposed = true; };
            },
            Mesh: function(geom, mat) {
                this.geometry = geom;
                this.material = mat;
                this.renderOrder = 0;
                this.name = '';
                this.position = { x: 0, y: 0, z: 0, set: (x,y,z)=>{this.position.x=x;this.position.y=y;this.position.z=z;} };
            },
            Color: function(c) {
                this.hex = c;
                this.setHex = function(h) { this.hex = h; };
            },
            Vector2: function(x=0, y=0) {
                this.x = x; this.y = y;
                this.set = function(a, b) { this.x = a; this.y = b; return this; };
            },
            Texture: function() {
                this.disposed = false;
                this.dispose = function() { this.disposed = true; };
            },
            TextureLoader: function() {
                this.load = function(url, onLoad) {
                    const tex = new global.THREE.Texture();
                    tex.url = url;
                    if (onLoad) setTimeout(() => onLoad(tex), 0);
                    return tex;
                };
            },
            DoubleSide: 2,
            FrontSide: 0,
            BackSide: 1
        };
        """
        full_code = f"""
        {mock_three}
        import('./src/world/backdrops.js').then(async (backdropsModule) => {{
            {code}
        }}).catch(err => {{
            console.error(err);
            process.exit(1);
        }});
        """
        proc = subprocess.run(
            ['node', '-e', full_code],
            cwd=PROJECT_ROOT,
            capture_output=True,
            text=True
        )
        if proc.returncode != 0:
            print("STDOUT:", proc.stdout)
            print("STDERR:", proc.stderr)
        self.assertEqual(proc.returncode, 0, f"Node execution failed: {proc.stderr}")
        return proc.stdout.strip()

    # =========================================================================
    # TEST 1: 14 New Sector SVGs Authored in assets/backdrops/
    # =========================================================================
    def test_01_all_14_required_svgs_exist(self):
        """Verify all 14 specified SVG backdrops exist in assets/backdrops/."""
        required_svgs = [
            'backdrop_crystal_vault.svg',
            'backdrop_mirror_maze.svg',
            'backdrop_harbor_docks.svg',
            'backdrop_sacred_forest.svg',
            'backdrop_tea_salon.svg',
            'backdrop_clockwork_archives.svg',
            'backdrop_planetarium.svg',
            'backdrop_ice_chamber.svg',
            'backdrop_alchemy_dungeon.svg',
            'backdrop_grand_terrace.svg',
            'backdrop_sunken_grotto.svg',
            'backdrop_lighthouse_deck.svg',
            'backdrop_conservatory_annex.svg',
            'backdrop_secret_belfry.svg'
        ]
        for filename in required_svgs:
            filepath = os.path.join(BACKDROPS_DIR, filename)
            self.assertTrue(os.path.exists(filepath), f"Missing SVG backdrop: {filename}")
            self.assertGreater(os.path.getsize(filepath), 500, f"SVG file too small: {filename}")

    # =========================================================================
    # TEST 2: XML & SVG Structure Validation
    # =========================================================================
    def test_02_svg_xml_structure_and_viewbox(self):
        """Verify all SVG files parse as valid XML with standard 1920x1080 viewBox."""
        for filename in os.listdir(BACKDROPS_DIR):
            if not filename.endswith('.svg'):
                continue
            filepath = os.path.join(BACKDROPS_DIR, filename)
            try:
                tree = ET.parse(filepath)
                root = tree.getroot()
                self.assertIn('svg', root.tag.lower(), f"{filename} root must be svg")
                viewbox = root.attrib.get('viewBox', '')
                self.assertIn('1920', viewbox, f"{filename} viewBox should have width 1920")
                self.assertIn('1080', viewbox, f"{filename} viewBox should have height 1080")
            except Exception as e:
                self.fail(f"Failed to parse XML in {filename}: {e}")

    # =========================================================================
    # TEST 3: Strict Zero-Emoji Protocol in Backdrops and SVGs
    # =========================================================================
    def test_03_zero_emoji_in_backdrops_and_svgs(self):
        """Strict verification of 0 unicode emojis in src/world/backdrops.js and all SVGs."""
        files_to_scan = [BACKDROPS_JS]
        for f in os.listdir(BACKDROPS_DIR):
            if f.endswith('.svg'):
                files_to_scan.append(os.path.join(BACKDROPS_DIR, f))

        violations = []
        for path in files_to_scan:
            with open(path, 'r', encoding='utf-8') as handle:
                for line_idx, line in enumerate(handle, 1):
                    for char in line:
                        cp = ord(char)
                        if (0x1F300 <= cp <= 0x1FAFF) or (0x1F600 <= cp <= 0x1F64F) or (0x1F680 <= cp <= 0x1F6FF):
                            violations.append((os.path.basename(path), line_idx, char, hex(cp)))
        self.assertEqual(len(violations), 0, f"Found emoji violations in backdrop assets: {violations}")

    # =========================================================================
    # TEST 4: LRU Texture Cache Capping at Max 3 Active Textures
    # =========================================================================
    def test_04_lru_cache_eviction_and_disposal(self):
        """Verify LRU cache limits active textures to max 3 and invokes texture.dispose() on evicted textures."""
        code = """
        const { LRUTextureCache, MAX_ACTIVE_TEXTURES } = backdropsModule;
        if (MAX_ACTIVE_TEXTURES !== 3) {
            throw new Error(`Expected MAX_ACTIVE_TEXTURES === 3, got ${MAX_ACTIVE_TEXTURES}`);
        }

        const cache = new LRUTextureCache(3);
        const tex1 = { id: 1, disposed: false, dispose: function() { this.disposed = true; } };
        const tex2 = { id: 2, disposed: false, dispose: function() { this.disposed = true; } };
        const tex3 = { id: 3, disposed: false, dispose: function() { this.disposed = true; } };
        const tex4 = { id: 4, disposed: false, dispose: function() { this.disposed = true; } };

        cache.set('t1', tex1);
        cache.set('t2', tex2);
        cache.set('t3', tex3);
        if (cache.size !== 3) throw new Error(`Expected size 3, got ${cache.size}`);

        // Access t1 to make it most recently used (t2 becomes oldest)
        cache.get('t1');

        // Add 4th item: should evict t2 (not t1)
        cache.set('t4', tex4);
        if (cache.size !== 3) throw new Error(`Expected size 3 after eviction, got ${cache.size}`);
        if (!tex2.disposed) throw new Error('Evicted texture t2 was not disposed');
        if (tex1.disposed) throw new Error('MRU texture t1 was unexpectedly disposed');
        if (!cache.has('t1') || !cache.has('t3') || !cache.has('t4') || cache.has('t2')) {
            throw new Error(`Cache keys mismatch: ${cache.keys()}`);
        }

        // Test clear
        cache.clear();
        if (cache.size !== 0) throw new Error('Expected empty cache after clear');
        if (!tex1.disposed || !tex3.disposed || !tex4.disposed) throw new Error('Clear did not dispose all textures');

        console.log('LRU_CACHE_VALID');
        """
        out = self.run_node_eval(code)
        self.assertIn('LRU_CACHE_VALID', out)

    # =========================================================================
    # TEST 5: Quad Mesh Constraints (renderOrder: -1, depthWrite: false)
    # =========================================================================
    def test_05_quad_mesh_rendering_constraints(self):
        """Verify BackdropManager instantiates quad with renderOrder: -1 and depthWrite: false."""
        code = """
        const { BackdropManager } = backdropsModule;
        const manager = new BackdropManager();
        const mesh = manager.getMesh();

        if (mesh.renderOrder !== -1) {
            throw new Error(`Expected mesh.renderOrder === -1, got ${mesh.renderOrder}`);
        }
        if (mesh.material.depthWrite !== false) {
            throw new Error(`Expected material.depthWrite === false, got ${mesh.material.depthWrite}`);
        }
        if (mesh.name !== 'SectorBackdropQuad') {
            throw new Error(`Expected mesh.name === 'SectorBackdropQuad', got ${mesh.name}`);
        }
        console.log('QUAD_CONSTRAINTS_VALID');
        """
        out = self.run_node_eval(code)
        self.assertIn('QUAD_CONSTRAINTS_VALID', out)

    # =========================================================================
    # TEST 6: Radial Vignette GLSL Alpha Falloff & Edge Softening
    # =========================================================================
    def test_06_radial_vignette_glsl_shader(self):
        """Verify GLSL fragment shader implements radial vignette alpha falloff formula."""
        code = """
        const { BACKDROP_FRAGMENT_SHADER } = backdropsModule;
        if (!BACKDROP_FRAGMENT_SHADER.includes('smoothstep(uVignetteOuter, uVignetteInner, dist)')) {
            throw new Error('GLSL missing smoothstep vignette falloff');
        }
        if (!BACKDROP_FRAGMENT_SHADER.includes('distance(vUv, center)')) {
            throw new Error('GLSL missing radial distance calculation from center');
        }
        if (!BACKDROP_FRAGMENT_SHADER.includes('uParallaxOffset')) {
            throw new Error('GLSL missing parallax offset calculation');
        }
        console.log('VIGNETTE_GLSL_VALID');
        """
        out = self.run_node_eval(code)
        self.assertIn('VIGNETTE_GLSL_VALID', out)

    # =========================================================================
    # TEST 7: Camera Parallax Offset Calculation (0.005 factor)
    # =========================================================================
    def test_07_camera_parallax_calculation(self):
        """Verify BackdropManager computes parallax offset (factor 0.005) relative to active chamber center."""
        code = """
        const { BackdropManager, PARALLAX_FACTOR } = backdropsModule;
        if (PARALLAX_FACTOR !== 0.005) {
            throw new Error(`Expected PARALLAX_FACTOR === 0.005, got ${PARALLAX_FACTOR}`);
        }

        const manager = new BackdropManager();
        // Set active sector to S01 at coords (0, 0, 0)
        manager.setSector('S01');

        // Camera displaced by (100, 50, 20)
        const camera = { position: { x: 100, y: 50, z: 20 } };
        manager.update('S01', camera, 0.016);

        const uniforms = manager.getUniforms();
        const offset = uniforms.uParallaxOffset.value;
        const expectedX = -100 * 0.005; // -0.5
        const expectedY = -50 * 0.005;  // -0.25

        if (Math.abs(offset.x - expectedX) > 0.0001 || Math.abs(offset.y - expectedY) > 0.0001) {
            throw new Error(`Parallax mismatch: got (${offset.x}, ${offset.y}), expected (${expectedX}, ${expectedY})`);
        }
        console.log('PARALLAX_VALID');
        """
        out = self.run_node_eval(code)
        self.assertIn('PARALLAX_VALID', out)

    # =========================================================================
    # TEST 8: Procedural GLSL Gradient Fallback
    # =========================================================================
    def test_08_procedural_fallback_behavior(self):
        """Verify BackdropManager sets uUseTexture to 0.0 when texture is not loaded / fallback mode."""
        code = """
        const { BackdropManager } = backdropsModule;
        const manager = new BackdropManager();
        manager.setSector('S23'); // Sacred Forest

        const uniforms = manager.getUniforms();
        if (uniforms.uUseTexture.value !== 0.0) {
            throw new Error(`Expected uUseTexture === 0.0 in fallback mode, got ${uniforms.uUseTexture.value}`);
        }
        // Test manual texture application
        const dummyTex = new global.THREE.Texture();
        manager.applyTexture(dummyTex);
        if (uniforms.uUseTexture.value !== 1.0 || uniforms.uTexture.value !== dummyTex) {
            throw new Error('applyTexture failed to activate texture mode');
        }
        console.log('FALLBACK_VALID');
        """
        out = self.run_node_eval(code)
        self.assertIn('FALLBACK_VALID', out)

    # =========================================================================
    # TEST 9: Sector Lifecycle, Transition & Disposal
    # =========================================================================
    def test_09_sector_transition_and_disposal(self):
        """Verify sector transitions update active sector, reposition quad, and dispose cleanly."""
        code = """
        const { createSectorBackdrop } = backdropsModule;
        const manager = createSectorBackdrop('S19');
        if (manager.getActiveSector() !== 'S19') {
            throw new Error(`Expected active S19, got ${manager.getActiveSector()}`);
        }

        // Transition to S20
        const cam = { position: { x: -90, y: 5, z: 45 } };
        manager.update('S20', cam, 0.033);
        if (manager.getActiveSector() !== 'S20') {
            throw new Error(`Expected active S20, got ${manager.getActiveSector()}`);
        }

        // Dispose
        manager.dispose();
        if (manager.getLRUSize() !== 0) {
            throw new Error(`Expected LRU size 0 after dispose, got ${manager.getLRUSize()}`);
        }
        if (!manager.geometry.disposed || !manager.material.disposed) {
            throw new Error('Geometry or material not disposed');
        }
        console.log('TRANSITION_DISPOSAL_VALID');
        """
        out = self.run_node_eval(code)
        self.assertIn('TRANSITION_DISPOSAL_VALID', out)

    # =========================================================================
    # TEST 10: Asset Path Resolver for All 32 Sectors
    # =========================================================================
    def test_10_resolve_backdrop_asset_for_all_sectors(self):
        """Verify resolveBackdropAsset returns non-null valid path for all sectors S01 through S32."""
        code = """
        const { resolveBackdropAsset } = backdropsModule;
        for (let i = 1; i <= 32; i++) {
            const id = 'S' + (i < 10 ? '0' + i : i);
            const path = resolveBackdropAsset(id);
            if (!path || typeof path !== 'string' || path.length < 5) {
                throw new Error(`Failed to resolve backdrop asset for sector ${id}`);
            }
        }
        console.log('ALL_32_BACKDROPS_RESOLVED');
        """
        out = self.run_node_eval(code)
        self.assertIn('ALL_32_BACKDROPS_RESOLVED', out)


if __name__ == '__main__':
    unittest.main()
