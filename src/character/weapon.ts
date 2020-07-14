import { Featurable } from "./character";

export abstract class Weapon<T extends Featurable> {
    owner: T

    constructor(owner: T) {
        this.owner = owner;
    }
    toJSON() {

    }
    loadJSON() {

    }
}

class MeleeWeapon<T extends Featurable> extends Weapon<T> {

}

class RangedWeapon<T extends Featurable> extends Weapon<T> {

}