"""
Test Suite: Resident Lovely v6.0.0 Advanced Modes, Endless Roguelike, AI Dialogue & Companion Squad
Standard: NEXUS PRIVE v6.0 | Strict Zero-Emoji Protocol | Native ESM
"""
import unittest
import os
import re

TEST_DIR = os.path.dirname(os.path.abspath(__file__))
GAME_DIR = os.path.dirname(TEST_DIR)
SRC_DIR = os.path.join(GAME_DIR, "src")
GAME_MODES_JS = os.path.join(SRC_DIR, "systems", "game_modes.js")
ENDLESS_JS = os.path.join(SRC_DIR, "systems", "endless_generator.js")
AI_DIALOGUE_JS = os.path.join(SRC_DIR, "systems", "ai_dialogue.js")
COMPANION_JS = os.path.join(SRC_DIR, "entities", "companion.js")
MAIN_JS = os.path.join(SRC_DIR, "main.js")


class TestV6AdvancedModes(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(GAME_MODES_JS, "r", encoding="utf-8") as f:
            cls.game_modes_js = f.read()
        with open(ENDLESS_JS, "r", encoding="utf-8") as f:
            cls.endless_js = f.read()
        with open(AI_DIALOGUE_JS, "r", encoding="utf-8") as f:
            cls.ai_dialogue_js = f.read()
        with open(COMPANION_JS, "r", encoding="utf-8") as f:
            cls.companion_js = f.read()
        with open(MAIN_JS, "r", encoding="utf-8") as f:
            cls.main_js = f.read()

    # 1. Game Modes & Speedrun Tests
    def test_game_modes_exported(self):
        self.assertIn("export const GameModes =", self.game_modes_js)
        self.assertIn("activeMode: 'CLASSIC'", self.game_modes_js)

    def test_speedrun_hud_and_pb_tracking(self):
        self.assertIn("createSpeedrunHUD", self.game_modes_js)
        self.assertIn("startSpeedrun", self.game_modes_js)
        self.assertIn("stopSpeedrun", self.game_modes_js)
        self.assertIn("recordSplit", self.game_modes_js)
        self.assertIn("rl_speedrun_best", self.game_modes_js)

    # 2. Endless Roguelike Generator Tests
    def test_endless_dimension_exported(self):
        self.assertIn("export const EndlessDimension =", self.endless_js)
        self.assertIn("enterPortal", self.endless_js)
        self.assertIn("generateNextFloor", self.endless_js)

    def test_endless_modifiers_and_rewards(self):
        self.assertIn("JOY_SURGE", self.endless_js)
        self.assertIn("SPARKLE_HASTE", self.endless_js)
        self.assertIn("BALLOON_BOUNTY", self.endless_js)
        self.assertIn("PRISMATIC_AURA", self.endless_js)
        self.assertIn("GRUMP_SWARM", self.endless_js)
        self.assertIn("completeFloor", self.endless_js)
        self.assertIn("getFloorSummary", self.endless_js)
        self.assertIn("exitPortal", self.endless_js)

    # 3. AI Dialogue Engine Tests
    def test_ai_dialogue_exported(self):
        self.assertIn("export const AIDialogue =", self.ai_dialogue_js)
        self.assertIn("generateResponse", self.ai_dialogue_js)
        self.assertIn("getProceduralFallback", self.ai_dialogue_js)

    def test_ai_dialogue_personalities(self):
        self.assertIn("Joy", self.ai_dialogue_js)
        self.assertIn("Gloom Bear", self.ai_dialogue_js)
        self.assertIn("Bun-Bun", self.ai_dialogue_js)
        self.assertIn("Master Chef", self.ai_dialogue_js)

    # 4. Companion Squad Tests
    def test_companion_squad_exported(self):
        self.assertIn("export class CompanionSquad", self.companion_js)
        self.assertIn("export const companionSquad", self.companion_js)
        self.assertIn("addCompanion", self.companion_js)
        self.assertIn("petCompanion", self.companion_js)
        self.assertIn("feedCupcake", self.companion_js)

    # 5. Main Coordinator Integration Tests
    def test_main_js_initializes_v6_subsystems(self):
        self.assertIn("GameModes.init()", self.main_js)
        self.assertIn("AIDialogue.init()", self.main_js)
        self.assertIn("EndlessDimension.init()", self.main_js)
        self.assertIn("AI_DIALOGUE_TRIGGER", self.main_js)


if __name__ == '__main__':
    unittest.main()
