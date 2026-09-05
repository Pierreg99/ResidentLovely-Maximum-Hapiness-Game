import type { ItemDef, ItemId, WeaponDef } from "../types";

export const ITEMS: Record<ItemId, ItemDef> = {
  herb_green: {
    id: "herb_green",
    name: "Sparkle Herb",
    desc: "Peppermint leaves that restore 35 joy.",
    type: "consumable",
    restore: 35,
  },
  herb_double: {
    id: "herb_double",
    name: "Double Sparkle Herb",
    desc: "Blended mint. Restores 70 joy.",
    type: "consumable",
    restore: 70,
  },
  elixir_ultra: {
    id: "elixir_ultra",
    name: "Ultra Joy Elixir",
    desc: "Triple concentrate. Full joy restore.",
    type: "consumable",
    restore: 100,
  },
  powder_red: {
    id: "powder_red",
    name: "Sweet Powder",
    desc: "Strawberry sugar. Combine with herb for a cupcake.",
    type: "material",
  },
  bliss_cupcake: {
    id: "bliss_cupcake",
    name: "Mega Bliss Cupcake",
    desc: "Offer to the cauldron, or eat for full joy.",
    type: "consumable",
    restore: 100,
  },
  key_foyer: {
    id: "key_foyer",
    name: "Silver Foyer Key",
    desc: "Opens the East Wing Library.",
    type: "key",
  },
  ribbon_gold: {
    id: "ribbon_gold",
    name: "Golden Ribbon",
    desc: "Combine with the foyer key to craft the master key.",
    type: "material",
  },
  key_master: {
    id: "key_master",
    name: "Master Garden Key",
    desc: "Unlocks the West Wing Solarium.",
    type: "key",
  },
  gem_star: {
    id: "gem_star",
    name: "Star Sapphire",
    desc: "Fits the observatory astrolabe.",
    type: "quest_item",
  },
  crest_royal: {
    id: "crest_royal",
    name: "Golden Sun Crest",
    desc: "Salvaged from the belfry pendulum.",
    type: "quest_item",
  },
  sugar_crystal: {
    id: "sugar_crystal",
    name: "Prismatic Sugar",
    desc: "Grown in the greenhouse beds.",
    type: "material",
  },
  dynamo_core: {
    id: "dynamo_core",
    name: "Joy Dynamo Core",
    desc: "Sun crest plus prismatic sugar. Powers the lab.",
    type: "quest_item",
  },
  macaron_rainbow: {
    id: "macaron_rainbow",
    name: "Rainbow Macaron",
    desc: "Stardust cream. Full joy plus a brief dash.",
    type: "consumable",
    restore: 100,
  },
  cotton_candy: {
    id: "cotton_candy",
    name: "Sparkle Cotton Candy",
    desc: "Spun sugar ward against gloom.",
    type: "consumable",
    restore: 40,
  },
  diary: {
    id: "diary",
    name: "Chateau Diary Page",
    desc: "A handwritten note from a previous S.M.I.L.E. agent.",
    type: "lore",
  },
  tea_blend: {
    id: "tea_blend",
    name: "Moonpetal Tea",
    desc: "Miss Chamomile's evening blend.",
    type: "quest_item",
  },
  lighthouse_lens: {
    id: "lighthouse_lens",
    name: "Harbor Lens",
    desc: "Captain Puff's missing lantern glass.",
    type: "quest_item",
  },
  mirror_shard: {
    id: "mirror_shard",
    name: "Kindness Shard",
    desc: "The one true pane from the maze.",
    type: "quest_item",
  },
  forest_offering: {
    id: "forest_offering",
    name: "Grove Offering",
    desc: "Petals, honey, and a ribbon for the shrine.",
    type: "quest_item",
  },
  stardust_core: {
    id: "stardust_core",
    name: "Stardust Prism Core",
    desc: "Star sapphire fused with prismatic sugar.",
    type: "material",
  },
  wand_astral: {
    id: "wand_astral",
    name: "Astral Supernova Wand",
    desc: "Forged from ribbon and stardust. The fifth weapon.",
    type: "weapon",
  },
};

export const RECIPES: { a: ItemId; b: ItemId; out: ItemId }[] = [
  { a: "herb_green", b: "herb_green", out: "herb_double" },
  { a: "herb_double", b: "herb_green", out: "elixir_ultra" },
  { a: "herb_green", b: "powder_red", out: "bliss_cupcake" },
  { a: "key_foyer", b: "ribbon_gold", out: "key_master" },
  { a: "crest_royal", b: "sugar_crystal", out: "dynamo_core" },
  { a: "bliss_cupcake", b: "sugar_crystal", out: "macaron_rainbow" },
  { a: "herb_double", b: "sugar_crystal", out: "macaron_rainbow" },
  { a: "powder_red", b: "ribbon_gold", out: "cotton_candy" },
  { a: "gem_star", b: "sugar_crystal", out: "stardust_core" },
  { a: "ribbon_gold", b: "stardust_core", out: "wand_astral" },
];

export const WEAPONS: Record<string, WeaponDef> = {
  pistol: {
    id: "pistol",
    name: "Mk-IV Confetti",
    cooldown: 0.22,
    damage: 18,
    spread: 0.02,
    pellets: 1,
    speed: 38,
    arcing: false,
    beam: false,
  },
  shotgun: {
    id: "shotgun",
    name: "Pastry Scatter",
    cooldown: 0.7,
    damage: 10,
    spread: 0.18,
    pellets: 5,
    speed: 22,
    arcing: false,
    beam: false,
  },
  mortar: {
    id: "mortar",
    name: "Sugar Mortar",
    cooldown: 1.1,
    damage: 42,
    spread: 0.04,
    pellets: 1,
    speed: 16,
    arcing: true,
    beam: false,
  },
  beam: {
    id: "beam",
    name: "Prismatic Beam",
    cooldown: 0.05,
    damage: 8,
    spread: 0,
    pellets: 1,
    speed: 80,
    arcing: false,
    beam: true,
  },
  wand: {
    id: "wand",
    name: "Astral Wand",
    cooldown: 0.9,
    damage: 55,
    spread: 0.06,
    pellets: 3,
    speed: 28,
    arcing: false,
    beam: false,
  },
};

export function matchRecipe(a: ItemId, b: ItemId): ItemId | null {
  for (const r of RECIPES) {
    if ((r.a === a && r.b === b) || (r.a === b && r.b === a)) return r.out;
  }
  return null;
}
