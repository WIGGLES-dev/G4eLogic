import { Featurable, Signature } from "./character";
import { objectify, json } from "@utils/json_utils";
import { ListItem } from "./misc/list";
import { Default } from "./misc/default";
import { CharacterElement } from "./misc/element";
import { WeaponDefault } from "@gcs/gcs";

export abstract class Weapon<T extends Featurable> extends CharacterElement<T> {
    static keys = ["type", "damageType", "damageBase", "damageMod", "perDieMod", "armorDivisor", "strength", "requiresTwoHands", "usage", "defaults"]
    tag: string = "weapon"
    static type: string
    owner: T

    //temp damage property
    damage: string

    damageType: DamageType
    damageBase: BaseDamage
    damageMod: number
    perDieMod: number

    armorDivisor: number

    strength: number = 10
    requiresTwoHands: boolean = false

    usage: string
    defaults: Set<WeaponDefault>

    constructor(owner: T, keys: string[]) {
        super(owner.getCharacter(), [...keys, ...Weapon.keys]);
        this.owner = owner;
        this.owner.weapons.add(this);
        this.owner.getCharacter().featureList.registerWeapon(this);
    }

    getType() {
        //@ts-ignore
        return this.constructor.type
    }

    load(data: any) { this.getSerializer().transformers.get(this.tag).load(this, data) }
    save() { this.getSerializer().transformers.get(this.tag).save(this) }

    onDestroy() {
        this.owner.getCharacter().featureList.removeWeapon(this.uuid);
    }

    calculateWeaponUsePenalty(): number {
        const userStrength = this.owner.getCharacter().getAttribute(Signature.ST).calculateLevel();
        const weaponRequirement = this.strength;
        const penalty = userStrength - weaponRequirement;
        if (penalty < 0) {
            return penalty
        } else {
            return 0
        }
    }

    toString() {

    }
}

export class MeleeWeapon<T extends Featurable> extends Weapon<T> {
    static keys = ["reach", "parry", "block", "unbalanced", "unwieldy"]
    static type = "melee_weapon"

    reach: string
    parry: number
    block: number | false
    unbalanced: boolean = false
    unwieldy: boolean = false

    constructor(owner: T, keys: string[] = []) {
        super(owner, [...keys, ...MeleeWeapon.keys]);
    }
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