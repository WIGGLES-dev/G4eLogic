import config from "../gurps4e/config.json";
import { StringCompare } from "@utils/strings";

export interface KeyList<T> { [key: string]: T }
export interface Config {
    UI: {
        rolling: boolean
    }
    rulesets: {
        useMultiplicativeModifiers: boolean
        useKnowingYourOwnStrength: boolean
        useReducedSwingDamage: boolean
        useNoSchoolGrognardReducedSwingDamage: boolean
    },
    attributes: KeyList<AttributeData>
    pools: KeyList<PoolData>
    locations: KeyList<HitLocationData>
}
export interface AttributeBonus extends FeatureBonus {

}
export interface AttributeLevel {
    level: number,
    mod: number
}
export interface AttributeData {
    abbreviation?: string,
    tooltip?: string
    costPerLevel?: number
    defaultLevel?: number
    basedOn?: string
    increment?: number
    skillSignature?: boolean
    substats?: string[]
    tags?: string[]
}
export interface PoolLevel extends AttributeLevel {
    current: number
}
export interface PoolData extends AttributeData {
    color: string
}
export interface HitLocationData {
    isGroup?: boolean
    subLocations?: string[]
    has?: string[]
    hitPenalty?: number
    crippleRatio?: number
    hitRange?: number[]
    naturalDR?: number
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
export interface Profile {
    birthPlace?: string
    birthday?: string
    status?: string
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

