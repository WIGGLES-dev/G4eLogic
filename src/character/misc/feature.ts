import { CharacterElement } from "./element";
import { Featurable } from "../character";
import { objectify, json } from "@utils/json_utils";
import { FeatureType } from "@gcs/gcs";
import { SkillLike } from "@character/skill/skill";
import { AttributeBonus } from "@character/attribute";
import { Weapon } from "@character/weapon";
import { StringCompare, stringCompare } from "@utils/string_utils";
import * as gcs from "@gcs/gcs";
import { Collection } from "./collection";

export class FeatureList {
    features: Collection<string, Feature<Featurable>> = new Collection()
    weapons: Collection<string, Weapon<Featurable>> = new Collection()

    constructor() {

    }

    registerFeature(feature: Feature<Featurable>) {
        this.features.set(feature.uuid, feature);
    }
    removeFeature(uuid: string) {
        this.features.delete(uuid);
    }
    registerWeapon(weapon: Weapon<Featurable>) {
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
        return this.features.filter(feature => feature.type === type)
    }

    empty() {
        this.weapons.clear();
        this.features.clear();
    }
}

export abstract class Feature<T extends Featurable> extends CharacterElement<T> {
    static keys = ["amount", "leveled", "limitation", "type"]

    tag = "feature"

    amount: number
    leveled: boolean
    limitation: false | string
    type: FeatureType

    owner: T
    registered: boolean

    constructor(owner: T, keys: string[]) {
        super(owner.character, [...keys, ...Feature.keys]);
        this.owner = owner;
        owner.features.add(this);
        this.owner.list.character.featureList.registerFeature(this);
    }

    getType(): string {
        //@ts-ignore
        return this.constructor.type
    }

    ownerIsActive(): boolean {
        return this.owner.isActive()
    }

    getBonus(): number { return this.leveled && this.owner.hasLevels ? this.amount * this.owner.getLevel() : this.amount }

    unregister() {
        this.owner.list.character.featureList.removeFeature(this.uuid);
    }
    save() {
        return this.getSerializer().transformers.get(this.tag).save(this)
    }
    load(data: any) {
        return this.getSerializer().transformers.get(this.tag).load(this, data)
    }

    static loadFeature<T extends Featurable>(owner: T, featureType: FeatureType): Feature<T> {
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

export class SkillBonus<T extends Featurable> extends Feature<T> {
    static keys = []
    static type = FeatureType.skillBonus

    selectionType: string
    nameCompareType: StringCompare
    name: string
    specializationCompareType: StringCompare
    specialization: string
    category: string
    categoryCompareType: StringCompare

    constructor(owner: T, keys: string[] = []) {
        super(owner, [...keys, ...SkillBonus.keys]);
    }

    isApplicableTo(skill: SkillLike<any>): boolean {
        let result = false;

        if (this.nameCompareType) result = stringCompare(this.name, skill.name, this.nameCompareType);
        if (this.specializationCompareType) result = stringCompare(this.specialization, skill.specialization, this.specializationCompareType);

        return result
    }
}

export class DRBonus<T extends Featurable> extends Feature<T> {
    static keys = ["location"]
    static type = FeatureType.damageResistanceBonus

    location: string

    constructor(owner: T, keys: string[] = []) {
        super(owner, [...keys, ...DRBonus.keys]);
    }
}