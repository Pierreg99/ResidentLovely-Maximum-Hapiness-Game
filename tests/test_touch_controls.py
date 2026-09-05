"""
Test Suite: Solid Touch Controls & v7.4 Graphics Caps
"""
import unittest
import os

TEST_DIR = os.path.dirname(os.path.abspath(__file__))
GAME_DIR = os.path.dirname(TEST_DIR)


class TestTouchControlsV74(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(os.path.join(GAME_DIR, "src", "engine", "input.js"), encoding="utf-8") as f:
            cls.input_js = f.read()
        with open(os.path.join(GAME_DIR, "index.html"), encoding="utf-8") as f:
            cls.index_html = f.read()
        with open(os.path.join(GAME_DIR, "css", "style.css"), encoding="utf-8") as f:
            cls.style_css = f.read()
        with open(os.path.join(GAME_DIR, "src", "world", "scene.js"), encoding="utf-8") as f:
            cls.scene_js = f.read()
        with open(os.path.join(GAME_DIR, "service-worker.js"), encoding="utf-8") as f:
            cls.sw = f.read()

    def test_floating_joystick_and_look_zone(self):
        self.assertIn("joystick-zone", self.index_html)
        self.assertIn("look-zone", self.index_html)
        self.assertIn("JOY_RADIUS", self.input_js)
        self.assertIn("Floating origin", self.input_js)
        self.assertIn("blockScroll", self.input_js)

    def test_action_buttons_touch_first(self):
        for bid in ("btn-fire", "btn-aim", "btn-interact", "btn-quick-turn", "btn-cycle-weapon"):
            self.assertIn(f'id="{bid}"', self.index_html)
        self.assertIn("bindAction", self.input_js)
        self.assertIn("touchstart", self.input_js)

    def test_large_hit_targets_and_safe_area(self):
        self.assertIn("safe-area-inset-bottom", self.style_css)
        self.assertIn("min-width: 56px", self.style_css)
        self.assertIn("pointer: coarse", self.style_css)
        self.assertIn("(hover: hover) and (pointer: fine)", self.style_css)

    def test_petal_cap_wired(self):
        self.assertIn("graphicsQuality.petalCap", self.scene_js)
        self.assertIn("prefers-reduced-motion", self.scene_js)
        self.assertIn("AdditiveBlending", self.scene_js)

    def test_sw_cache_v74(self):
        self.assertIn("resident-lovely-v7.4.0-cache", self.sw)


if __name__ == "__main__":
    unittest.main()
