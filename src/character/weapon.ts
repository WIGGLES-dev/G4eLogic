import { Featurable } from "./character";
import { objectify, json } from "@utils/json_utils";
import { ListItem } from "./misc/list";
import { Default } from "./misc/default";

export abstract class Weapon<T extends Featurable> {
    owner: T

    constructor(owner: T) {
        this.owner = owner;
    }
    toJSON() {

    }
    loadJSON(object: string | json) {
        object = objectify<json>(object);
    }
}

class MeleeWeapon<T extends Featurable> extends Weapon<T> {

}

class RangedWeapon<T extends Featurable> extends Weapon<T> {

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