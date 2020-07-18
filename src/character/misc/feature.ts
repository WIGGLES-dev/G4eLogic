import { CharacterElement } from "./element";
import { ListItem } from "./list";
import { Featurable } from "../character";
import { objectify, json } from "../../utils/json_utils";

export enum FeatureType {
    attributeBonus = "attribute_bonus",
    damageResistanceBonus = "dr_bonus",
    skillBonus = "skill_bonus",
    weaponDamageBonus = "weapon_bonus",
    reactionBonus = "reaction_bonus",
    spell_bonus = "spell_bonus",
    containedWeightReduction = "contained_weight_reduction",
    costReduction = "cost_reduction"
}

export abstract class Feature<T extends Featurable> extends CharacterElement<T> {
    amount: number
    leveled: boolean
    limitation: false | string

    owner: T
    type: FeatureType

    registered: boolean

    constructor(owner: T, type: FeatureType) {
        super();
        this.owner = owner;
        this.type = type;
        this.owner.list.character.featureList.registerFeature(this);
    }
    unregister() {
        this.owner.list.character.featureList.removeFeature(this.uuid);
    }
    ownerOwnedBy(owner: T): Boolean {
        if (this.owner.uuid === owner.uuid) {
            return true
        }
        if (owner.containedBy && owner.containedBy.uuid === this.owner.uuid) {

        } else {
            return false
        }
    }
    toJSON() {

    }
    loadJSON(object: string | json) {
        object = objectify<json>(object);
        super.loadJSON(object);
        this.amount = object.amount;
        this.leveled = object?.per_level ?? false;
        this.limitation = object?.limitation ?? false;
    }
}