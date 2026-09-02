"""
Test Suite: Resident Lovely v7.0.0 - Spring-Bone Articulated Rig, Astral Spire & Alchemy Expansion
Standards: NEXUS PRIVE v6.0 | Strict Zero-Emoji Protocol | Native ESM
"""
import unittest
import os
import re

TEST_DIR = os.path.dirname(os.path.abspath(__file__))
GAME_DIR = os.path.dirname(TEST_DIR)
SRC_DIR = os.path.join(GAME_DIR, "src")
SECTORS_JS = os.path.join(SRC_DIR, "world", "sectors.js")
ROOMS_JS = os.path.join(SRC_DIR, "world", "rooms.js")
PLAYER_JS = os.path.join(SRC_DIR, "entities", "player.js")
CAMERA_JS = os.path.join(SRC_DIR, "engine", "camera.js")
ARSENAL_JS = os.path.join(SRC_DIR, "weapons", "arsenal.js")
INVENTORY_JS = os.path.join(SRC_DIR, "systems", "inventory.js")
SHADERS_JS = os.path.join(SRC_DIR, "world", "shaders", "surface-shaders.js")
MINIMAP_JS = os.path.join(SRC_DIR, "systems", "minimap.js")
BACKDROPS_JS = os.path.join(SRC_DIR, "world", "backdrops.js")


