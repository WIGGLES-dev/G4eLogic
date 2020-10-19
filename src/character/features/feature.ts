import { Character } from "@character/character";
import { Observable } from "@character/general/observable";
import { CharacterElement, OwnedElement } from "@character/misc/element";
import { ListItem } from "@character/misc/list";
import { Weapon } from "@character/weapon";
import { AttributeBonus } from "./modules/AttributeBonus";

export class FeatureList {
    character: Character

    features: Map<string, Feature> = new Map()
    weapons: Map<string, Weapon> = new Map()

    constructor(character: Character) {
        this.character = character
    }

    registerFeature(feature: Feature) {
        this.features.set(feature.uuid, feature);
    }
    removeFeature(feature: Feature) {
        this.features.delete(feature.uuid);
    }
    registerWeapon(weapon: Weapon) {
        this.weapons.set(weapon.uuid, weapon);
    }
    removeWeapon(uuid: string) {
        this.weapons.delete(uuid);
    }
    getFeaturesByType(type: typeof FeatureCore) {
        return Array.from(this.features.values()).filter(feature => feature.core instanceof type)
    }
    empty() {
        this.weapons.clear();
        this.features.clear();
    }
}

export class Feature<T extends ListItem = ListItem> extends OwnedElement<T> {
    static keys = ["amount", "leveled"]

    amount = 0
    leveled = false

    #featureCore: FeatureCore

    constructor(owner: T) {
        super(owner, Feature.keys);
        this.owner.features.add(this);
        this.owner.character.featureList.registerFeature(this)
        this.#featureCore = new AttributeBonus(this);
    }

    get core() { return this.#featureCore }

    get type() { return this.#featureCore.constructor as typeof FeatureCore }
    set type(type) {
        if (type instanceof FeatureCore) {
            this.#featureCore = type
        } else {
            try {
                //@ts-ignore
                this.#featureCore = new type(this)
            } catch (err) {
                //@ts-ignore
                this.#featureCore = new type.constructor(this);
            }
        }
        this.dispatch();
    }

    validFor(target: ListItem) { return this.#featureCore.validFor(target) }

    ownerIsActive() { return this.owner.isActive() }

    /**
    * Returns the applicable bonus taking into account the leveled traits. Featurable elements must impliment a getLevel method and
    * the properties leveled and hasLevels
    */
    getBonus(): number { return this.leveled && this.owner.hasLevels ? this.amount * this.owner.getLevel() : this.amount }

    delete() {
        this.getCharacter().featureList.removeFeature(this);
        this.owner.features.delete(this);
        super.delete();
    }
}

export abstract class FeatureCore extends OwnedElement {

    constructor(feature: Feature, keys = []) {
        super(feature, keys);
    }

    get feature() { return this.owner }

    abstract validFor(target: ListItem): boolean
}