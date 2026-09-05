import type { QuestDef } from "../types";

export const QUEST_DEFS: QuestDef[] = [
  {
    id: "q_piano",
    name: "The Foyer Sonatina",
    desc: "Play the triad C-E-G on the grand piano to open the silver drawer.",
    map: "foyer",
    unlocks: ["library"],
    tasks: [
      { id: "t_inspect", text: "Inspect the grand piano", done: false },
      { id: "t_play", text: "Play C, E, then G", done: false },
      { id: "t_key", text: "Collect the Silver Foyer Key", done: false },
    ],
  },
  {
    id: "q_cauldron",
    name: "Alchemical Bliss Brew",
    desc: "Craft a Mega Bliss Cupcake and offer it to the library cauldron.",
    map: "library",
    tasks: [
      { id: "t_enter_lib", text: "Enter the Library of Harmony", done: false },
      { id: "t_craft", text: "Combine Sparkle Herb with Sweet Powder", done: false },
      { id: "t_offer", text: "Place the cupcake in the golden cauldron", done: false },
    ],
  },
  {
    id: "q_tea",
    name: "Moonpetal Ceremony",
    desc: "Light the three tea candles and share Moonpetal Tea with Miss Chamomile.",
    map: "tea_salon",
    unlocks: ["music_parlor"],
    tasks: [
      { id: "t_candles", text: "Light 3 tea candles", done: false, count: 0, max: 3 },
      { id: "t_blend", text: "Collect Moonpetal Tea", done: false },
      { id: "t_serve", text: "Serve tea to Miss Chamomile", done: false },
    ],
  },
  {
    id: "q_lanterns",
    name: "Solarium Heart Lanterns",
    desc: "Unlock the garden and ignite the four heart lanterns around the fountain.",
    map: "garden",
    unlocks: ["village", "conservatory"],
    tasks: [
      { id: "t_master", text: "Craft the Master Garden Key", done: false },
      { id: "t_enter_g", text: "Enter the Solarium Garden", done: false },
      { id: "t_lights", text: "Ignite 4 heart lanterns", done: false, count: 0, max: 4 },
    ],
  },
  {
    id: "q_bakery",
    name: "Confectionery Grand Prix",
    desc: "Bake a Rainbow Macaron and inspect Madame Macaron's royal oven.",
    map: "bakery",
    tasks: [
      { id: "t_talk_m", text: "Speak with Madame Macaron", done: false },
      { id: "t_macaron", text: "Craft a Rainbow Macaron", done: false },
      { id: "t_oven", text: "Inspect the royal oven", done: false },
    ],
  },
  {
    id: "q_astro",
    name: "Celestial Astrolabe",
    desc: "Seat the Star Sapphire in the observatory astrolabe.",
    map: "observatory",
    unlocks: ["clock_belfry", "mirror_maze", "terrace"],
    tasks: [
      { id: "t_gem", text: "Retrieve the Star Sapphire", done: false },
      { id: "t_align", text: "Align the golden astrolabe", done: false },
    ],
  },
  {
    id: "q_clock",
    name: "Clockwork Heart",
    desc: "Wind the three belfry gears until the bronze bell sings.",
    map: "clock_belfry",
    unlocks: ["moonlit_meadow"],
    tasks: [
      { id: "t_gears", text: "Wind 3 clockwork gears", done: false, count: 0, max: 3 },
      { id: "t_crest", text: "Collect the Golden Sun Crest", done: false },
    ],
  },
  {
    id: "q_crystal",
    name: "Crystal Choir",
    desc: "Attune three singing crystals with Sister Prism.",
    map: "crystal_grotto",
    unlocks: ["ice_chamber"],
    tasks: [
      { id: "t_prism", text: "Speak with Sister Prism", done: false },
      { id: "t_crystals", text: "Attune 3 crystals", done: false, count: 0, max: 3 },
    ],
  },
  {
    id: "q_harbor",
    name: "Harbor Lullaby",
    desc: "Return Captain Puff's lens and uplift the dock Grumps.",
    map: "harbor_docks",
    unlocks: ["lighthouse"],
    tasks: [
      { id: "t_captain", text: "Speak with Captain Puff", done: false },
      { id: "t_lens", text: "Return the Harbor Lens", done: false },
      { id: "t_docks", text: "Uplift 4 dock Grumps", done: false, count: 0, max: 4 },
    ],
  },
  {
    id: "q_mirror",
    name: "Mirror of Kindness",
    desc: "Find the true pane among the maze reflections.",
    map: "mirror_maze",
    tasks: [
      { id: "t_maze", text: "Enter the Mirror Maze", done: false },
      { id: "t_true", text: "Choose the true kindness mirror", done: false },
    ],
  },
  {
    id: "q_village",
    name: "Village Joy Parade",
    desc: "Recruit three companions into the Joy Squad.",
    map: "village",
    unlocks: ["harbor_docks"],
    tasks: [
      { id: "t_recruit", text: "Recruit 3 companions", done: false, count: 0, max: 3 },
    ],
  },
  {
    id: "q_forest",
    name: "Forest Blessing",
    desc: "Lay the grove offering on the shrine in the sacred trail.",
    map: "sacred_forest",
    tasks: [
      { id: "t_offering", text: "Collect the Grove Offering", done: false },
      { id: "t_shrine", text: "Place the offering on the shrine", done: false },
    ],
  },
  {
    id: "q_dynamo",
    name: "Subterranean Sugar Dynamo",
    desc: "Forge a Joy Dynamo Core and wake the lab generator.",
    map: "sugar_lab",
    unlocks: ["crystal_grotto", "crypt"],
    tasks: [
      { id: "t_core", text: "Craft the Joy Dynamo Core", done: false },
      { id: "t_gen", text: "Activate the master generator", done: false },
    ],
  },
  {
    id: "q_moon",
    name: "Moonlit Melody",
    desc: "Play the meadow chimes after the music parlor harpsichord.",
    map: "moonlit_meadow",
    unlocks: ["sacred_forest"],
    tasks: [
      { id: "t_harp", text: "Examine the music parlor harpsichord", done: false },
      { id: "t_chimes", text: "Ring the meadow chimes", done: false },
    ],
  },
  {
    id: "q_boss",
    name: "Grand Gloom Behemoth",
    desc: "Descend into the Whispering Crypt and uplift the Behemoth.",
    map: "crypt",
    tasks: [
      { id: "t_descend", text: "Enter the Whispering Crypt", done: false },
      { id: "t_boss", text: "Uplift the Gloom Behemoth", done: false },
    ],
  },
  {
    id: "q_light",
    name: "Lighthouse Vigil",
    desc: "Seat the Harbor Lens in the lighthouse lamp so the docks can see home.",
    map: "lighthouse",
    tasks: [
      { id: "t_enter_lh", text: "Climb the lighthouse", done: false },
      { id: "t_lamp", text: "Seat the lens in the lamp", done: false },
    ],
  },
  {
    id: "q_ice",
    name: "Thaw the Frozen Heart",
    desc: "Warm the ice chamber with a Mega Bliss Cupcake.",
    map: "ice_chamber",
    tasks: [
      { id: "t_enter_ice", text: "Enter the Ice Chamber", done: false },
      { id: "t_thaw", text: "Offer a cupcake to the frozen heart", done: false },
    ],
  },
  {
    id: "q_cons",
    name: "Glass Rose Arbor",
    desc: "Tend the haunted conservatory until the glass rose blooms.",
    map: "conservatory",
    tasks: [
      { id: "t_enter_cons", text: "Enter the Conservatory", done: false },
      { id: "t_rose", text: "Awaken the glass rose", done: false },
    ],
  },
  {
    id: "q_terrace",
    name: "Terrace Windbells",
    desc: "Ring the grand terrace bells at dusk.",
    map: "terrace",
    tasks: [
      { id: "t_enter_ter", text: "Step onto the Grand Terrace", done: false },
      { id: "t_bells", text: "Ring the terrace windbells", done: false },
    ],
  },
  {
    id: "q_max",
    name: "Maximum Happiness",
    desc: "Restore joy across every wing of the Chateau de la Joie.",
    map: "foyer",
    tasks: [
      { id: "t_all", text: "Complete every other quest", done: false },
    ],
  },
];
