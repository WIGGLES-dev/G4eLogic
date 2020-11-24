import {
    Feature, FeatureType, FeatureData, featureData,
    SkillDefault,
    skillMatchesAnyDefaults,
    Sheet,
    EmbeddedResource,
    Valor,
    skillMatchesDefault,
    skillDefaultMatches
} from "@internal";
import { combineLatest, Observable } from "rxjs";
import { map, takeWhile } from "rxjs/operators";

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

export abstract class Weapon<OT extends FeatureType, OK extends FeatureData<OT>, T extends FeatureType, K extends Weapons = Weapons> extends EmbeddedResource<T, K, Feature<OT, OK>> {
    get sheet() { return this.parent?.sheet }
    get owner() { return this.parent }
    get owner$() { return this.parent$ }
    constructor(feature: Feature<OT, OK>, id: string) {
        super(feature, id);
    }
    get config$() { return this.embedded ? this.sheet?.config$ : Valor.data$.pipe(map(valor => valor.globalConfig)) }

    get bestAttackLevel$(): Observable<number> {
        return skillDefaultMatches(this.sheet, this.keys$.pipe(map(keys => keys.defaults))).pipe(takeWhile(() => this.exists))
    }
}

export class MeleeWeapon<T extends FeatureType = FeatureType, K extends FeatureData<T> = FeatureData<T>> extends Weapon<T, K, FeatureType.MeleeWeapon, MeleeWeaponData> {
    type = FeatureType.MeleeWeapon as FeatureType.MeleeWeapon
    constructor(feature: Feature<T, K>, id) {
        super(feature, id);
    }
    get parryLevel$() {
        return combineLatest([
            this.bestAttackLevel$,
            this.keys$
        ]).pipe(
            map(([level, keys]) => level / 2 + 3 + (keys.parryBonus || null))
        )
    }
    get blockLevel$() {
        return combineLatest([
            this.bestAttackLevel$,
            this.keys$
        ]).pipe(
            map(([level, keys]) => level / 2 + 3 + (keys.blockBonus || null))
        )
    }
    defaultData() { return meleeWeaponData() }
}

export class RangedWeapon<T extends FeatureType = FeatureType, K extends FeatureData<T> = FeatureData<T>> extends Weapon<T, K, FeatureType.RangedWeapon, RangedWeaponData> {
    type = FeatureType.RangedWeapon as FeatureType.RangedWeapon;
    constructor(feature: Feature<T, K>, id: string) {
        super(feature, id);
    }
    defaultData() { return rangedWeaponData() }
}