import { CharacterElement } from "./element";
import { Featurable } from "../character";
import { objectify, json } from "@utils/json_utils";
import { FeatureType } from "@gcs/gcs";
import { SkillLike } from "@character/skill";
import { AttributeBonus } from "@character/attribute";
import { Weapon } from "@character/weapon";
import { StringCompare, stringCompare } from "@utils/string_utils";
import * as gcs from "@gcs/gcs";

export class FeatureList {
    features: Map<string, Feature<Featurable>>
    weapons: Map<string, Weapon<Featurable>>

    constructor() {
        this.features = new Map();
        this.weapons = new Map();
    }

    registerFeature(feature: Feature<Featurable>) {
        this.features.set(feature.uuid, feature);
    }
    removeFeature(uuid: string) {
        this.features.delete(uuid);
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
    iter() { return Array.from(this.features.values()) }
    getFeaturesByType(type: FeatureType) {
        return this.iter().filter(feature => feature.type === type)
    }
}

export abstract class Feature<T extends Featurable> extends CharacterElement<T> {
    tag = "feature"
    amount: number
    leveled: boolean
    limitation: false | string

    owner: T
    type: FeatureType

    registered: boolean

    constructor(owner: T, type: FeatureType) {
        super(owner.character);
        this.owner = owner;
        owner.features.add(this);
        this.type = type;
        this.owner.list.character.featureList.registerFeature(this);
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
                break
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
    selectionType: string
    nameCompareType: StringCompare
    name: string
    specializationCompareType: StringCompare
    specialization: string
    category: string
    categoryCompareType: StringCompare

    constructor(owner: T) {
        super(owner, gcs.FeatureType.skillBonus);
    }

    isApplicableTo(skill: SkillLike<any>): boolean {
        let result = false;

        if (this.nameCompareType) result = stringCompare(this.name, skill.name, this.nameCompareType);
        if (this.specializationCompareType) result = stringCompare(this.specialization, skill.specialization, this.specializationCompareType);

        return result
    }
}