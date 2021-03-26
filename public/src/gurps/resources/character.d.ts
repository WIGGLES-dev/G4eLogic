import { Data } from "@app/entity";
import type { Config } from "@app/gurps/resources/characterConfig";
import { Entity } from "@app/entity";
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
export declare enum Appearance {
    Horrific = 0,
    Monstrous = 1,
    Hideous = 2,
    Unattractive = 3,
    Average = 4,
    Attractive = 5,
    Handsome_Beautiful = 6,
    Very_Handsome_Beautiful = 7,
    Transcendent = 8
}
export declare class Character extends Entity<CharacterData> {
    static type: "character";
    static version: 1;
    constructor(character: CharacterData);
    getWeapons(): void;
    getRangedWeapons(): void;
    getMeleeWeapons(): void;
    getCarriedWeight(): number;
    getEncumbranceLevel(): 0 | -1 | -2 | -3 | -5 | -4;
    getAttributeCollection(): Record<string, Attribute>;
    getAttribute(attribute: string): Attribute;
    getOrderedAttributes(): string[];
    getOrderedPools(): string[];
    getHitLocationCollection(): Record<string, HitLocation>;
    getSwingDamage(): string;
    getThrustDamage(): string;
    getBasicLift(): number;
    getPointTotal(): {
        attributePoints: number;
        racialPoints: number;
        advantages: number;
        perks: number;
        disadvantages: number;
        quirks: number;
        skills: any;
        techniques: any;
        spells: any;
        spent: any;
        total: number;
        unspent: number;
    };
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
declare type AttributeCollection = Record<string, Attribute>;
export declare function createAttributeCollection(characterData: CharacterData): AttributeCollection;
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
export {};