    portrait: URL

}
const defaultProfileData = () => ({
    portrait: new URL("silhouette.png", window.location.origin),
    appearance: Appearance.Average
});
export interface SheetData {
    config: Config
    pointTotal: number
    notes: string
    profile: Profile
    hitLocationDamage: KeyList<number>,
    poolLevels: KeyList<PoolLevel>,
    attributeLevels: KeyList<AttributeLevel>
}
export const defaultSheetData = (): SheetData => ({
    config,
    pointTotal: 0,
    notes: "",
    profile: defaultProfileData(),
    hitLocationDamage: {},
    poolLevels: {},
    attributeLevels: {}
})
export enum Signatures {

}
export type Features = SkillData | TechniqueData | SpellData | TraitData | EquipmentData
export enum FeatureType {
    Skill = "skill",
    Technique = "technique",
    Spell = "spell",
    Trait = "trait",
    Equipment = "equipment",
}
export enum FeatureBonusType {
    Skill = "skill bonus",
    Armor = "armor bonus",
    Reaction = "reaction bonus",
    Attribute = "attribute bonus"
}
export interface FeatureBonus {
    type: FeatureBonusType
    leveled: boolean
    levels: number
}
export type FeatureBonuses = AttributeBonus | SkillBonus | ArmorBonus | ReactionBonus;
interface FeatureKeys {
    type: FeatureType
    disabled?: boolean
    bonuses: FeatureBonuses[]
    weapons: (MeleeWeaponData | RangedWeaponData)[]
}
const defaultFeatureData = () => ({
    disabled: false,
    categories: [],
    bonuses: [],
    weapons: []
});
export interface ReactionBonus extends FeatureBonus {
    type: FeatureBonusType.Reaction
}
export interface ArmorBonus extends FeatureBonus {
    type: FeatureBonusType.Armor
    location: string
    amount: number
}
export enum BaseDamage {
    Swing = "sw",
    Thrust = "thr"
}
export enum DamageType {
    Impaling = "imp",
    Crushing = "cr",
    Cutting = "cut",
    Fatigue = "fat",
    Toxic = "tox"
}
export enum WeaponType {
    Ranged = "ranged",
    Melee = "melee"
}
export interface WeaponData {
    type: WeaponType
    usage: string
    damage: string
    info: string[]
    strengthRequirement: string
    attackBonus: number
    defaults: SkillDefault[]
}
export interface MeleeWeaponData extends WeaponData {
    type: WeaponType.Melee
    parryBonus: number
    blockBonus: number
    reach: string
}
export interface RangedWeaponData extends WeaponData {
    type: WeaponType.Ranged
    accuracy: string
    range: string
    rateOfFire: string
    shots: string
    recoil: number
    bulk: string
}
export enum SkillDifficulty {
    Easy = "E",
    Average = "A",
    Hard = "H",
    VeryHard = "VH",
    Wildcard = "W"
}
export interface SkillDefault {
    type: "Skill" | "Attribtue",
    name: string,
    specialization?: string
    modifier: number
}
export interface SkillBonus extends FeatureBonus {
    type: FeatureBonusType.Skill
    nameCompare: StringCompare
    nameCriteria: string
    specializationCompare: StringCompare
    specializationCriteria: string
    categoryCompare: StringCompare
    categoryCriteria: string
}
export interface SkillLikeData {
    points: number
    name: string
    specialization?: string
    techLevel?: string
    difficulty: SkillDifficulty,
    signature: string,
    mod: number
    encumbrancePenaltyMultiple: number
    defaults: SkillDefault[]
}
export interface SkillData extends FeatureKeys, SkillLikeData {
    type: FeatureType.Skill,

}
export const defaultSkillData = (): SkillData => ({
    ...defaultFeatureData(),
    type: FeatureType.Skill,
    points: 1,
    name: "",
    specialization: null,
    techLevel: null,
    difficulty: SkillDifficulty.Average,
    signature: null,
    mod: 0,
    encumbrancePenaltyMultiple: 1,
    defaults: []
});
export type TechniqueDifficulty = SkillDifficulty.Average | SkillDifficulty.Hard;
export interface TechniqueData extends FeatureKeys, SkillLikeData {
    type: FeatureType.Technique
    difficulty: TechniqueDifficulty
    default: SkillDefault
    defaults: undefined
}
export const defaultTechniqueData = (): TechniqueData => ({
    ...defaultSkillData(),
    type: FeatureType.Technique,
    difficulty: SkillDifficulty.Average,
    default: null,
    defaults: null
});
export interface SpellData extends FeatureKeys, SkillLikeData {
    type: FeatureType.Spell
    requiresConcentration: boolean
    currentlyActive: boolean
    college?: string
    class?: string
    resist?: string
    powerSource?: string
    spellClass?: string
    castingCost?: string
    maintenanceCost?: string
    castingTime?: string
    duration?: string
}
export const defaultSpellData = (): SpellData => ({
    ...defaultSkillData(),
    type: FeatureType.Spell,
    requiresConcentration: false,
    currentlyActive: false,
});
export enum ControlRating {
    CannotResist = "none",
    ResistRarely = "6",
    ResistFairlyOften = "9",
    ResistQuiteOften = "12",
    ResistAlmostAlway = "15",
    NoneRequired = "n/a"
}
export enum TraitModifierType {
    Percentage = "percentage",
    Points = "points",
    Multiplier = "multiplier",
}
export enum TraitModifierAffects {
    Base = "base_only",
    Levels = "levels_only",
    Total = "total"
}
export enum TraitType {
    Mental = "Mental",
    Physical = "Physical",
    Social = "Social",
    Exotic = "Exotic",
}
export interface TraitModifierData extends FeatureKeys {
    type: FeatureType.Trait
    enabled: boolean
    cost: number,
    costType: TraitModifierType
    levels: number
    hasLevels: boolean
    affects: TraitModifierAffects

}
export const defaultTraitModifierData = (): TraitModifierData => ({
    ...defaultFeatureData(),
    type: FeatureType.Trait,
    enabled: false,
    cost: 0,
    costType: TraitModifierType.Percentage,
    levels: null,
    hasLevels: false,
    affects: TraitModifierAffects.Base,
})
export interface TraitData extends FeatureKeys {
    type: FeatureType.Trait
    basePoints: number
    hasLevels: boolean
    levels: number
    pointsPerLevel: number
    allowHalfLevel: boolean
    hasHalfLevels: boolean
    roundDown: boolean
    controlRating: ControlRating
    types: TraitType[]
    modifiers: TraitModifierData[]
}
export const defaultTraitData = (): TraitData => ({
    ...defaultFeatureData(),
    type: FeatureType.Trait,
    basePoints: 0,
    hasLevels: false,
    levels: null,
    pointsPerLevel: null,
    allowHalfLevel: false,
    hasHalfLevels: false,
    roundDown: false,
    controlRating: null,
    types: [],
    modifiers: []
});
export interface EquipmentData extends FeatureKeys {
    type: FeatureType.Equipment
    name: string
    weight: number
    value: number
    storedLocation: string
}
export const defaultEquipmentData = (): EquipmentData => ({
    ...defaultFeatureData(),
    type: FeatureType.Equipment,
    name: "",
    weight: 1,
    value: 0,
    storedLocation: "carried"
})