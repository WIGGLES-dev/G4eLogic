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
    getFeaturesByUUID(id: string) {
        return Array.from(this.features.values()).filter(feature => {
            if (feature.owner.uuid = id) {
                return true
            } else {
                return false
            }
        });
    }

    getFeaturesByType(type: typeof FeatureCore) {
        return Array.from(this.features.values()).filter(feature => feature.type instanceof type)
    }

    empty() {
        this.weapons.clear();
        this.features.clear();
    }
}

export class Feature<T extends ListItem = ListItem> extends OwnedElement<T> {
    static keys = ["amount", "leveled"]

    static tag = "feature"
    amount = 0
    leveled = false

    #type: FeatureCore

    constructor(owner: T) {
        super(owner, Feature.keys);
        this.owner.features.add(this);
        this.owner.character.featureList.registerFeature(this)
        this.#type = new AttributeBonus(this);
    }

    get type() { return this.#type }
    set type(type) {
        try {
            //@ts-ignore
            this.#type = new type(this)
        } catch (err) {
            //@ts-ignore
            this.#type = new type.constructor(this);
        }
        this.dispatch();
    }

    validFor(target: ListItem) { return this.type.validFor(target) }

    ownerIsActive() { return this.owner.isActive() }

    /**
    * Returns the applicable bonus taking into account the leveled traits. Featurable elements must impliment a getLevel method and
    * the properties leveled and hasLevels
    */
    getBonus(): number { return this.leveled && this.owner.hasLevels ? this.amount * this.owner.getLevel() : this.amount }

    delete() {
        this.owner.list.character.featureList.removeFeature(this);
        this.owner.features.delete(this);
        this.owner.dispatch();
        super.delete();
    }

    load(data: any, ...args) {
        return this.getSerializer().transform(Feature.tag, "load")(this, data, ...args)
    }
    save(data: any, ...args) {
        return this.getSerializer().transform(Feature.tag, "save")(this, data, ...args)
    }
}

export abstract class FeatureCore extends Observable {
    feature: Feature

    constructor(feature: Feature, keys = []) {
        super(keys);
        this.feature = feature;
    }

    dispatch() {
        this.feature.dispatch();
        super.dispatch();
    }

    abstract validFor(target: ListItem): boolean
}