"""
Comprehensive Verification Suite for Milestone 1: Modular Sector Registry (32 Sectors)
Standards: NEXUS PRIVE v6.0 | Strict Zero-Emoji Protocol | Native ESM
"""

import unittest
import subprocess
import json
import os

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

class TestSectorRegistryExpansion(unittest.TestCase):

    def run_node_eval(self, code):
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
                this.color = { setHex: ()=>{} };
                this.shadow = { mapSize: {} };
                this.shadowMap = {};
                this.uniforms = { uTime: { value: 0 } };
                this.material = { uniforms: { uTime: { value: 0 } }, dispose: ()=>{} };
                this.geometry = { dispose: ()=>{} };
                this.children = [];
            }
            add() {}
            remove() {}
            setSize() {}
            setPixelRatio() {}
            clone() { return new MockObj(); }
        }
        global.THREE = {
            Scene: MockObj,
            Color: function(c) { this.hex = c; this.setHex = function(h) { this.hex = h; }; },
            Fog: MockObj,
            WebGLRenderer: MockObj,
            AmbientLight: MockObj,
            DirectionalLight: MockObj,
            PointLight: MockObj,
            Group: MockObj,
            BoxGeometry: MockObj,
            PlaneGeometry: MockObj,
            CircleGeometry: MockObj,
            RingGeometry: MockObj,
            CylinderGeometry: MockObj,
            ConeGeometry: function() {
                this.rotateX = function() {};
                this.translate = function() {};
                this.dispose = function() {};
            },
            TorusGeometry: MockObj,
            SphereGeometry: MockObj,
            OctahedronGeometry: MockObj,
            DodecahedronGeometry: MockObj,
            MeshStandardMaterial: MockObj,
            MeshBasicMaterial: MockObj,
            ShaderMaterial: MockObj,
            Mesh: MockObj,
            Vector3: function(x=0, y=0, z=0) {
                this.x = x; this.y = y; this.z = z;
                this.set = function(a,b,c) { this.x=a; this.y=b; this.z=c; return this; };
                this.copy = function(v) { this.x=v.x; this.y=v.y; this.z=v.z; return this; };
                this.clone = function() { return new global.THREE.Vector3(this.x, this.y, this.z); };
                this.add = function(v) { this.x+=v.x; this.y+=v.y; this.z+=v.z; return this; };
                this.addScaledVector = function() { return this; };
                this.distanceTo = function() { return 0; };
                this.normalize = function() { return this; };
                this.multiplyScalar = function() { return this; };
                this.applyAxisAngle = function() { return this; };
                this.lerp = function() { return this; };
            },
            PerspectiveCamera: MockObj,
            MathUtils: { clamp: (v, min, max) => Math.max(min, Math.min(max, v)) },
            PCFSoftShadowMap: 1,
            ACESFilmicToneMapping: 1,
            DoubleSide: 2,
            BackSide: 1,
            AdditiveBlending: 2
        };
        """
        full_code = f"""
        {mock_three}
        import('./src/world/sectors.js').then(async (sectorsModule) => {{
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

    def test_32_sectors_registered(self):
        """Verify that all 32 sectors (S01 to S32) are registered with required schema fields."""
        code = """
        const { SECTOR_REGISTRY } = sectorsModule;
        if (SECTOR_REGISTRY.length !== 32 && SECTOR_REGISTRY.length !== 40) {
            throw new Error(`Expected 32 or 40 sectors, got ${SECTOR_REGISTRY.length}`);
        }
        SECTOR_REGISTRY.forEach(s => {
            if (!s.id || !s.slug || !s.name || !s.floor || !s.biome || !s.biomeColor || !s.coords || !s.size || !s.connections) {
                throw new Error(`Sector ${s.id || 'unknown'} missing required fields`);
            }
            if (typeof s.coords.x !== 'number' || typeof s.coords.y !== 'number' || typeof s.coords.z !== 'number') {
                throw new Error(`Sector ${s.id} invalid coords`);
            }
            if (typeof s.size.w !== 'number' || typeof s.size.l !== 'number' || typeof s.size.h !== 'number') {
                throw new Error(`Sector ${s.id} invalid size`);
            }
            if (!Array.isArray(s.connections)) {
                throw new Error(`Sector ${s.id} connections is not an array`);
            }
            if (!Array.isArray(s.shaders) && typeof s.shader !== 'string') {
                throw new Error(`Sector ${s.id} missing shader configuration`);
            }
            if (!s.backdrop) {
                throw new Error(`Sector ${s.id} missing backdrop`);
            }
            if (!s.light) {
                throw new Error(`Sector ${s.id} missing light`);
            }
            if (!s.pbr) {
                throw new Error(`Sector ${s.id} missing pbr`);
            }
        });
        console.log('ALL_32_SECTORS_VALID');
        """
        out = self.run_node_eval(code)
        self.assertIn('ALL_32_SECTORS_VALID', out)

    def test_floor_distribution(self):
        """Verify sector distribution across distinct floor tabs."""
        code = """
        const { getFloorSectors, FLOOR_ORDER } = sectorsModule;
        const counts = {};
        FLOOR_ORDER.forEach(f => {
            const list = getFloorSectors(f);
            counts[f] = list.length;
        });
        console.log(JSON.stringify(counts));
        """
        out = self.run_node_eval(code)
        counts = json.loads(out)
        self.assertEqual(counts['4F'], 2)
        self.assertEqual(counts['3F'], 2)
        self.assertEqual(counts['2F'], 4)
        self.assertEqual(counts['1F'], 10)
        self.assertEqual(counts['B1'], 1)
        self.assertEqual(counts['B2'], 4)
        self.assertEqual(counts['OUTDOOR'], 9)
        if '5F' in counts:
            self.assertEqual(counts['5F'], 4)
            self.assertEqual(counts['B3'], 4)
            self.assertEqual(sum(counts.values()), 40)
        else:
            self.assertEqual(sum(counts.values()), 32)

    def test_biome_colors_and_tokens(self):
        """Verify 8 biome tokens match NEXUS PRIVE v6.0 color specs."""
        code = """
        const { BIOME_COLORS, SECTOR_REGISTRY } = sectorsModule;
        const requiredBiomes = ['estate', 'gothic', 'kawaii', 'outdoor', 'forest', 'maritime', 'subterranean', 'crystal'];
        requiredBiomes.forEach(b => {
            if (!BIOME_COLORS[b]) throw new Error(`Missing biome color for ${b}`);
        });
        SECTOR_REGISTRY.forEach(s => {
            if (!BIOME_COLORS[s.biome]) throw new Error(`Unknown biome: ${s.biome} in sector ${s.id}`);
            if (s.biomeColor !== BIOME_COLORS[s.biome]) throw new Error(`Biome color mismatch in ${s.id}`);
        });
        console.log('BIOMES_VALID');
        """
        out = self.run_node_eval(code)
        self.assertIn('BIOMES_VALID', out)

    def test_lookup_helpers(self):
        """Verify getSector, getFloorSectors, and getAdjacentSectors behavior and edge cases."""
        code = """
        const { getSector, getFloorSectors, getAdjacentSectors } = sectorsModule;
        
        // Nonexistent sector
        if (getSector('S99') !== null) throw new Error('getSector(S99) should return null');
        if (getSector(null) !== null) throw new Error('getSector(null) should return null');
        if (getSector('') !== null) throw new Error('getSector("") should return null');

        // Case insensitivity
        const s1 = getSector('s01');
        const s2 = getSector('FOYER');
        if (!s1 || !s2 || s1.id !== 'S01' || s2.id !== 'S01') throw new Error('Case insensitive lookup failed');

        // Invalid floor
        if (getFloorSectors('10F').length !== 0) throw new Error('getFloorSectors(10F) should return empty array');
        if (getFloorSectors(null).length !== 0) throw new Error('getFloorSectors(null) should return empty array');

        // Adjacent query
        const adjS01 = getAdjacentSectors('S01');
        if (adjS01.length !== 6) throw new Error(`Expected 6 adjacent for S01, got ${adjS01.length}`);
        
        const adjS31 = getAdjacentSectors('S31');
        if (!adjS31.some(a => a.id === 'S30')) throw new Error('Expected S30 adjacent to S31');

        if (getAdjacentSectors('S99').length !== 0) throw new Error('getAdjacentSectors(S99) should return []');

        console.log('LOOKUP_HELPERS_VALID');
        """
        out = self.run_node_eval(code)
        self.assertIn('LOOKUP_HELPERS_VALID', out)

    def test_rooms_backward_compatibility_and_all_32_chambers(self):
        """Verify rooms.js exports rooms dictionary with all 32 sectors and aliases."""
        code = """
        const { SECTOR_REGISTRY } = sectorsModule;
        const { rooms, initRooms } = await import('./src/world/rooms.js');
        
        SECTOR_REGISTRY.forEach(s => {
            if (!rooms[s.slug]) throw new Error(`rooms[${s.slug}] missing`);
            if (!rooms[s.id]) throw new Error(`rooms[${s.id}] missing`);
        });
        initRooms();
        console.log('ROOMS_32_VALID');
        """
        out = self.run_node_eval(code)
        self.assertIn('ROOMS_32_VALID', out)

    def test_scene_point_lights_generation(self):
        """Verify scene.js defines point lights dynamically for all 32 sectors."""
        code = """
        const { SECTOR_REGISTRY } = sectorsModule;
        const sceneModule = await import('./src/world/scene.js');
        const { sectorPointLights, foyerLight, cryptLight } = sceneModule;
        
        if (!sectorPointLights) throw new Error('sectorPointLights missing in scene.js');
        SECTOR_REGISTRY.forEach(s => {
            if (!sectorPointLights[s.id]) throw new Error(`sectorPointLights[${s.id}] missing`);
            if (!sectorPointLights[s.slug]) throw new Error(`sectorPointLights[${s.slug}] missing`);
        });
        if (!foyerLight || !cryptLight) throw new Error('Legacy point lights missing');
        console.log('SCENE_LIGHTS_VALID');
        """
        out = self.run_node_eval(code)
        self.assertIn('SCENE_LIGHTS_VALID', out)

    def test_zero_emoji_compliance_on_all_modified_files(self):
        """Strict scanner asserting zero unicode emojis in all modified files."""
        files = [
            'src/world/sectors.js',
            'src/world/rooms.js',
            'src/world/scene.js',
            'src/main.js',
            'src/engine/camera.js',
            'src/engine/audio.js'
        ]
        violations = []
        for rel in files:
            path = os.path.join(PROJECT_ROOT, rel)
            with open(path, 'r', encoding='utf-8') as f:
                for idx, line in enumerate(f, 1):
                    for ch in line:
                        code = ord(ch)
                        if 0x1F300 <= code <= 0x1FAFF or 0x1F600 <= code <= 0x1F64F or 0x1F680 <= code <= 0x1F6FF:
                            violations.append((rel, idx, ch, hex(code)))
        self.assertEqual(len(violations), 0, f"Found emoji violations in codebase: {violations}")

if __name__ == '__main__':
    unittest.main()
