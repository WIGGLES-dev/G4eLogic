
export abstract class Weapon {
    usage: string = "attack"
    strength: string = "10"
    info: string = ""

    damage = "1d6"

    damageStrength: BaseDamage
    damageBase: string
    damageType: DamageType = DamageType.crushing
    damagePerDieBonus: number = 0

    armorDivisor: number

    fDamage: string
    fArmorDivisor: number
    fDamageType: string

    attackBonus: number = null
}

export class MeleeWeapon extends Weapon {
    static type = "melee_weapon"

    parryBonus = null
    blockBonus = null

    reach: string = "1"

    constructor() {
        super()
    }

    getParryLevel() { return Math.floor(0 / 2 + 3) + this.parryBonus }
    getBlockLevel() { return Math.floor(0 / 2 + 3) + this.blockBonus }
}

export class RangedWeapon extends Weapon {
    accuracy: string = ""
    range: string = ""
    rateOfFire: string = ""
    shots: string = ""
    recoil = 0
    bulk: string = ""

    constructor() {
        super()
    }
}

enum BaseDamage {
    swing = "sw",
    thrust = "thr"
}

enum DamageType {
    impaling = "imp",
    crushing = "cr",
    cutting = "cut",
    fatigue = "fat",
    toxic = "tox",
}