import { Featurable } from "./character";
import { objectify, json } from "@utils/json_utils";
import { ListItem } from "./misc/list";
import { Default } from "./misc/default";

export abstract class Weapon<T extends Featurable> {
    owner: T
    defaults: Set<WeaponDefault<T>>

    constructor(owner: T) {
        this.owner = owner;
    }
    toJSON() {

    }
    loadJSON(object: string | json) {
        object = objectify<json>(object);
        object.defaults?.forEach((weaponDefault: any) => this.defaults.add(new WeaponDefault<T>(this.owner).loadJSON(weaponDefault)))
    }
}

class MeleeWeapon<T extends Featurable> extends Weapon<T> {

}

class RangedWeapon<T extends Featurable> extends Weapon<T> {

}

class WeaponDefault<T extends ListItem<any>> extends Default<T> {
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