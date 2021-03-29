import { Data, Entity } from "@app/entity"
import type { CharacterData } from "./character";
import { Skill, SkillDefault } from "./skill"

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
export interface WeaponKeys {
    usage?: string
    damage?: string
    damageType?: DamageType
    info?: string[]
    strengthRequirement?: string
    attackBonus?: number
    defaults: SkillDefault[]
}
export interface MeleeWeaponData extends WeaponKeys, Data {
    version: 1
    type: "melee weapon"
    parryBonus: number
    blockBonus: number
    reach: string,
}
export interface RangedWeaponData extends WeaponKeys, Data {
    version: 1
    type: "ranged weapon"
    accuracy: string
    range: string
    rateOfFire: string
    shots: string
    recoil: number
    bulk: string
}

export class Weapon<T extends WeaponKeys & Data> extends Entity<T, CharacterData> {
    constructor(weapon, character) {
        super(weapon, character);
    }
    get bestAttackLevel(): number {
        return Skill.prototype.getHighestDefault.call(this)
    }
    getBestAttackLevel() {
        return this.bestAttackLevel
    }
}

export class MeleeWeapon extends Weapon<MeleeWeaponData> {
    static version = 1 as const
    static type = "melee weapon" as const
    constructor(weapon, character) {
        super(weapon, character);
    }
    get parryLevel() {
        const { parryBonus = 0 } = this.getValue();
        const level = this.bestAttackLevel
        return level / 2 + 3 + parryBonus;
    }
    getParryLevel() {
        return this.parryLevel
    }
    get blockLevel() {
        const { blockBonus = 0 } = this.getValue();
        const level = this.bestAttackLevel;
        return level / 2 + 3 + blockBonus;
    }
    getBlockLevel() {
        return this.blockLevel
    }
}

export class RangedWeapon extends Weapon<RangedWeaponData> {
    static version = 1 as const
    static type = "ranged weapon" as const
    constructor(weapon, character) {
        super(weapon, character);
    }
}