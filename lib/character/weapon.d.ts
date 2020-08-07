import { Featurable } from "./character";
import { CharacterElement } from "./misc/element";
import { WeaponDefault } from "@gcs/gcs";
export declare abstract class Weapon<T extends Featurable> extends CharacterElement<T> {
    static keys: string[];
    tag: string;
    static type: string;
    owner: T;
    damage: string;
    damageType: DamageType;
    damageBase: BaseDamage;
    damageMod: number;
    perDieMod: number;
    armorDivisor: number;
    strength: number;
    requiresTwoHands: boolean;
    usage: string;
    defaults: Set<WeaponDefault>;
    constructor(owner: T, keys: string[]);
    getType(): any;
    load(data: any): void;
    save(): void;
    onDestroy(): void;
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
