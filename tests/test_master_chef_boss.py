"""
Test Suite: Master Chef Boss Encounter & Sugar Valve Harmony Puzzle (v1.8.0)
Standard: NEXUS PRIVE v6.0 | Strict Zero-Emoji Protocol | Native ESM
"""
import unittest
import os
import re

TEST_DIR = os.path.dirname(os.path.abspath(__file__))
GAME_DIR = os.path.dirname(TEST_DIR)
SRC_DIR = os.path.join(GAME_DIR, "src")
BOSS_JS = os.path.join(SRC_DIR, "entities", "boss.js")
ROOMS_JS = os.path.join(SRC_DIR, "world", "rooms.js")
MAIN_JS = os.path.join(SRC_DIR, "main.js")
AUDIO_JS = os.path.join(SRC_DIR, "engine", "audio.js")


class TestMasterChefBossEncounter(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(BOSS_JS, "r", encoding="utf-8") as f:
            cls.boss_js = f.read()
        with open(ROOMS_JS, "r", encoding="utf-8") as f:
            cls.rooms_js = f.read()
        with open(MAIN_JS, "r", encoding="utf-8") as f:
            cls.main_js = f.read()
        with open(AUDIO_JS, "r", encoding="utf-8") as f:
            cls.audio_js = f.read()

    def test_master_chef_boss_class_exists(self):
        self.assertIn("class MasterChefBoss", self.boss_js)
        self.assertIn("THE GRUMPY MASTER CHEF", self.boss_js)
        self.assertIn("this.roomName = 'bakery'", self.boss_js)
        self.assertIn("this.sectorId = 'S07'", self.boss_js)

    def test_boss_3_phase_state_machine(self):
        self.assertIn("this.anger = 100", self.boss_js)
        self.assertIn("this.phase = 1", self.boss_js)
        self.assertIn("this.transitionPhase", self.boss_js)
        self.assertIn("performRollingPinSlam", self.boss_js)
        self.assertIn("calmChef", self.boss_js)

    def test_gloom_behemoth_compat(self):
        self.assertIn("class GloomBehemothBoss", self.boss_js)
        self.assertIn("export let bossInstance", self.boss_js)
        self.assertIn("export let masterChefBoss", self.boss_js)

    def test_bakery_chamber_expanded_props(self):
        self.assertIn("sugar_valve_cyan", self.rooms_js)
        self.assertIn("sugar_valve_gold", self.rooms_js)
        self.assertIn("sugar_valve_emerald", self.rooms_js)
        self.assertIn("royal_oven", self.rooms_js)

    def test_sugar_valve_harmonic_puzzle_logic(self):
        self.assertIn("cyan-gold-emerald", self.main_js)
        self.assertIn("checkSugarValvePuzzle", self.main_js)
        self.assertIn("sugarValvesEqualized", self.main_js)

    def test_web_audio_boss_synthesizer_methods(self):
        self.assertIn("playRollingPinSlam()", self.audio_js)
        self.assertIn("playValveTurnChime", self.audio_js)
        self.assertIn("playTartSuccessJingle()", self.audio_js)

    def test_zero_emoji_in_boss_modules(self):
        for path in [BOSS_JS, AUDIO_JS, MAIN_JS, ROOMS_JS]:
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            for lno, line in enumerate(content.splitlines(), 1):
                for ch in line:
                    cp = ord(ch)
                    is_emoji = (0x1F300 <= cp <= 0x1FAFF) or (0x1F600 <= cp <= 0x1F64F) or (0x1F680 <= cp <= 0x1F6FF)
                    self.assertFalse(is_emoji, f"Emoji violation in {os.path.basename(path)} at line {lno}: {ch} (0x{cp:x})")


if __name__ == "__main__":
    unittest.main()
