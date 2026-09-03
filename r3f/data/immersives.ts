import type { ExaminePayload, NpcId } from "../types";

export const NPC_META: Record<
  NpcId,
  { name: string; portrait: string; lines: string[] }
> = {
  "madame-macaron": {
    name: "Madame Macaron",
    portrait: "/portraits/madame-macaron.jpg",
    lines: [
      "The oven is hungry for a Rainbow Macaron, Agent. Herb plus prismatic sugar, or a cupcake plus sugar.",
      "When the glaze sings, inspect the oven. Then the whole kitchen will blush with joy.",
    ],
  },
  "captain-puff": {
    name: "Captain Puff",
    portrait: "/portraits/captain-puff.jpg",
    lines: [
      "The harbor lantern is blind without its lens. I dropped it near the far crate.",
      "Bring it back, then climb the lighthouse. The lamp wants that glass more than I do.",
    ],
  },
  "sister-prism": {
    name: "Sister Prism",
    portrait: "/portraits/sister-prism.jpg",
    lines: [
      "Three crystals sleep in this grotto. Touch them in any order. They will find the chord themselves.",
      "When they sing together, the ice vault will unlatch. Warm it with a cupcake, not a fight.",
    ],
  },
  "miss-chamomile": {
    name: "Miss Chamomile",
    portrait: "/portraits/miss-chamomile.jpg",
    lines: [
      "Light the three tea candles first. Then we can share Moonpetal Tea.",
      "A warm cup is a small uprising against gloom.",
    ],
  },
  "maestro-clef": {
    name: "Maestro Clef",
    portrait: "/portraits/maestro-clef.jpg",
    lines: [
      "The harpsichord remembers the meadow. Play it, then ring the chimes under the moon.",
      "Music is a door. Walk through it kindly.",
    ],
  },
  "keeper-lumen": {
    name: "Keeper Lumen",
    portrait: "/portraits/keeper-lumen.jpg",
    lines: [
      "Uplift the village Grumps and they will follow you. Three companions make a parade.",
      "The harbor road opens when the square is laughing again.",
    ],
  },
};

export const EXAMINE: Record<string, ExaminePayload> = {
  foyer_note: {
    title: "Welcome plaque",
    body: "Chateau de la Joie. If gloom gathers, play C then E then G. Harmony unlocks the east wing.",
  },
  save_gram: {
    title: "Save gramophone",
    body: "A warm needle rests on a blank disc. Progress is written whenever you pause, or when a quest turns.",
  },
  lib_tome: {
    title: "Scroll of Joy Harmony",
    body: "Green herb plus red powder makes a Mega Bliss Cupcake. The cauldron accepts nothing less.",
  },
  garden_note: {
    title: "Fountain inscription",
    body: "Four hearts, four lanterns. Light them and the village path will remember your name.",
  },
  oven: {
    title: "Royal oven",
    body: "The copper door is warm. A Rainbow Macaron would finish the glaze.",
  },
  obs_note: {
    title: "Star chart",
    body: "Seat the sapphire in the astrolabe. The belfry bridge, the mirror gallery, and the terrace will answer.",
  },
  meadow_note: {
    title: "Moonlit stone",
    body: "Ring the chimes after the parlor song. The forest trail opens under that note.",
  },
  dock_note: {
    title: "Shipping ledger",
    body: "Lens missing. Grumps restless. Captain Puff waiting by the bollard. The lighthouse path waits for kindness.",
  },
  maze_note: {
    title: "Etched caption",
    body: "Two mirrors lie. One tells the truth kindly. Choose the pane that shows you smiling.",
  },
  music_note: {
    title: "Sheet music",
    body: "A meadow motif in 6/8. The harpsichord is already tuned.",
  },
  stall: {
    title: "Macaron stall",
    body: "Village pastries, still warm. The keeper says a parade needs three friends.",
  },
  forest_note: {
    title: "Carved oak",
    body: "Lay the grove offering on the shrine. The trees will keep the gloom out.",
  },
  lab_note: {
    title: "Alchemy slate",
    body: "Sun crest plus prismatic sugar. Seat the core in the dynamo. The crypt will unlatch.",
  },
  crypt_note: {
    title: "Crypt epitaph",
    body: "Here sleeps the Grand Gloom Behemoth. Do not fight it. Uplift it.",
  },
  m_false_1: {
    title: "Warped mirror",
    body: "Your reflection frowns. This is not the kindness pane.",
  },
  m_false_2: {
    title: "Gloomy mirror",
    body: "The glass drinks the light. Walk on.",
  },
  light_note: {
    title: "Keeper's log",
    body: "Seat the Harbor Lens in the lamp. Night ships need a warm eye more than a loud bell.",
  },
  ice_note: {
    title: "Frost etching",
    body: "A frozen heart will not thaw to violence. Offer confection. Offer patience.",
  },
  cons_note: {
    title: "Botanist's card",
    body: "The glass rose remembers summer. Touch the arbor and it will bloom again.",
  },
  terrace_note: {
    title: "Sunset plaque",
    body: "Ring the windbells at dusk. The estate listens.",
  },
};

export const PORTRAITS = {
  joy: "/portraits/agent-joy.jpg",
  bear: "/portraits/gloom-bear.jpg",
  bun: "/portraits/bunbun.jpg",
  macaron: "/portraits/madame-macaron.jpg",
  puff: "/portraits/captain-puff.jpg",
  prism: "/portraits/sister-prism.jpg",
  chamomile: "/portraits/miss-chamomile.jpg",
  clef: "/portraits/maestro-clef.jpg",
  lumen: "/portraits/keeper-lumen.jpg",
  behemoth: "/portraits/gloom-behemoth.jpg",
  chateau: "/chateau-dusk.jpg",
};

export const COMPANION_NAMES: Record<string, string> = {
  bear: "Gloom Bear",
  bunny: "Bun-Bun",
  kitten: "Mochi",
  penguin: "Pebble",
  ghost: "Wisp",
};
