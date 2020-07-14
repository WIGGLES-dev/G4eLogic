import { stringToTemplate, stringToFragment } from "../../utils/element_utils";
import { CharacterElement } from "./element";
import { ListItem } from "./list";
import { Featurable } from "../character";

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
    loadXML(element: string | Element) {
        element = stringToTemplate(element);
        this.amount = parseFloat(element.querySelector(":scope > amount")?.textContent ?? "0");
        this.leveled = element.querySelector(":scope > amount")?.getAttribute("per_level") === "yes";
        this.limitation = element.querySelector(":scope > attribute")?.getAttribute("limitation") ?? false;
    }
    toXML() {
        return document.createElement("test");
    }
    loadJSON(object: any) {
        this.amount = object.amount;
        this.leveled = object?.per_level ?? false;
        this.limitation = object?.limitation ?? false;
    }
    toJSON() {

    }
}