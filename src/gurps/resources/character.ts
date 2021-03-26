import { Data } from "@app/entity";
import type { Config } from "@app/gurps/resources/characterConfig";
import { Entity } from "@app/entity";
import { parseHitLocations } from "@app/gurps/resources/characterConfig";
import { Gurps } from "./characterFunctions";
import { Skill } from "./skill";
import { Trait, sumTraitArray, split, TraitData, TraitCategory } from "./trait";
import { Equipment } from "./equipment";
export interface CharacterData extends Data {
    version: typeof Character["version"]
    type: typeof Character["type"]
    config: Config
    pointTotal: number
    notes: string
    profile: ProfileData
    hitLocationDamage: Record<string, number>,
    attributeLevels: Record<string, AttributeLevel>
}
export interface ProfileData {
    birthPlace?: string
    birthday?: string
    attribute?: string
    wealth?: string
    income?: string
    expenses?: string
    base?: string
    affiliation?: string
    family?: string
    name?: string
    nickName?: string
    sex?: string
    gender?: string
    race?: string
    handedness?: string
    reaction?: string
    appearanceFeatures?: string
    voice?: string
    age?: string
    appearance?: Appearance
    eyes?: string
    skin?: string
    hair?: string
    facialHair?: string
    build?: string
    weight?: string
    height?: string
    religion?: string
    education?: string
    citizenship?: string
    orientation?: string
    other?: string
    sizeModifier: number
    portrait: string
    cropped?: string
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
    Transcendent
}
export class Character extends Entity<CharacterData> {
    static type = "character" as const
    static version = 1 as const
    constructor(character: CharacterData) {
        super(character);
    }
    getWeapons() { }
    getRangedWeapons() { }
    getMeleeWeapons() { }
    getCarriedWeight() {
        return Object.values(this.getEmbeds())
            .filter(entity => entity.type === "equipment")
            .map(entity => new Equipment(entity.value, entity.root))
            .reduce((weight, item) => weight + item.eWeight, 0)
        return 0
    }
    getEncumbranceLevel() {
        const bl = this.getBasicLift();
        const carried = this.getCarriedWeight();
        if (carried > 10 * bl) {
            return -5
        } else if (carried > 6 * bl) {
            return -4
        } else if (carried > 3 * bl) {
            return -3
        } else if (carried > 2 * bl) {
            return -2
        } else if (carried > bl) {
            return -1
        } else {
            return 0
        }
    }
    getAttributeCollection() {
        if (!this.root) return {}
        return createAttributeCollection(this.root);
    }
    getAttribute(attribute: string) {
        return this.getAttributeCollection()[attribute]
    }
    getOrderedAttributes() {
        const {
            config: {
                ui: {
                    attributeOrder
                }
            }
        } = this.value;
        return attributeOrder
    }
    getOrderedPools() {
        const {
            config: {
                ui: {
                    poolOrder
                }
            }
        } = this.value;
        return poolOrder
    }
    getHitLocationCollection() {
        return createHitLocationCollection(this.value)
    }
    getSwingDamage() { return Gurps.getSwingDamage(this.getAttribute("striking strength").level) }
    getThrustDamage() { return Gurps.getThrustDamage(this.getAttribute("striking strength").level) }
    getBasicLift() { return Gurps.basicLift(this.getAttribute("lifting strength").level) }
    getPointTotal() {
        const sumSkills = (tot, s) => tot + s.points;
        const embeds = Object.values(this.getEmbeds());
        const total = this.value.pointTotal;
        const attributePoints = Object.values(this.getAttributeCollection()).reduce(
            (points, attribute) => points + (attribute.pointsSpent || 0), 0
        );
        const skills = embeds.map(entity => entity.value).filter(data => data.type === "skill").reduce(sumSkills, 0);
        const techniques = embeds.map(entity => entity.value).filter(data => data.type === "technique").reduce(sumSkills, 0);
        const spells = embeds.map(entity => entity.value).filter(data => data.type === "spell").reduce(sumSkills, 0);
        const traits = split(embeds.map(entity => entity.value).filter((data): data is TraitData => data.type === "trait"));
        const racialPoints = sumTraitArray(traits[TraitCategory.Racial]);
        const advantages = sumTraitArray(traits[TraitCategory.Advantage]);
        const perks = sumTraitArray(traits[TraitCategory.Perk]);
        const disadvantages = sumTraitArray(traits[TraitCategory.Disadavantage]);
        const quirks = sumTraitArray(traits[TraitCategory.Quirk]);
        const spent =
            + attributePoints
            + racialPoints
            + advantages
            + perks
            + disadvantages
            + quirks
            + skills
            + techniques
            + spells;
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
            unspent: total - spent
        }
    }
}
export interface AttributeData {
    isPool?: boolean,
    abbreviation?: string,
    tooltip?: string
    costPerLevel?: number
    defaultLevel?: number
    basedOn?: string
    increment?: number
    skillSignature?: boolean
    substats?: string[]
    tags?: string[]
    color?: string
}
export interface CalculatedAttribute {
    name: string
}
export interface AttributeLevel {
    level: number,
    mod: number,
    current: number
}
interface Attribute {
    currentValue: number
    keys: AttributeData
    costPerLevel: number
    tags: string[]
    name: string
    baseLevel: number
    current: number
    mod: number
    unmodifiedLevel: number
    levelsIncreased: number
    pointsSpent: number
    level: number
    displayLevel: number
    base: number
    bonus: number
}
type AttributeCollection = Record<string, Attribute>
export function createAttributeCollection(characterData: CharacterData): AttributeCollection {
    const character = new Character(characterData);
    const features = character.getFeatures();
    const {
        attributeLevels,
        config: {
            ui: {
                attributeOrder,
                poolOrder
            },
            attributes = {}
        } = {}
    } = characterData;
    const collection: AttributeCollection = {};
    for (const [name, data] of Object.entries(attributes)) {
        const {
            basedOn = "return null",
            defaultLevel = 0,
            tags = [],
            costPerLevel = 0
        } = data;
        const {
            level: baseLevel = defaultLevel,
            mod = 0,
            current = 0
        } = attributeLevels[name] || {};
        collection[name] = {
            currentValue: current,
            keys: data,
            costPerLevel,
            tags,
            name,
            baseLevel,
            current,
            mod,
            get unmodifiedLevel() {
                return this.level - this.bonus - this.mod - this.base;
            },
            get levelsIncreased() {
                return baseLevel - defaultLevel
            },
            get pointsSpent() {
                return this.levelsIncreased * costPerLevel
            },
            get level() {
                return baseLevel + this.bonus + mod + this.base;
            },
            get displayLevel() {
                return this.level
            },
            get base() {
                const formula = basedOn.startsWith("return") ? new Function("attributes", basedOn) : (attributes) => attributes[basedOn].level
                try {
                    return formula(collection)
                } catch (err) {
                    return 0
                }
            },
            get bonus() {
                return features
                    .filter(f => f.type === "attribute bonus" && f.attribute === name)
                    .reduce((t, b) => t + b.amount, 0)
            }
        };
    }
    return collection
}
export interface HitLocationData {
    isGroup?: boolean
    subLocations?: string[]
    has?: string[]
    hitPenalty?: number
    crippleDivisor?: number
    hitRange?: number[]
    naturalDR?: number
}
export interface HitLocation {
    name: string
    keys: HitLocationData
    damageResistance: number
    subLocations: HitLocation[]
    damageTaken: number
    isCrippled: boolean
    crippleThreshold: number
}
type HitLocationCollection = Record<string, HitLocation>
function createHitLocationCollection(characterData: CharacterData) {
    const character = new Character(characterData);
    const features = character.getFeatures();
    const hitPoints = character.getAttribute("hit points");
    const collection: HitLocationCollection = {};
    const {
        hitLocationDamage,
        config: {
            locations = {}
        } = {}
    } = characterData;
    const hitLocations = parseHitLocations(locations);
    for (const [name, data] of Object.entries(hitLocations)) {
        const {
            crippleDivisor = false,
            subLocations
        } = data;
        const dt = hitLocationDamage[name]
        collection[name] = {
            name,
            keys: data,
            get damageResistance(): number {
                return features
                    .filter(f => f.type === "armor bonus" && f.location === name)
                    .map(f => f.amount)
                    .reduce((t, b) => t + b, 0)
            },
            get subLocations(): HitLocation[] {
                return subLocations?.map(location => collection[location])
            },
            damageTaken: dt,
            get isCrippled() {
                const ct = this.crippleThreshold;
                if (ct === 0) return false;
                return this.damageTaken > ct
            },
            get crippleThreshold() {
                return typeof crippleDivisor === "number" ? (hitPoints.level / crippleDivisor) : 0
            }
        }
    }
    return collection
}