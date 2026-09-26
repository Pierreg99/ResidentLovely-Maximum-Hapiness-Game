"""CHATRY graphics-upgrade contract tests.

These are intentionally static tests: the graphics module requires a browser/WebGL context.
"""

from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
MODULE = ROOT / "src" / "world" / "graphics_upgrade.js"
INDEX = ROOT / "index.html"


class TestChatryGraphicsUpgrade(unittest.TestCase):
    def test_graphics_module_exists_and_has_adaptive_caps(self):
        text = MODULE.read_text(encoding="utf-8")
        self.assertIn("QUALITY_CAPS", text)
        self.assertIn("REDUCED_MOTION", text)
        self.assertIn("THREE.AdditiveBlending", text)
        self.assertIn("requestAnimationFrame", text)
        self.assertNotIn("gameState", text)

    def test_graphics_module_has_all_quality_profiles(self):
        text = MODULE.read_text(encoding="utf-8")
        for preset in ("low", "med", "high"):
            self.assertIn(preset + ":", text)

    def test_entrypoint_loads_graphics_upgrade_after_main(self):
        text = INDEX.read_text(encoding="utf-8")
        main = text.index("./src/main.js")
        upgrade = text.index("./src/world/graphics_upgrade.js")
        self.assertLess(main, upgrade)


if __name__ == "__main__":
    unittest.main()
