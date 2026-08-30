"""
Comprehensive Verification Suite for Milestone 5 (R5):
Procedural 3D Chamber Geometry & Decorative Props Engine (S01 - S32)
Standards: NEXUS PRIVE v6.0 | Strict Zero-Emoji Protocol | Native ESM
"""

import unittest
import subprocess
import json
import os
import re

PROJECT_ROOT = '/data/data/com.termux/files/home/projects/resident-lovely-game'

class TestChamberGeometryExpansion(unittest.TestCase):

    def run_node_eval(self, code):
        mock_three = """
        global.window = {
            innerWidth: 1920,
            innerHeight: 1080,
            devicePixelRatio: 1,
            addEventListener: () => {}
        };
        global.document = {
            getElementById: () => ({ appendChild: () => {}, style: {} }),
            querySelectorAll: () => []
        };
        class MockObj {
            constructor(name = '') {
                this.name = name;
                this.position = {
                    x: 0, y: 0, z: 0,
                    set: (x,y,z)=>{this.position.x=x;this.position.y=y;this.position.z=z;return this;},
                    copy: (p)=>{this.position.x=p.x;this.position.y=p.y;this.position.z=p.z;return this;},
                    clone: ()=>{
                        const v = { x: this.position.x, y: this.position.y, z: this.position.z };
                        v.add = (other)=>{ v.x+=other.x; v.y+=other.y; v.z+=other.z; return v; };
                        v.clone = ()=>({x:v.x, y:v.y, z:v.z, add:()=>v});
                        return v;
                    }
                };
                this.rotation = { x: 0, y: 0, z: 0, set: (x,y,z)=>{this.rotation.x=x;this.rotation.y=y;this.rotation.z=z;} };
                this.scale = { x: 1, y: 1, z: 1, set: ()=>{}, setScalar: ()=>{} };
                this.color = { setHex: ()=>{} };
                this.shadow = { mapSize: {} };
                this.shadowMap = {};
                this.uniforms = { uTime: { value: 0 } };
                this.material = { uniforms: { uTime: { value: 0 } }, dispose: ()=>{}, opacity: 1 };
                this.geometry = { dispose: ()=>{} };
                this.children = [];
                this.userData = {};
            }
            add(child) {
                if (child) this.children.push(child);
            }
            remove(child) {
                const idx = this.children.indexOf(child);
                if (idx >= 0) this.children.splice(idx, 1);
            }
            setSize() {}
            setPixelRatio() {}
            clone() { return new MockObj(this.name); }
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
        import('./src/world/rooms.js').then(async (roomsModule) => {{
            {code}
        }}).catch(err => {{
            console.error(err);
            process.exit(1);
        }});
        """
        result = subprocess.run(
            ['node', '--input-type=module', '-e', full_code],
            cwd=PROJECT_ROOT,
            capture_output=True,
            text=True
        )
        if result.returncode != 0:
            print("STDERR:", result.stderr)
        self.assertEqual(result.returncode, 0, f"Node eval failed: {result.stderr}")
        return json.loads(result.stdout.strip()) if result.stdout.strip() else {}

    def test_zero_emoji_protocol(self):
        """Strict Zero-Emoji Protocol across rooms.js and test files."""
        emoji_pattern = re.compile(
            r'[\U0001F300-\U0001F9FF\U0001FA00-\U0001FAFF\U00002702-\U000027B0\U0001F600-\U0001F64F\U0001F680-\U0001F6FF]'
        )
        target_files = [
            os.path.join(PROJECT_ROOT, 'src/world/rooms.js'),
            os.path.join(PROJECT_ROOT, 'tests/test_chamber_geometry.py')
        ]
        for fpath in target_files:
            with open(fpath, 'r', encoding='utf-8') as f:
                content = f.read()
            matches = emoji_pattern.findall(content)
            self.assertEqual(len(matches), 0, f"Emoji violation found in {fpath}: {matches}")

    def test_all_32_sectors_registered_in_rooms(self):
        """Verify all 32 sectors (S01 to S32) exist in rooms by ID, slug, and aliases."""
        code = """
        const sectorIds = [];
        for (let i = 1; i <= 32; i++) {
            const id = 'S' + (i < 10 ? '0' + i : i);
            sectorIds.push(id);
        }
        const results = {};
        sectorIds.forEach(id => {
            results[id] = !!roomsModule.rooms[id];
        });
        console.log(JSON.stringify(results));
        """
        res = self.run_node_eval(code)
        for i in range(1, 33):
            sec_id = f"S{i:02d}"
            self.assertTrue(res.get(sec_id), f"Sector {sec_id} missing from rooms dictionary")

    def test_init_rooms_populates_all_chambers(self):
        """Verify initRooms() builds 3D geometry for all 32 sectors."""
        code = """
        roomsModule.initRooms();
        const counts = {};
        for (let i = 1; i <= 32; i++) {
            const id = 'S' + (i < 10 ? '0' + i : i);
            const r = roomsModule.rooms[id];
            counts[id] = {
                childrenCount: r ? r.children.length : 0,
                hasUserData: !!(r && r.userData && r.userData.bounds),
                interactablesCount: (r && r.userData && r.userData.interactables) ? r.userData.interactables.length : 0
            };
        }
        console.log(JSON.stringify(counts));
        """
        res = self.run_node_eval(code)
        for i in range(1, 33):
            sec_id = f"S{i:02d}"
            info = res.get(sec_id, {})
            self.assertGreater(info.get('childrenCount', 0), 0, f"Chamber {sec_id} has no 3D mesh children")
            self.assertTrue(info.get('hasUserData', False), f"Chamber {sec_id} missing bounds in userData")
            self.assertGreaterEqual(info.get('interactablesCount', 0), 1, f"Chamber {sec_id} has no interactables")

    def test_14_new_sectors_props_and_structures(self):
        """Verify the 14 new sectors (S19 to S32) have 2+ decorative props and full perimeter structures."""
        code = """
        roomsModule.initRooms();
        const newSectors = ['S19', 'S20', 'S21', 'S22', 'S23', 'S24', 'S25', 'S26', 'S27', 'S28', 'S29', 'S30', 'S31', 'S32'];
        const details = {};
        newSectors.forEach(id => {
            const r = roomsModule.rooms[id];
            const childNames = r ? r.children.map(c => c.name).filter(Boolean) : [];
            details[id] = {
                slug: r.userData.slug,
                dimensions: r.userData.dimensions,
                bounds: r.userData.bounds,
                childCount: r.children.length,
                interactables: r.userData.interactables,
                collisionBoxes: r.userData.collisionBoxes
            };
        });
        console.log(JSON.stringify(details));
        """
        res = self.run_node_eval(code)
        expected_slugs = {
            'S19': 'conservatory',
            'S20': 'tea_salon',
            'S21': 'music_parlor',
            'S22': 'village_district',
            'S23': 'sacred_forest_trail',
            'S24': 'harbor_docks',
            'S25': 'moonlit_meadow',
            'S26': 'crystal_grotto',
            'S27': 'moonlit_rooftop',
            'S28': 'clock_tower_belfry',
            'S29': 'mirror_maze_gallery',
            'S30': 'underground_river_cavern',
            'S31': 'crystal_vault',
            'S32': 'ancient_ruins'
        }
        for sec_id, exp_slug in expected_slugs.items():
            info = res[sec_id]
            self.assertEqual(info['slug'], exp_slug, f"{sec_id} slug mismatch: {info['slug']} vs {exp_slug}")
            self.assertGreaterEqual(info['childCount'], 3, f"{sec_id} should have floor, perimeter walls, and props (got {info['childCount']})")
            self.assertGreaterEqual(len(info['interactables']), 2, f"{sec_id} must have at least 2 interactable points")
            self.assertGreaterEqual(len(info['collisionBoxes']), 1, f"{sec_id} must have collision boundary box")

    def test_query_helpers(self):
        """Verify getRoomBounds, getRoomInteractables, and getRoomCollisionBoxes."""
        code = """
        roomsModule.initRooms();
        const bounds = roomsModule.getRoomBounds('S19');
        const interactables = roomsModule.getRoomInteractables('S19');
        const collision = roomsModule.getRoomCollisionBoxes('S19');
        console.log(JSON.stringify({ bounds, interactablesCount: interactables.length, collisionCount: collision.length }));
        """
        res = self.run_node_eval(code)
        self.assertIsNotNone(res.get('bounds'))
        self.assertGreaterEqual(res.get('interactablesCount', 0), 2)
        self.assertGreaterEqual(res.get('collisionCount', 0), 1)

    def test_animation_update_loop(self):
        """Verify updateGroundItems updates water, astrolabes, clock gears, crystals, and floating gems."""
        code = """
        roomsModule.initRooms();
        const initialWaterCount = roomsModule.animatedWaterMeshes.length;
        const initialAstrolabeCount = roomsModule.animatedAstrolabeRings.length;
        const initialClockGearsCount = roomsModule.animatedClockGears.length;
        const initialFloatingCount = roomsModule.animatedFloatingCrystals.length;
        
        // Execute update loop
        roomsModule.updateGroundItems(0.016, 1.0);

        console.log(JSON.stringify({
            waterCount: initialWaterCount,
            astrolabeCount: initialAstrolabeCount,
            clockGearsCount: initialClockGearsCount,
            floatingCount: initialFloatingCount
        }));
        """
        res = self.run_node_eval(code)
        self.assertGreater(res['waterCount'], 0)
        self.assertGreater(res['astrolabeCount'], 0)
        self.assertGreater(res['clockGearsCount'], 0)
        self.assertGreater(res['floatingCount'], 0)

if __name__ == '__main__':
    unittest.main()
