import { Data } from "@app/entity";
import type { Config } from "@app/gurps/resources/characterConfig";
import { Entity } from "@app/entity";
import { parseHitLocations } from "@app/gurps/resources/characterConfig";
import { Gurps } from "./characterFunctions";
import { keyMap } from "@utils/object";
import {
  Equipment,
  MeleeWeapon,
  RangedWeapon,
  Skill,
  Spell,
  Technique,
  Trait,
  sumTraitArray,
  split,
  TraitData,
  TraitCategory,
} from "./index";

export interface CharacterData extends Data {
  version: typeof Character["version"];
  type: typeof Character["type"];
  config: Config;
  pointTotal: number;
  notes: string;
  profile: ProfileData;
  hitLocationDamage: Record<string, number>;
  attributeLevels: Record<string, AttributeLevel>;
}
export interface ProfileData {
  birthPlace?: string;
  birthday?: string;
  attribute?: string;
  wealth?: string;
  income?: string;
  expenses?: string;
  base?: string;
  affiliation?: string;
  family?: string;
  status?: string;
  name?: string;
  nickName?: string;
  sex?: string;
  gender?: string;
  race?: string;
  handedness?: string;
  reaction?: string;
  appearanceFeatures?: string;
  voice?: string;
  age?: string;
  appearance?: Appearance;
  eyes?: string;
  skin?: string;
  hair?: string;
  facialHair?: string;
  build?: string;
  weight?: string;
  height?: string;
  religion?: string;
  education?: string;
  citizenship?: string;
  orientation?: string;
  other?: string;
  sizeModifier: number;
  portrait: string;
  cropped?: string;
}
export enum Appearance {
  Horrific,
  Monstrous,
  Hideous,
  Unattractive,
  Average,
  Attractive,
  Handsome_Beautiful,
  Very_Handsome_Beautiful,
  Transcendent,
}
type EntityTypes =
  | Skill
  | Technique
  | Spell
  | Trait
  | Equipment
  | MeleeWeapon
  | RangedWeapon;
