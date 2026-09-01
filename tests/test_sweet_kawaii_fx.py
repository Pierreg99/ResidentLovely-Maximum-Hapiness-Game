"""
Test Suite: Resident Lovely Sweet Kawaii Visuals, Confectionery Props & Audio Chimes
Standard: NEXUS PRIVE v6.0 | Strict Zero-Emoji Protocol | Native ESM
"""
import unittest
import os

TEST_DIR = os.path.dirname(os.path.abspath(__file__))
GAME_DIR = os.path.dirname(TEST_DIR)
SRC_DIR = os.path.join(GAME_DIR, "src")
SCENE_JS = os.path.join(SRC_DIR, "world", "scene.js")
ROOMS_JS = os.path.join(SRC_DIR, "world", "rooms.js")
AUDIO_JS = os.path.join(SRC_DIR, "engine", "audio.js")
GRUMP_JS = os.path.join(SRC_DIR, "entities", "grump.js")
COMPANION_JS = os.path.join(SRC_DIR, "entities", "companion.js")
PLAYER_JS = os.path.join(SRC_DIR, "entities", "player.js")
INVENTORY_JS = os.path.join(SRC_DIR, "systems", "inventory.js")
MAIN_JS = os.path.join(SRC_DIR, "main.js")


class TestSweetKawaiiOverhaul(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(SCENE_JS, "r", encoding="utf-8") as f:
            cls.scene_js = f.read()
        with open(ROOMS_JS, "r", encoding="utf-8") as f:
            cls.rooms_js = f.read()
        with open(AUDIO_JS, "r", encoding="utf-8") as f:
            cls.audio_js = f.read()
        with open(GRUMP_JS, "r", encoding="utf-8") as f:
            cls.grump_js = f.read()
        with open(COMPANION_JS, "r", encoding="utf-8") as f:
            cls.companion_js = f.read()
        with open(PLAYER_JS, "r", encoding="utf-8") as f:
            cls.player_js = f.read()
        with open(INVENTORY_JS, "r", encoding="utf-8") as f:
            cls.inventory_js = f.read()
        with open(MAIN_JS, "r", encoding="utf-8") as f:
            cls.main_js = f.read()

    # 1. Heart Bubbles & Sparkle Particle Emitters
    def test_heart_bubbles_emitter_exported(self):
        self.assertIn("export function spawnHeartBubbles", self.scene_js)
        self.assertIn("export function updateHeartBubbles", self.scene_js)
        self.assertIn("export const heartBubbles =", self.scene_js)

    def test_sparkle_footsteps_emitter_exported(self):
        self.assertIn("export function spawnSparkleFootstep", self.scene_js)
        self.assertIn("export function updateSparkleFootsteps", self.scene_js)
        self.assertIn("export const sparkleFootsteps =", self.scene_js)

    # 2. Audio Synthesis Kawaii Chimes
    def test_audio_kawaii_chimes_exist(self):
        self.assertIn("playKawaiiSparkleChime", self.audio_js)
        self.assertIn("playHeartPop", self.audio_js)

    # 3. Grump & Companion Tactile Joy Bursts
    def test_grump_heart_bubbles_on_uplift(self):
        self.assertIn("spawnHeartBubbles", self.grump_js)
        self.assertIn("playKawaiiSparkleChime", self.grump_js)

    def test_companion_heart_bubbles_on_pet_and_feed(self):
        self.assertIn("spawnHeartBubbles", self.companion_js)
        self.assertIn("playHeartPop", self.companion_js)
        self.assertIn("playKawaiiSparkleChime", self.companion_js)

    # 4. Player Sparkle Trail
    def test_player_emits_sparkle_trail_on_move(self):
        self.assertIn("spawnSparkleFootstep", self.player_js)

    # 5. Confectionery 3D Props in Bakery
    def test_bakery_3d_sweet_macarons_and_lollipops(self):
        self.assertIn("macaronColors", self.rooms_js)
        self.assertIn("Giant Swirling Candy Lollipops", self.rooms_js)

    # 6. Main Loop Integration
    def test_main_animation_loop_updates_kawaii_particles(self):
        self.assertIn("updateHeartBubbles", self.main_js)
        self.assertIn("updateSparkleFootsteps", self.main_js)

    # 7. Sweet Items & Confectionery Alchemy
    def test_sweet_items_and_recipes(self):
        self.assertIn("macaron_rainbow", self.inventory_js)
        self.assertIn("cotton_candy", self.inventory_js)
        self.assertIn("RAINBOW STARLIGHT MACARON", self.inventory_js)
        self.assertIn("SPARKLE COTTON CANDY", self.inventory_js)

    # 8. Sweet Kawaii Quests (Quest 11 & 12)
    def test_sweet_kawaii_quests_registered(self):
        with open(os.path.join(SRC_DIR, "systems", "quests.js"), "r", encoding="utf-8") as f:
            quests_js = f.read()
        self.assertIn("QUEST 11: SWEET CONFECTIONERY GRAND PRIX", quests_js)
        self.assertIn("QUEST 12: THE GREAT JOY SQUAD PARADE", quests_js)


if __name__ == '__main__':
    unittest.main()
