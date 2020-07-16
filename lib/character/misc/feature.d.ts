import { CharacterElement } from "./element";
import { Featurable } from "../character";
import { json } from "../../utils/json_utils";
export declare enum FeatureType {
    attributeBonus = "attribute_bonus",
    damageResistanceBonus = "dr_bonus",
    skillBonus = "skill_bonus",
    weaponDamageBonus = "weapon_bonus",
    reactionBonus = "reaction_bonus",
    spell_bonus = "spell_bonus",
    containedWeightReduction = "contained_weight_reduction",
    costReduction = "cost_reduction"
}
export declare abstract class Feature<T extends Featurable> extends CharacterElement<T> {
    amount: number;
    leveled: boolean;
    limitation: false | string;
    owner: T;
    type: FeatureType;
    registered: boolean;
    constructor(owner: T, type: FeatureType);
    unregister(): void;
    ownerOwnedBy(owner: T): Boolean;
    toJSON(): void;
    loadJSON(object: string | json): void;
}
