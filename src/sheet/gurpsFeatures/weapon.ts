import {
    Feature, FeatureType, FeatureData, featureData,
    SkillDefault,
    Sheet,
    EmbeddedResource
} from "@internal";

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

export type Weapons = RangedWeaponData | MeleeWeaponData
export interface WeaponData {
    usage?: string
    damage?: string
    info?: string[]
    strengthRequirement?: string
    attackBonus?: number
    defaults: SkillDefault[]
}
export const weaponData = (): WeaponData => ({
    damage: "1d6",
    usage: "",
    strengthRequirement: "10",
    attackBonus: 0,
    defaults: [] as SkillDefault[],
});
export interface MeleeWeaponData extends WeaponData, FeatureData {
    type: FeatureType.MeleeWeapon
    parryBonus: number
    blockBonus: number
    reach: string
}
export const meleeWeaponData = (): MeleeWeaponData => ({
    ...featureData(),
    ...weaponData(),
    type: FeatureType.MeleeWeapon,
    parryBonus: 0,
    blockBonus: 0,
    reach: "1"
});

export interface RangedWeaponData extends WeaponData, FeatureData {
    type: FeatureType.RangedWeapon
    accuracy: string
    range: string
    rateOfFire: string
    shots: string
    recoil: number
    bulk: string
}
export const rangedWeaponData = (): RangedWeaponData => ({
    ...featureData(),
    ...weaponData(),
    type: FeatureType.RangedWeapon,
    accuracy: "0",
    range: "10/100",
    rateOfFire: "1",
    shots: "1",
    recoil: 0,
    bulk: "2"
});

export abstract class Weapon<OT extends FeatureType, OK extends FeatureData, T extends FeatureType, K extends Weapons = Weapons> extends EmbeddedResource<T, K, Feature<OT, OK>> {
    get owner() { return this.parent }
    get owner$() { return this.parent$ }
    constructor(id: string, feature: Feature<OT, OK>) {
        super(id, feature);
    }
    getBestAttackLevel() { return 0 }
    getParryLevel() { return 0 }
    getBlockLevel() { return 0 }
}

export class MeleeWeapon<T extends FeatureType = FeatureType, K extends FeatureData = FeatureData> extends Weapon<T, K, FeatureType.MeleeWeapon, MeleeWeaponData> {
    type = FeatureType.MeleeWeapon as FeatureType.MeleeWeapon
    constructor(id: string, feature: Feature<T, K>) {
        super(id, feature);
    }
    defaultData() { return meleeWeaponData() }
}

export class RangedWeapon<T extends FeatureType = FeatureType, K extends FeatureData = FeatureData> extends Weapon<T, K, FeatureType.RangedWeapon, RangedWeaponData> {
    type = FeatureType.RangedWeapon as FeatureType.RangedWeapon;
    constructor(id: string, feature: Feature<T, K>) {
        super(id, feature);
    }
    defaultData() { return rangedWeaponData() }
}