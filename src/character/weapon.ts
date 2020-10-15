import { Signature } from "./character";
import { ListItem } from "./misc/list";
import { Default } from "./misc/default";
import { CharacterElement, OwnedElement } from "./misc/element";
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

export abstract class Weapon<T extends ListItem = ListItem> extends OwnedElement<T> {
    static keys = [
        "usage",
        "strength",
        'damage',
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

    usage: string = "attack"
    strength: string = "10"

    damage = ""

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
        super(owner, [...keys, ...Weapon.keys]);
        this.owner = owner;
        this.owner.weapons.add(this);
        this.owner.getCharacter().featureList.registerWeapon(this);
    }

    addDefault(): WeaponDefault<any> {
        const newDefault = new WeaponDefault(this);
        return newDefault
    }

    getType() {
        //@ts-ignore
        return this.constructor.type
    }

    load(data: any, ...args) { return this.getSerializer().transform(this.tag, "load")(this, data, ...args) }
    save(data: any, ...args) { return this.getSerializer().transform(this.tag, "save")(this, data, ...args) }

    delete() {
        this.owner.weapons.delete(this);
        this.owner.getCharacter().featureList.removeWeapon(this.uuid);
        super.delete();
        this.owner.dispatch();
    }

    getBestAttackLevel({ inferUsagePenalties = false } = {}) {
        let bestBaseLevel = (this.getBestDefault()?.getHighestMatchLevel() ?? null) + this.attackBonus;
        return !inferUsagePenalties ? bestBaseLevel : bestBaseLevel + this.calculateWeaponUsePenalty()
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
            return this.owner.getAmmoSources();
        } catch (err) {
            return []
        }
    }
}

export class MeleeWeapon<T extends ListItem> extends Weapon<T> {
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

export class RangedWeapon<T extends ListItem> extends Weapon<T> {
    static keys = ["accuracy", "range", "rateOfFire", "shots", "bulk", "recoil"]
    static type = "ranged_weapon"

    accuracy: string = ""
    range: string = ""
    rateOfFire: string = ""
    shots: string = ""
    recoil = 0
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