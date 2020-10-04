import { CharacterElement } from "./element";
import { Character } from "../character";
import { SkillLike } from "@character/skill/skill";
import { AttributeBonus } from "@character/attribute";
import { Weapon } from "@character/weapon";
import { StringCompare, stringCompare } from "@utils/string_utils";
import { Collection } from "./collection";
import { ListItem } from "./list";

export enum FeatureType {
    attributeBonus = "attribute_bonus",
    damageResistanceBonus = "dr_bonus",
    skillBonus = "skill_bonus",
    weaponDamageBonus = "weapon_bonus",
    reactionBonus = "reaction_bonus",
    spellBonus = "spell_bonus",
    containedWeightReduction = "contained_weight_reduction",
    costReduction = "cost_reduction"
}

export class FeatureList {
    character: Character

    features: Map<string, Feature<any>> = new Map()
    weapons: Map<string, Weapon<any>> = new Map()

    constructor(character: Character) {
        this.character = character
    }

    registerFeature(feature: Feature<any>) {
        this.features.set(feature.uuid, feature);
    }

    removeFeature(uuid: string) {
        this.features.delete(uuid);
    }
    registerWeapon(weapon: Weapon<any>) {
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

    getFeaturesByType<T extends FeatureType>(type: T) {
        return Array.from(this.features.values()).filter(feature => feature.type === type)
    }

    empty() {
        this.weapons.clear();
        this.features.clear();
    }
}

export class Feature<T extends ListItem = ListItem> extends CharacterElement {
    static keys = ["amount", "leveled"]

    tag = "feature"

    amount: number = 0
    leveled: boolean = false
    static type: FeatureType

    Feature: typeof Feature = AttributeBonus

    owner: T
    registered: boolean

    constructor(owner: T, keys: string[] = []) {
        super(owner.character, [...keys, ...Feature.keys]);
        this.owner = owner;
        owner.features.add(this);
        this.owner.list.character.featureList.registerFeature(this);
    }

    get type() { return (this.constructor as typeof Feature).type }
    set type(type: FeatureType) {
        if (this.type === type) return
        Feature.loadFeature(this.owner, type).setValue(this);
        this.delete();
    }

    dispatch() {
        this.owner.dispatch();
        super.dispatch();
    }

    delete() {
        this.owner.list.character.featureList.removeFeature(this.uuid);
        this.owner.features.delete(this);
        this.owner.dispatch();
        super.delete();
    }

    ownerIsActive(): boolean {
        return this.owner.isActive()
    }

    /**
     * Returns the applicable bonus taking into account the leveled traits. Featurable elements must impliment a getLevel method and
     * the properties leveled and hasLevels
     */
    getBonus(): number { return this.leveled && this.owner.hasLevels ? this.amount * this.owner.getLevel() : this.amount }

    load(data: any, ...args) {
        return this.getSerializer().transform(this.tag, "load")(this, data, ...args)
    }
    save(data: any, ...args) {
        return this.getSerializer().transform(this.tag, "save")(this, data, ...args)
    }

    static loadFeature<T extends ListItem>(owner: T, featureType: FeatureType = FeatureType.attributeBonus): Feature<T> {
        switch (featureType) {
            case FeatureType.attributeBonus:
                return new AttributeBonus(owner)
            case FeatureType.containedWeightReduction:
                break
            case FeatureType.costReduction:
                break
            case FeatureType.damageResistanceBonus:
                return new DRBonus(owner);
            case FeatureType.reactionBonus:
                break
            case FeatureType.skillBonus:
                return new SkillBonus(owner)
            case FeatureType.spellBonus:
                break
            case FeatureType.weaponDamageBonus:
                break
            default:
                return null
        }
    }
}

enum SkillBonusSelectionType {

}

export class SkillBonus<T extends ListItem = ListItem> extends Feature<T> {
    static keys = []
    static type = FeatureType.skillBonus

    selectionType: SkillBonusSelectionType

    nameCompareType: StringCompare
    name: string
    specializationCompareType: StringCompare
    specialization: string
    category: string
    categoryCompareType: StringCompare

    constructor(owner: T, keys: string[] = []) {
        super(owner, [...keys, ...SkillBonus.keys]);
    }

    isApplicableTo(skill: SkillLike): boolean {
        let nameCompare = true;
        let specializationCompare = true;
        let categoryCompare = true;

        if (this.nameCompareType) nameCompare = stringCompare(this.name, skill.name, this.nameCompareType);
        if (this.specializationCompareType) specializationCompare = stringCompare(this.specialization, skill.specialization, this.specializationCompareType);

        return nameCompare && specializationCompare && categoryCompare
    }
}

export class DRBonus<T extends ListItem = ListItem> extends Feature<T> {
    static keys = ["location"]
    static type = FeatureType.damageResistanceBonus

    location: string

    constructor(owner: T, keys: string[] = []) {
        super(owner, [...keys, ...DRBonus.keys]);
    }
}