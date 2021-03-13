import { Observable } from "rxjs";
import { Resource, MeleeWeapon, RangedWeapon, Config, AttributeLevel, Attribute, HitLocation, Data } from "@internal";
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
    status?: string;
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
export declare class Character extends Resource<CharacterData> {
    static type: "character";
    static version: 1;
    constructor(state: Character["state"]);
    selectWeapons(): Observable<[RangedWeapon[], MeleeWeapon[]]>;
    selectRangedWeapons(): Observable<RangedWeapon[]>;
    selectMeleeWeapons(): Observable<MeleeWeapon[]>;
    selectCarriedWeight(): Observable<any>;
    selectEncumbranceLevel(): Observable<0 | -1 | -2 | -3 | -4 | -5>;
    selectAttributes(): Observable<Record<string, Attribute>>;
    selectAttribute(key: string): Observable<Attribute>;
    get orderedAttributes$(): Observable<Attribute[]>;
    get orderedPools$(): Observable<Attribute[]>;
    selectHitLocations(): Observable<Record<string, HitLocation>>;
    selectHitLocation(key: string): Observable<HitLocation>;
    get hitLocations$(): Observable<Record<string, HitLocation>>;
    get swingDamage$(): Observable<string>;
    get thrustDamage$(): Observable<string>;
    selectBasicLift(): Observable<number>;
    get pointTotal$(): Observable<{
        attributePoints: number;
        racialPoints: number;
        advantages: number;
        perks: number;
        disadvantages: number;
        quirks: number;
        skills: number;
        techniques: number;
        spells: number;
        spent: number;
        total: number;
        unspent: number;
    }>;
}
