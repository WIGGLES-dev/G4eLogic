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
    damageType: DamageType;
    damageStrength: BaseDamage;
    damageBase: string;
    armorDivisor: number;
    strength: string;
    usage: string;
    defaults: Set<WeaponDefault<Weapon<T>>>;
    constructor(owner: T, keys: string[]);
    addDefault(): WeaponDefault<this>;
    getType(): any;
    load(data: any): any;
    save(): any;
    onDestroy(): void;
    getBestAttackLevel({ inferUsagePenalties }?: {
        inferUsagePenalties?: boolean;
    }): number;
    getBestDefault(): WeaponDefault<any>;
    calculateWeaponUsePenalty(): number;
}
export declare class MeleeWeapon<T extends Featurable> extends Weapon<T> {
    static keys: string[];
    static type: string;
    reach: string;
    parry: number;
    block: number | false;
    unbalanced: boolean;
    unwieldy: boolean;
    constructor(owner: T, keys?: string[]);
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
