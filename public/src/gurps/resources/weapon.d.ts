import { SkillDefault, Resource, Data } from "@internal";
import { Observable } from "rxjs";
export declare enum BaseDamage {
    Swing = "sw",
    Thrust = "thr"
}
export declare enum DamageType {
    Impaling = "imp",
    Crushing = "cr",
    Cutting = "cut",
    Fatigue = "fat",
    Toxic = "tox"
}
export declare type Weapons = RangedWeaponData | MeleeWeaponData;
export interface WeaponKeys {
    usage?: string;
    damage?: string;
    damageType?: DamageType;
    info?: string[];
    strengthRequirement?: string;
    attackBonus?: number;
    defaults: SkillDefault[];
}
export interface MeleeWeaponData extends WeaponKeys, Data {
    version: 1;
    type: "melee weapon";
    parryBonus: number;
    blockBonus: number;
    reach: string;
}
export interface RangedWeaponData extends WeaponKeys, Data {
    version: 1;
    type: "ranged weapon";
    accuracy: string;
    range: string;
    rateOfFire: string;
    shots: string;
    recoil: number;
    bulk: string;
}
export declare abstract class Weapon<K extends WeaponKeys & Data = WeaponKeys & Data> extends Resource<K> {
    constructor(state: Resource<K>["state"]);
    get bestAttackLevel$(): Observable<number>;
}
export declare class MeleeWeapon extends Weapon<MeleeWeaponData> {
    static version: 1;
    static type: "melee weapon";
    constructor(state: MeleeWeapon["state"]);
    get parryLevel$(): Observable<number>;
    get blockLevel$(): Observable<number>;
}
export declare class RangedWeapon extends Weapon<RangedWeaponData> {
    static version: 1;
    static type: "ranged weapon";
    constructor(state: RangedWeapon["state"]);
}
