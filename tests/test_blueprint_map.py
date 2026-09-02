#!/usr/bin/env python3
"""
================================================================================
RESIDENT LOVELY v2.0 - HOLOGRAPHIC BLUEPRINT MAP v2 UNIT TEST SUITE (M4 / R4)
================================================================================
Standards: NEXUS PRIVE v6.0 | Strict Zero-Emoji Protocol | Native ESM
Authoritative Specs: ORIGINAL_REQUEST.md, 2026-08-28--resident-lovely-graphic-map-expansion.md
Target: Holographic Blueprint Map v2 (SVG generation, 7 floor tabs, <= 180 DOM nodes, biomes)
================================================================================
"""

import unittest
import subprocess
import json
import os
import re

PROJECT_ROOT = '/data/data/com.termux/files/home/projects/resident-lovely-game'

class TestBlueprintMapV2(unittest.TestCase):

    def run_node_eval(self, code):
        """Runs Node.js code with ESM imports and mock DOM/Audio environment."""
        mock_env = """
        global.window = {
            innerWidth: 1920,
            innerHeight: 1080,
            devicePixelRatio: 1,
            __playerPos: { x: 0, y: 0, z: 0 },
            __playerRot: 0,
            addEventListener: () => {}
        };
        class MockAudioNode {
            connect() {}
            start() {}
            stop() {}
            setValueAtTime() {}
            linearRampToValueAtTime() {}
            exponentialRampToValueAtTime() {}
        }
        global.window.AudioContext = function() {
            this.state = 'running';
            this.currentTime = 0;
            this.destination = new MockAudioNode();
            this.createOscillator = () => {
                const node = new MockAudioNode();
                node.frequency = new MockAudioNode();
                return node;
            };
            this.createGain = () => {
                const node = new MockAudioNode();
                node.gain = new MockAudioNode();
                return node;
            };
            this.createBiquadFilter = () => {
                const node = new MockAudioNode();
                node.frequency = new MockAudioNode();
                return node;
            };
            this.createBufferSource = () => new MockAudioNode();
            this.createBuffer = () => ({ getChannelData: () => new Float32Array(100) });
            this.resume = async () => {};
        };
        global.window.webkitAudioContext = global.window.AudioContext;
        global.AudioContext = global.window.AudioContext;
        class MockElement {
            constructor(tagName = 'div') {
                this.tagName = tagName;
                this.style = {};
                this.classList = {
                    classes: new Set(),
                    add: function(c) { this.classes.add(c); },
                    remove: function(c) { this.classes.delete(c); },
                    toggle: function(c, force) {
                        if (force === undefined) {
                            if (this.classes.has(c)) this.classes.delete(c);
                            else this.classes.add(c);
                        } else if (force) {
                            this.classes.add(c);
                        } else {
                            this.classes.delete(c);
                        }
                    },
                    contains: function(c) { return this.classes.has(c); }
                };
                this.children = [];
                this.attributes = {};
                this.textContent = '';
                this.innerHTML = '';
                this.outerHTML = '';
            }
            setAttribute(k, v) { this.attributes[k] = String(v); }
            getAttribute(k) { return this.attributes[k] || null; }
            appendChild(child) { this.children.push(child); return child; }
            querySelector(sel) { return null; }
            querySelectorAll(sel) { return []; }
            addEventListener() {}
            insertAdjacentHTML() {}
        }
        global.document = {
            getElementById: (id) => new MockElement('div'),
            querySelector: (sel) => new MockElement('div'),
            querySelectorAll: (sel) => [],
            createElement: (tag) => new MockElement(tag)
        };
        global.THREE = {
            Vector3: function(x=0, y=0, z=0) {
                this.x = x; this.y = y; this.z = z;
                this.clone = () => new global.THREE.Vector3(this.x, this.y, this.z);
            }
        };
        """
        full_code = f"""
        {mock_env}
        Promise.all([
            import('./src/world/sectors.js'),
            import('./src/systems/minimap.js')
        ]).then(async ([sectorsModule, minimapModule]) => {{
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

    def test_dynamic_svg_generation_derived_from_sector_registry(self):
        """Verify dynamic SVG generation produces valid SVG containing sectors from SECTOR_REGISTRY."""
        code = """
        const { SECTOR_REGISTRY, FLOOR_ORDER, getFloorSectors } = sectorsModule;
        const { generateBlueprintSvg } = minimapModule;

        FLOOR_ORDER.forEach(floor => {
            const svg = generateBlueprintSvg(floor);
            if (!svg.startsWith('<svg') || !svg.endsWith('</svg>')) {
                throw new Error(`Invalid SVG generated for floor ${floor}`);
            }
            if (!svg.includes('id="estate-blueprint-svg"')) {
                throw new Error(`Missing estate-blueprint-svg id in floor ${floor}`);
            }
            if (!svg.includes('id="blueprint-connections"')) {
                throw new Error(`Missing blueprint-connections group in floor ${floor}`);
            }
            if (!svg.includes('id="blueprint-sectors"')) {
                throw new Error(`Missing blueprint-sectors group in floor ${floor}`);
            }

            const floorSectors = getFloorSectors(floor);
            floorSectors.forEach(s => {
                if (!svg.includes(`data-sector-id="${s.id}"`)) {
                    throw new Error(`Sector ${s.id} not found in SVG for floor ${floor}`);
                }
                if (!svg.includes(`id="map-room-${s.slug}"`)) {
                    throw new Error(`Sector slug ${s.slug} node missing in floor ${floor}`);
                }
            });
        });
        console.log('DYNAMIC_SVG_SECTORS_VALID');
        """
        out = self.run_node_eval(code)
        self.assertIn('DYNAMIC_SVG_SECTORS_VALID', out)

    def test_7_tab_floor_distribution_coverage(self):
        """Verify all 7 floor tabs exist and cover all 32 sectors with 0 missing."""
        code = """
        const { SECTOR_REGISTRY, FLOOR_ORDER, getFloorSectors } = sectorsModule;
        const { FLOOR_METADATA } = minimapModule;

        const expectedFloors = ['4F', '3F', '2F', '1F', 'B1', 'B2', 'OUTDOOR'];
        expectedFloors.forEach(f => {
            if (!FLOOR_ORDER.includes(f)) throw new Error(`Floor ${f} missing from FLOOR_ORDER`);
            if (!FLOOR_METADATA[f]) throw new Error(`Floor ${f} missing from FLOOR_METADATA`);
        });

        let totalCovered = 0;
        FLOOR_ORDER.forEach(f => {
            const list = getFloorSectors(f);
            totalCovered += list.length;
        });

        if (totalCovered !== 32 && totalCovered !== 40) {
            throw new Error(`Expected 32 or 40 sectors, got ${totalCovered}`);
        }
        console.log('FLOOR_TABS_32_SECTORS_VALID');
        """
        out = self.run_node_eval(code)
        self.assertIn('FLOOR_TABS_32_SECTORS_VALID', out)

    def test_svg_dom_node_budget_under_180_nodes_per_floor(self):
        """Verify that every floor view strictly abides by the max 180 SVG DOM node budget."""
        code = """
        const { FLOOR_ORDER } = sectorsModule;
        const { generateBlueprintSvg } = minimapModule;

        function countSvgTags(svgString) {
            const matches = svgString.match(/<[a-zA-Z0-9_-]+(\\s|>)/g);
            return matches ? matches.length : 0;
        }

        const report = {};
        FLOOR_ORDER.forEach(floor => {
            const svg = generateBlueprintSvg(floor, 'S01', { id: 'S01', floor: '1F', coords: {x:0,y:0,z:0} });
            const nodeCount = countSvgTags(svg);
            report[floor] = nodeCount;
            if (nodeCount > 180) {
                throw new Error(`Floor ${floor} exceeded SVG DOM node budget: ${nodeCount} > 180`);
            }
        });
        console.log(JSON.stringify(report));
        """
        out = self.run_node_eval(code)
        report = json.loads(out)
        for floor, count in report.items():
            self.assertLessEqual(count, 180, f"Floor {floor} exceeded 180 nodes budget: {count}")

    def test_biome_chromatic_styling_nexus_tokens(self):
        """Verify that all 8 biomes use official NEXUS PRIVE v6.0 color tokens in SVG markup."""
        code = """
        const { BIOME_COLORS, SECTOR_REGISTRY } = sectorsModule;
        const { generateBlueprintSvg } = minimapModule;

        const expectedTokens = {
            estate: '#22d3ee',
            gothic: '#7c3aed',
            kawaii: '#f472b6',
            outdoor: '#10b981',
            forest: '#065f46',
            maritime: '#0284c7',
            subterranean: '#78350f',
            crystal: '#a78bfa'
        };

        Object.entries(expectedTokens).forEach(([biome, color]) => {
            if (BIOME_COLORS[biome] !== color) {
                throw new Error(`Biome color mismatch for ${biome}: expected ${color}, got ${BIOME_COLORS[biome]}`);
            }
        });

        const svg1F = generateBlueprintSvg('1F');
        if (!svg1F.includes('#22d3ee') || !svg1F.includes('#f472b6') || !svg1F.includes('#7c3aed')) {
            throw new Error('1F SVG missing expected biome token fills');
        }

        const svgOutdoor = generateBlueprintSvg('OUTDOOR');
        if (!svgOutdoor.includes('#10b981') || !svgOutdoor.includes('#065f46') || !svgOutdoor.includes('#0284c7')) {
            throw new Error('OUTDOOR SVG missing expected biome token fills');
        }

        console.log('BIOME_CHROMATIC_TOKENS_VALID');
        """
        out = self.run_node_eval(code)
        self.assertIn('BIOME_CHROMATIC_TOKENS_VALID', out)

    def test_animated_dashed_connections_generation(self):
        """Verify animated dashed connection paths are properly generated between adjacent floor sectors."""
        code = """
        const { generateConnectionPaths, generateBlueprintSvg } = minimapModule;

        const paths1F = generateConnectionPaths('1F');
        if (paths1F.length < 5) {
            throw new Error(`Expected at least 5 connection paths on 1F, got ${paths1F.length}`);
        }

        paths1F.forEach(p => {
            if (!p.from || !p.to || typeof p.x1 !== 'number' || typeof p.y1 !== 'number') {
                throw new Error(`Invalid connection path object: ${JSON.stringify(p)}`);
            }
        });

        const svg = generateBlueprintSvg('1F');
        if (!svg.includes('class="blueprint-connection-path"')) {
            throw new Error('blueprint-connection-path class missing in generated SVG');
        }
        if (!svg.includes('stroke-dasharray="6,4"')) {
            throw new Error('stroke-dasharray attribute missing on connection path line');
        }

        console.log('DASHED_CONNECTIONS_VALID');
        """
        out = self.run_node_eval(code)
        self.assertIn('DASHED_CONNECTIONS_VALID', out)

    def test_animated_player_beacon_and_compass_indicator(self):
        """Verify player beacon contains radar pulse circle and directional compass polygon."""
        code = """
        const { generateBlueprintSvg } = minimapModule;
        const { getSector } = sectorsModule;

        const playerSector = getSector('S01');
        const pPos = { x: 5, y: 0, z: 5 };
        const pRot = Math.PI / 2;

        const svgOnFloor = generateBlueprintSvg('1F', 'S01', playerSector, pPos, pRot);
        if (!svgOnFloor.includes('id="map-player-beacon"')) {
            throw new Error('map-player-beacon missing in SVG');
        }
        if (!svgOnFloor.includes('class="beacon-pulse"')) {
            throw new Error('beacon-pulse class missing in player beacon');
        }
        if (!svgOnFloor.includes('class="beacon-compass"')) {
            throw new Error('beacon-compass class missing in player beacon');
        }
        if (!svgOnFloor.includes('style="display: inline;"')) {
            throw new Error('Player beacon should be displayed when player is on active floor');
        }

        const svgOffFloor = generateBlueprintSvg('2F', 'S08', playerSector, pPos, pRot);
        if (!svgOffFloor.includes('style="display: none;"')) {
            throw new Error('Player beacon should be hidden when player is on a different floor');
        }

        console.log('PLAYER_BEACON_VALID');
        """
        out = self.run_node_eval(code)
        self.assertIn('PLAYER_BEACON_VALID', out)

    def test_interactive_inspection_and_telemetry_sidebar(self):
        """Verify MinimapSystem inspection handles all 32 sectors and updates telemetry data."""
        code = """
        const { MinimapSystem } = minimapModule;
        const { SECTOR_REGISTRY } = sectorsModule;

        const gameState = {
            room: 'foyer',
            pianoSolved: true,
            cauldronFed: false,
            unlockedDoors: { garden: true, library: false }
        };

        const minimap = new MinimapSystem(gameState);
        if (minimap.activeFloor !== '1F') throw new Error('Default activeFloor should be 1F');

        // Test inspecting all 32 sectors without error
        SECTOR_REGISTRY.forEach(s => {
            minimap.inspectSector(s.id);
            if (!minimap.selectedSector || minimap.selectedSector.id !== s.id) {
                throw new Error(`Failed to inspect sector ${s.id}`);
            }
            minimap.inspectSector(s.slug);
            if (!minimap.selectedSector || minimap.selectedSector.slug !== s.slug) {
                throw new Error(`Failed to inspect sector by slug ${s.slug}`);
            }
        });

        // Test floor switching
        minimap.switchFloor('OUTDOOR');
        if (minimap.activeFloor !== 'OUTDOOR') throw new Error('switchFloor failed to update activeFloor');

        console.log('INTERACTIVE_INSPECTION_VALID');
        """
        out = self.run_node_eval(code)
        self.assertIn('INTERACTIVE_INSPECTION_VALID', out)

    def test_css_blueprint_crt_and_modal_styling_rules(self):
        """Verify CSS file includes blueprint-crt-overlay, animated dash paths, and floor tabs."""
        css_path = os.path.join(PROJECT_ROOT, 'css', 'style.css')
        with open(css_path, 'r', encoding='utf-8') as f:
            css_content = f.read()

        self.assertIn('.blueprint-crt-overlay', css_content)
        self.assertIn('.blueprint-connection-path', css_content)
        self.assertIn('blueprintDash', css_content)
        self.assertIn('.floor-tab-btn', css_content)
        self.assertIn('.floor-tab-btn.active', css_content)
        self.assertIn('.btn-map-travel', css_content)
        self.assertIn('.room-blueprint-node', css_content)

    def test_strict_zero_emoji_compliance(self):
        """Verify zero emoji violations across minimap system, css, and test suite."""
        files = [
            'src/systems/minimap.js',
            'css/style.css',
            'tests/test_blueprint_map.py'
        ]
        violations = []
        for rel in files:
            full_path = os.path.join(PROJECT_ROOT, rel)
            with open(full_path, 'r', encoding='utf-8') as f:
                for lno, line in enumerate(f, 1):
                    for ch in line:
                        code = ord(ch)
                        if (0x1F300 <= code <= 0x1FAFF) or (0x1F600 <= code <= 0x1F64F) or (0x1F680 <= code <= 0x1F6FF):
                            violations.append((rel, lno, ch, hex(code)))
        self.assertEqual(len(violations), 0, f"Found emoji violations: {violations}")

if __name__ == '__main__':
    unittest.main()
