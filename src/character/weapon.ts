import { Featurable, Signature } from "./character";
import { objectify, json } from "@utils/json_utils";
import { ListItem } from "./misc/list";
import { Default } from "./misc/default";
import { CharacterElement } from "./misc/element";
import { Collection } from "./misc/collection";
import { Modifier } from "./misc/modifier";

class WeaponDefault<T extends Weapon<any>> extends Default<any> {
    static keys = []

    constructor(owner: T, keys: string[] = []) {
        super(owner, [...keys, ...WeaponDefault.keys]);
        this.owner.defaults.add(this);
    }

    getLookupList() { return this.owner.owner.list.character.skillList }
}

export abstract class Weapon<T extends Featurable> extends CharacterElement<T> {
    static keys = [
        "usage",
        "strength",
        "damageStrength",
        "damageBase",
        "damageType",
        "damagePerDieBonus",
        "armorDivisor",
        "fDamage",
        "fArmorDivisor",
        "fDamageType",
        "attackBonus"
    ]

    tag: string = "weapon"
    static type: string
    owner: T

    usage: string
    strength: string = "10"

    damageStrength: BaseDamage
    damageBase: string
    damageType: DamageType
    damagePerDieBonus: number

    armorDivisor: number

    fDamage: string
    fArmorDivisor: number
    fDamageType: string

    attackBonus: number = null

    defaults: Set<WeaponDefault<Weapon<T>>> = new Set

    constructor(owner: T, keys: string[]) {
        super(owner.getCharacter(), [...keys, ...Weapon.keys]);
        this.owner = owner;
        this.owner.weapons.add(this);
        this.owner.getCharacter().featureList.registerWeapon(this);
    }

    addDefault() {
        const newDefault = new WeaponDefault(this);
        return newDefault
    }

    getType() {
        //@ts-ignore
        return this.constructor.type
    }

    load(data: any, ...args) { return this.getSerializer().transformers.get(this.tag).load(this, data, ...args) }
    save(...args) { return this.getSerializer().transformers.get(this.tag).save(this, ...args) }

    onDestroy() {
        this.owner.getCharacter().featureList.removeWeapon(this.uuid);
    }

    getBestAttackLevel({ inferUsagePenalties = false } = {}) {
        let bestBaseLevel = (this.getBestDefault()?.getHighestMatchLevel() ?? null) + this.attackBonus;
        return inferUsagePenalties ? bestBaseLevel : bestBaseLevel + this.calculateWeaponUsePenalty()
    }

    getBestDefault(): WeaponDefault<any> {
        let best = Number.NEGATIVE_INFINITY;
        let bestDefault;
        this.defaults.forEach(weaponDefault => {
            if (weaponDefault.getHighestMatchLevel() > best) {
                best = weaponDefault.getHighestMatchLevel();
                bestDefault = weaponDefault;
            };
        });
        return bestDefault
    }

    abstract getParryLevel()
    abstract getBlockLevel()

    calculateWeaponUsePenalty(): number {
        const userStrength = this.owner.getCharacter().getAttribute(Signature.ST).calculateLevel();
        const weaponRequirement = Modifier.extractValue(this.strength.toString());
        const penalty = userStrength - weaponRequirement;
        if (penalty < 0) {
            return penalty
        } else {
            return 0
        }
    }

    getAmmoSources() {
        try {
            //@ts-ignore
            this.owner.getAmmoSources();
        } catch (err) {
            return []
        }
    }
}

export class MeleeWeapon<T extends Featurable> extends Weapon<T> {
    static keys = ["reach", "parry", "block", "unbalanced", "unwieldy"]
    static type = "melee_weapon"

    reach: string
    parry: number
    block: number
    unbalanced: boolean = false
    unwieldy: boolean = false

    constructor(owner: T, keys: string[] = []) {
        super(owner, [...keys, ...MeleeWeapon.keys]);
    }

    getParryLevel(bonus: number = 0) { return Math.floor(this.getBestAttackLevel() / 2 + 3) + bonus }
    getBlockLevel(bonus: number = 0) { return Math.floor(this.getBestAttackLevel() / 2 + 3) + bonus }
}

export class RangedWeapon<T extends Featurable> extends Weapon<T> {
    static keys = ["accuracy", "range", "rateOfFire", "shots", "bulk"]
    static type = "ranged_weapon"

    accuracy: string = ""
    range: string = ""
    rateOfFire: string = ""
    shots: string = ""
    bulk: string = ""

    constructor(owner: T, keys: string[] = []) {
        super(owner, [...keys, ...RangedWeapon.keys]);
    }

    getParryLevel() { return null }
    getBlockLevel() { return null }
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