class TestResidentLovelyV7Overhaul(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(SECTORS_JS, "r", encoding="utf-8") as f:
            cls.sectors_js = f.read()
        with open(ROOMS_JS, "r", encoding="utf-8") as f:
            cls.rooms_js = f.read()
        with open(PLAYER_JS, "r", encoding="utf-8") as f:
            cls.player_js = f.read()
        with open(CAMERA_JS, "r", encoding="utf-8") as f:
            cls.camera_js = f.read()
        with open(ARSENAL_JS, "r", encoding="utf-8") as f:
            cls.arsenal_js = f.read()
        with open(INVENTORY_JS, "r", encoding="utf-8") as f:
            cls.inventory_js = f.read()
        with open(SHADERS_JS, "r", encoding="utf-8") as f:
            cls.shaders_js = f.read()
        with open(MINIMAP_JS, "r", encoding="utf-8") as f:
            cls.minimap_js = f.read()
        with open(BACKDROPS_JS, "r", encoding="utf-8") as f:
            cls.backdrops_js = f.read()

    # 1. 40 Sectors & 9 Floor Tiers
    def test_sector_expansion_40_sectors(self):
        for sid in ["S33", "S34", "S35", "S36", "S37", "S38", "S39", "S40"]:
            self.assertIn(sid, self.sectors_js)

    def test_floor_order_includes_5f_and_b3(self):
        self.assertIn("'5F'", self.sectors_js)
        self.assertIn("'B3'", self.sectors_js)
        self.assertIn("'5F':", self.minimap_js)
        self.assertIn("'B3':", self.minimap_js)

    def test_minimap_layouts_for_5f_and_b3(self):
        self.assertIn("S33:", self.minimap_js)
        self.assertIn("S36:", self.minimap_js)
        self.assertIn("S37:", self.minimap_js)
        self.assertIn("S40:", self.minimap_js)

    # 2. Next-Gen Procedural PBR Shaders
    def test_four_new_pbr_shaders_defined(self):
        self.assertIn("iridescent_opal_velvet", self.shaders_js)
        self.assertIn("celestial_aurora", self.shaders_js)
        self.assertIn("prismatic_water_caustics", self.shaders_js)
        self.assertIn("crystalline_subsurface", self.shaders_js)

    def test_new_shader_glsl_vertex_and_fragment_sources(self):
        self.assertIn("iridescentOpalVelvetVertexShader", self.shaders_js)
        self.assertIn("iridescentOpalVelvetFragmentShader", self.shaders_js)
        self.assertIn("celestialAuroraVertexShader", self.shaders_js)
        self.assertIn("celestialAuroraFragmentShader", self.shaders_js)
        self.assertIn("prismaticWaterCausticsVertexShader", self.shaders_js)
        self.assertIn("prismaticWaterCausticsFragmentShader", self.shaders_js)
        self.assertIn("crystallineSubsurfaceVertexShader", self.shaders_js)
        self.assertIn("crystallineSubsurfaceFragmentShader", self.shaders_js)

    # 3. Procedural 3D Chamber Geometry for S33-S40
    def test_all_8_new_rooms_instantiated(self):
        rooms_to_check = [
            "astral_spire_peak",
            "starlight_sanctuary",
            "celestial_chamber",
            "moonbeam_zenith",
            "abyssal_trench_gateway",
            "coral_trench",
            "deep_alchemical_vault",
            "ancient_core_crucible"
        ]
        for room_slug in rooms_to_check:
            self.assertIn(room_slug, self.rooms_js)
            method_name = f"build{room_slug.replace('_', ' ').title().replace(' ', '')}"
            self.assertIn(method_name, self.rooms_js)

    # 4. Spring-Bone Articulated Chibi Rig
    def test_player_spring_bones_state(self):
        self.assertIn("springBones:", self.player_js)
        self.assertIn("leftPigtail:", self.player_js)
        self.assertIn("rightPigtail:", self.player_js)
        self.assertIn("ribbonBows:", self.player_js)
        self.assertIn("stiffness:", self.player_js)
        self.assertIn("damping:", self.player_js)

    def test_player_spring_bone_physics_solver(self):
        self.assertIn("Spring-bone analytical verlet/euler physics solver", self.player_js)
        self.assertIn("player.leftPigtail.rotation.x = sb.leftPigtail.angleX", self.player_js)
        self.assertIn("player.rightPigtail.rotation.x = sb.rightPigtail.angleX", self.player_js)

    def test_player_kawaii_emotes(self):
        self.assertIn("emotes:", self.player_js)
        self.assertIn("Expressive Kawaii Emote Indicator", self.player_js)

    # 5. Smart Director Camera v3
    def test_smart_camera_feeler_pullback(self):
        self.assertIn("Camera Wall Collision Clamping with Feeler Soft-Pullback", self.camera_js)
        self.assertIn("triggerDramaticFraming", self.camera_js)
        self.assertIn("dramaticTimer", self.camera_js)

    # 6. Astral Supernova Wand & Kinetics
    def test_astral_supernova_wand_arsenal(self):
        self.assertIn("supernova_wand", self.arsenal_js)
        self.assertIn("blastRadius = 6.0", self.arsenal_js)

    # 7. Confectionery Alchemy Recipes (9 - 12)
    def test_confectionery_alchemy_expansion_items(self):
        self.assertIn("stardust_prism_core", self.inventory_js)
        self.assertIn("astral_supernova_wand", self.inventory_js)
        self.assertIn("celestial_elixir", self.inventory_js)
        self.assertIn("aurora_sugar_cake", self.inventory_js)

    def test_confectionery_alchemy_recipes_in_execute_combine(self):
        self.assertIn("ids === 'gem_star+sugar_crystal'", self.inventory_js)
        self.assertIn("ids === 'ribbon_gold+stardust_prism_core'", self.inventory_js)
        self.assertIn("ids === 'elixir_ultra+sugar_crystal'", self.inventory_js)
        self.assertIn("ids === 'bliss_cupcake+gem_star'", self.inventory_js)

    # 8. Zero Emoji Compliance Protocol
    def test_zero_emoji_protocol_compliance(self):
        files_to_scan = [
            SECTORS_JS,
            ROOMS_JS,
            PLAYER_JS,
            CAMERA_JS,
            ARSENAL_JS,
            INVENTORY_JS,
            SHADERS_JS,
            MINIMAP_JS,
            BACKDROPS_JS
        ]
        violations = []
        for fpath in files_to_scan:
            with open(fpath, "r", encoding="utf-8") as f:
                for idx, line in enumerate(f, 1):
                    for ch in line:
                        code = ord(ch)
                        if 0x1F300 <= code <= 0x1FAFF or 0x1F600 <= code <= 0x1F64F or 0x1F680 <= code <= 0x1F6FF:
                            violations.append((os.path.basename(fpath), idx, ch, hex(code)))
        self.assertEqual(len(violations), 0, f"Found forbidden emoji violations: {violations}")


if __name__ == '__main__':
    unittest.main()
