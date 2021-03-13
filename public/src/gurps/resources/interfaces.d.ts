import { SkillBonus } from "@internal";
export declare enum FeatureBonusType {
    Skill = "skill bonus",
    Armor = "armor bonus",
    Reaction = "reaction bonus",
    Attribute = "attribute bonus"
}
export interface FeatureBonus {
    type: FeatureBonusType;
    leveled: boolean;
    amount: number;
}
export declare type FeatureBonuses = AttributeBonus | SkillBonus | ArmorBonus | ReactionBonus;
export interface AttributeBonus extends FeatureBonus {
    type: FeatureBonusType.Attribute;
    attribute: string;
}
export interface ReactionBonus extends FeatureBonus {
    type: FeatureBonusType.Reaction;
}
export interface ArmorBonus extends FeatureBonus {
    type: FeatureBonusType.Armor;
    location: string;
    amount: number;
}
