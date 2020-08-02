import { Featurable } from "./character";
import { objectify, json } from "@utils/json_utils";
import { ListItem } from "./misc/list";
import { Default } from "./misc/default";
import { CharacterElement } from "./misc/element";
import { WeaponDefault } from "@gcs/gcs";

export abstract class Weapon<T extends Featurable> extends CharacterElement<T> {
    abstract tag: string
    owner: T

    damageType: string
    damageBase: BaseDamage
    damageMod: number

    strength: string
    usage: string
    defaults: Set<WeaponDefault>


    constructor(owner: T) {
        super(owner.getCharacter());
        this.owner = owner;
        this.owner.weapons.add(this);
        this.owner.getCharacter().featureList.registerWeapon(this);
    }

    onDestroy() {
        this.owner.getCharacter().featureList.removeWeapon(this.uuid);
    }
}

export class MeleeWeapon<T extends Featurable> extends Weapon<T> {
    tag = "melee_weapon"

    reach: string
    parry: number
    block: number | false
    constructor(owner: T) {
        super(owner);
    }
}

export class RangedWeapon<T extends Featurable> extends Weapon<T> {
    tag = "ranged_weapon"
    
    accuracy: string
    range: string
    rateOfFire: string
    shots: string
    bulk: string
    constructor(owner: T) {
        super(owner);
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