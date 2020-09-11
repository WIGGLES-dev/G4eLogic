import { Featurable } from "./character";
import { Default } from "./misc/default";
import { CharacterElement } from "./misc/element";
declare class WeaponDefault<T extends Weapon<any>> extends Default<any> {
    static keys: any[];
    constructor(owner: T, keys?: string[]);
    getLookupList(): any;
}
export declare abstract class Weapon<T extends Featurable> extends CharacterElement<T> {
    static keys: string[];
    tag: string;
    static type: string;
    owner: T;
    usage: string;
    strength: string;
    damageStrength: BaseDamage;
    damageBase: string;
    damageType: DamageType;
    damagePerDieBonus: number;
    armorDivisor: number;
    fDamage: string;
    fArmorDivisor: number;
    fDamageType: string;
    attackBonus: number;
    defaults: Set<WeaponDefault<Weapon<T>>>;
    constructor(owner: T, keys: string[]);
    addDefault(): WeaponDefault<this>;
    getType(): any;
    load(data: any, ...args: any[]): any;
    save(...args: any[]): any;
    onDestroy(): void;
    getBestAttackLevel({ inferUsagePenalties }?: {
        inferUsagePenalties?: boolean;
    }): number;
    getBestDefault(): WeaponDefault<any>;
    abstract getParryLevel(): any;
    abstract getBlockLevel(): any;
    calculateWeaponUsePenalty(): number;
    getAmmoSources(): any[];
}
export declare class MeleeWeapon<T extends Featurable> extends Weapon<T> {
    static keys: string[];
    static type: string;
    reach: string;
    parry: number;
    block: number;
    unbalanced: boolean;
    unwieldy: boolean;
    constructor(owner: T, keys?: string[]);
    getParryLevel(bonus?: number): number;
    getBlockLevel(bonus?: number): number;
}
export declare class RangedWeapon<T extends Featurable> extends Weapon<T> {
    static keys: string[];
    static type: string;
    accuracy: string;
    range: string;
    rateOfFire: string;
    shots: string;
    bulk: string;
    constructor(owner: T, keys?: string[]);
    getParryLevel(): any;
    getBlockLevel(): any;
}
declare enum BaseDamage {
    swing = "sw",
    thrust = "thr"
}
declare enum DamageType {
    impaling = "imp",
    crushing = "cr",
    cutting = "cut",
    fatigue = "fat",
    toxic = "tox"
}
export {};
