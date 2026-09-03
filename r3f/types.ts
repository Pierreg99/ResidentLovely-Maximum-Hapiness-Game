export type MapId =
  | "foyer"
  | "library"
  | "garden"
  | "tea_salon"
  | "bakery"
  | "observatory"
  | "clock_belfry"
  | "crystal_grotto"
  | "moonlit_meadow"
  | "harbor_docks"
  | "mirror_maze"
  | "music_parlor"
  | "village"
  | "sacred_forest"
  | "sugar_lab"
  | "crypt"
  | "lighthouse"
  | "ice_chamber"
  | "conservatory"
  | "terrace";

export type Dir = "N" | "S" | "E" | "W" | "U" | "D";

export type Biome =
  | "estate"
  | "kawaii"
  | "outdoor"
  | "gothic"
  | "crystal"
  | "maritime"
  | "forest"
  | "subterranean";

export type WeaponId = "pistol" | "shotgun" | "mortar" | "beam" | "wand";

export type ItemId =
  | "herb_green"
  | "herb_double"
  | "elixir_ultra"
  | "powder_red"
  | "bliss_cupcake"
  | "key_foyer"
  | "ribbon_gold"
  | "key_master"
  | "gem_star"
  | "crest_royal"
  | "sugar_crystal"
  | "dynamo_core"
  | "macaron_rainbow"
  | "cotton_candy"
  | "diary"
  | "tea_blend"
  | "lighthouse_lens"
  | "mirror_shard"
  | "forest_offering"
  | "stardust_core"
  | "wand_astral";

export type ItemType = "consumable" | "material" | "key" | "quest_item" | "lore" | "weapon";

export type GrumpKind = "bear" | "bunny" | "kitten" | "penguin" | "ghost";

export type NpcId =
  | "madame-macaron"
  | "captain-puff"
  | "sister-prism"
  | "miss-chamomile"
  | "maestro-clef"
  | "keeper-lumen";

export type QuestStatus = "locked" | "active" | "done";

export type UiMode =
  | "title"
  | "playing"
  | "paused"
  | "inventory"
  | "quests"
  | "map"
  | "examine"
  | "piano"
  | "dialogue"
  | "win";

export type ViewMode = "ots" | "fps";

export type DoorDef = {
  dir: Dir;
  to: MapId;
  label: string;
  requires?: ItemId;
  requiresFlag?: string;
};

export type Interactable = {
  id: string;
  kind: "examine" | "pickup" | "puzzle" | "npc" | "lantern" | "altar" | "door";
  label: string;
  x: number;
  z: number;
  item?: ItemId;
  npc?: NpcId;
  flag?: string;
  once?: boolean;
};

export type GrumpSpawn = {
  kind: GrumpKind;
  x: number;
  z: number;
  gloom: number;
};

export type MapDef = {
  id: MapId;
  name: string;
  floor: string;
  biome: Biome;
  w: number;
  l: number;
  h: number;
  happiness: number;
  doors: DoorDef[];
  spawn: { x: number; z: number; yaw: number };
  interactables: Interactable[];
  grumps: GrumpSpawn[];
  npcs: { id: NpcId; x: number; z: number; yaw: number }[];
  weather: "none" | "mist" | "petals" | "embers" | "snow" | "sparks" | "spores" | "spray";
};

export type QuestTask = {
  id: string;
  text: string;
  done: boolean;
  count?: number;
  max?: number;
};

export type QuestDef = {
  id: string;
  name: string;
  desc: string;
  map: MapId;
  unlocks?: MapId[];
  tasks: QuestTask[];
};

export type ItemDef = {
  id: ItemId;
  name: string;
  desc: string;
  type: ItemType;
  restore?: number;
};

export type Slot = { id: ItemId; qty: number } | null;

export type ExaminePayload = {
  title: string;
  body: string;
  portrait?: string;
  speaker?: string;
};

export type WeaponDef = {
  id: WeaponId;
  name: string;
  cooldown: number;
  damage: number;
  spread: number;
  pellets: number;
  speed: number;
  arcing: boolean;
  beam: boolean;
};