type Processed<T extends Entity<Data, Data>> = ReturnType<T["process"]>;
interface EntityMap {
  [Skill.type]: Record<string, Processed<Skill>>;
  [Technique.type]: Record<string, Processed<Technique>>;
  [Spell.type]: Record<string, Processed<Spell>>;
  [Trait.type]: Record<string, Processed<Trait>>;
  [Equipment.type]: Record<string, Processed<Equipment>>;
  [MeleeWeapon.type]: Record<string, Processed<MeleeWeapon>>;
  [RangedWeapon.type]: Record<string, Processed<RangedWeapon>>;
}
export class Character extends Entity<CharacterData> {
  static type = "character" as const;
  static version = 1 as const;
  attributeCollection: AttributeCollection;
  hitLocationCollection: HitLocationCollection;
  embedded: Record<string, EntityTypes>;
  features: any[];
  constructor(character) {
    super(character);
    this.embedded = this.getEmbeds() as Record<string, EntityTypes>;
    this.features = Character.getFeatures(Object.values(this.embedded));
    this.attributeCollection = createAttributeCollection(this);
    this.hitLocationCollection = createHitLocationCollection(this);
  }
  get entityMap() {
    return {
      [Skill.type]: Skill,
      [Technique.type]: Technique,
      [Spell.type]: Spell,
      [Trait.type]: Trait,
      [Equipment.type]: Equipment,
      [MeleeWeapon.type]: MeleeWeapon,
      [RangedWeapon.type]: RangedWeapon,
    };
  }
  get children() {
    return this.getValue()?.children?.map(({ id }) => this.embedded[id]) ?? [];
  }
  getWeapons(maxDepth?) {
    return [
      ...this.getRangedWeapons(maxDepth),
      ...this.getMeleeWeapons(maxDepth),
    ];
  }
  getRangedWeapons(maxDepth?) {
    return Object.values(this.embedded).filter(
      (e): e is RangedWeapon => e instanceof RangedWeapon
    );
  }
  getMeleeWeapons(maxDepth?) {
    return Object.values(this.embedded).filter(
      (e): e is MeleeWeapon => e instanceof MeleeWeapon
    );
  }
  getCarriedWeight() {
    return this.children
      .filter(
        (e): e is Equipment => e instanceof Equipment && e.enabled === true
      )
      .reduce((weight, e) => {
        return weight + e.getContainedWeight();
      }, 0);
  }
  getEncumbranceLevel() {
    const bl = this.getBasicLift();
    const carried = this.getCarriedWeight();
    if (carried > 10 * bl) {
      return -5;
    } else if (carried > 6 * bl) {
      return -4;
    } else if (carried > 3 * bl) {
      return -3;
    } else if (carried > 2 * bl) {
      return -2;
    } else if (carried > bl) {
      return -1;
    } else {
      return 0;
    }
  }
  getAttributeCollection() {
    return this.attributeCollection;
  }
  getAttribute(attribute: string) {
    return this.getAttributeCollection()[attribute];
  }
  getHitLocationCollection() {
    return this.hitLocationCollection;
  }
  getLocation(location: string) {
    return this.getHitLocationCollection()[location];
  }
  getSwingDamage() {
    return Gurps.getSwingDamage(this.getAttribute("striking strength").level);
  }
  getThrustDamage() {
    return Gurps.getThrustDamage(this.getAttribute("striking strength").level);
  }
  getBasicLift() {
    return Gurps.basicLift(this.getAttribute("lifting strength").level);
  }
  getPointTotal() {
    const sumSkills = (tot, s) => tot + s.points || 0;
    const embeds = Object.values(this.embedded);
    const total = this.getValue().pointTotal;
    const attributePoints = Object.values(this.getAttributeCollection()).reduce(
      (points, attribute) => points + (attribute.pointsSpent || 0),
      0
    );
    const skills = embeds
      .map((entity) => entity.getValue())
      .filter((data) => data.type === "skill")
      .reduce(sumSkills, 0);
    const techniques = embeds
      .map((entity) => entity.getValue())
      .filter((data) => data.type === "technique")
      .reduce(sumSkills, 0);
    const spells = embeds
      .map((entity) => entity.getValue())
      .filter((data) => data.type === "spell")
      .reduce(sumSkills, 0);
    const traits = split(
      embeds
        .map((entity) => entity.getValue())
        .filter((data): data is TraitData => data.type === "trait")
    );
    const racialPoints = sumTraitArray(traits[TraitCategory.Racial]);
    const advantages = sumTraitArray(traits[TraitCategory.Advantage]);
    const perks = sumTraitArray(traits[TraitCategory.Perk]);
    const disadvantages = sumTraitArray(traits[TraitCategory.Disadavantage]);
    const quirks = sumTraitArray(traits[TraitCategory.Quirk]);
    const spent =
      +attributePoints +
      racialPoints +
      advantages +
      perks +
      disadvantages +
      quirks +
      skills +
      techniques +
      spells;
    return {
      attributePoints,
      racialPoints,
      advantages,
      perks,
      disadvantages,
      quirks,
      skills,
      techniques,
      spells,
      spent,
      total,
      unspent: total - spent,
    };
  }
  private static getFeatures(embeds: Entity<Data, Data>[]) {
    const activeEmbeds: Entity<Data, Data>[] = embeds.filter((e) => e.enabled);
    const features = activeEmbeds
      .flatMap((entity) => entity.getValue()?.features)
      .filter((v) => !!v);
    return features;
  }
  process() {
    const embedded = Object.values(this.embedded).reduce((map, embed) => {
      if (!map[embed.type]) {
        map[embed.type] = {};
      }
      map[embed.type][embed.id] = embed.process();
      return map;
    }, {} as EntityMap);
    const pd = {
      embedded,
      pointTotals: this.getPointTotal(),
      basicLift: this.getBasicLift(),
      thrustDamage: this.getThrustDamage(),
      swingDamage: this.getSwingDamage(),
      attributes: this.getAttributeCollection(),
      hitLocations: this.getHitLocationCollection(),
      encumbranceLevel: this.getEncumbranceLevel(),
      carriedWeight: this.getCarriedWeight(),
    };
    const spd = super.process();
    return { ...spd, ...pd };
  }
}
export interface AttributeData {
  isPool?: boolean;
  abbreviation?: string;
  tooltip?: string;
  costPerLevel?: number;
  defaultLevel?: number;
  basedOn?: string;
  increment?: number;
  skillSignature?: boolean;
  substats?: string[];
  tags?: string[];
  color?: string;
}
export interface CalculatedAttribute {
  name: string;
}
export interface AttributeLevel {
  level: number;
  mod: number;
  current: number;
}
interface Attribute {
  currentValue: number;
  keys: AttributeData;
  costPerLevel: number;
  tags: string[];
  name: string;
  baseLevel: number;
  current: number;
  mod: number;
  unmodifiedLevel: number;
  levelsIncreased: number;
  pointsSpent: number;
  level: number;
  displayLevel: number;
  base: number;
  bonus: number;
}
type AttributeCollection = Record<string, Attribute>;
export function createAttributeCollection(
  character: Character
): AttributeCollection {
  const characterData = character.getValue();
  const { features = [] } = character;
  const {
    attributeLevels,
    config: { ui: { attributeOrder, poolOrder } = {}, attributes = {} } = {},
  } = characterData;
  const collection: AttributeCollection = {};
  for (const [name, data] of Object.entries(attributes)) {
    const {
      basedOn = "return null",
      defaultLevel = 0,
      tags = [],
      costPerLevel = 0,
    } = data;
    const { level: baseLevel = defaultLevel, mod = 0, current = 0 } =
      attributeLevels[name] || {};
    const levelsIncreased = baseLevel - defaultLevel;
    const pointsSpent = levelsIncreased * costPerLevel;
    const bonus = features
      .filter((f) => f.type === "attribute bonus" && f.attribute === name)
      .reduce((t, b) => t + b.amount, 0);
    const formula = basedOn.startsWith("return")
      ? new Function("attributes", basedOn)
      : (attributes) => attributes[basedOn].level;
    collection[name] = {
      currentValue: current,
      keys: data,
      costPerLevel,
      tags,
      name,
      baseLevel,
      current,
      mod,
      levelsIncreased,
      pointsSpent,
      bonus,
      get unmodifiedLevel() {
        return this.level - this.bonus - this.mod - this.base;
      },
      get level() {
        return baseLevel + this.bonus + mod + this.base;
      },
      get displayLevel() {
        return this.level;
      },
      get base() {
        try {
          return formula(collection);
        } catch (err) {
          return 0;
        }
      },
    } as Attribute;
  }
  return collection;
}
export interface HitLocationData {
  isGroup?: boolean;
  subLocations?: string[];
  has?: string[];
  hitPenalty?: number;
  crippleDivisor?: number;
  hitRange?: number[];
  naturalDR?: number;
}
export interface HitLocation {
  name: string;
  keys: HitLocationData;
  damageResistance: number;
  subLocations: HitLocation[];
  damageTaken: number;
  isCrippled: boolean;
  crippleThreshold: number;
}
type HitLocationCollection = Record<string, HitLocation>;
function createHitLocationCollection(character: Character) {
  const characterData = character.getValue();
  const { features = [] } = character;
  const hitPoints = character.getAttribute("hit points");
  const collection: HitLocationCollection = {};
  const { hitLocationDamage, config: { locations = {} } = {} } = characterData;
  const hitLocations = parseHitLocations(locations);
  for (const [name, data] of Object.entries(hitLocations)) {
    const { crippleDivisor = false, subLocations } = data;
    const damageTaken = hitLocationDamage[name];
    const damageResistance = features
      .filter(
        (f) => f && f.type === "armor bonus" && f.location?.includes(name)
      )
      .map((f) => f.amount)
      .reduce((t, b) => t + b, 0);
    const crippleThreshold =
      typeof crippleDivisor === "number" ? hitPoints.level / crippleDivisor : 0;
    const isCrippled =
      crippleDivisor === 0 ? false : damageTaken > crippleThreshold;
    collection[name] = {
      name,
      keys: data,
      damageResistance,
      get subLocations(): HitLocation[] {
        return subLocations?.map((location) => collection[location]);
      },
      damageTaken,
      isCrippled,
      crippleThreshold,
    };
  }
  return collection;
}
