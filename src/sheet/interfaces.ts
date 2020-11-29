import {
    EquipmentData,
    MeleeWeaponData,
    RangedWeaponData,
    SkillBonus,
    SkillData,
    SpellData,
    TechniqueData,
    TraitData
} from "@internal";

export enum Signatures {

}

export type Features = SkillData | TechniqueData | SpellData | TraitData | EquipmentData | MeleeWeaponData | RangedWeaponData
export enum FeatureType {
    Skill = "skill",
    Technique = "technique",
    Spell = "spell",
    Trait = "trait",
    Equipment = "equipment",
    MeleeWeapon = "melee weapon",
    RangedWeapon = "ranged weapon"
}

export enum FeatureBonusType {
    Skill = "skill bonus",
    Armor = "armor bonus",
    Reaction = "reaction bonus",
    Attribute = "attribute bonus"
}
export interface FeatureBonus {
    type: FeatureBonusType
    leveled: boolean
    amount: number
}
export type FeatureBonuses = AttributeBonus | SkillBonus | ArmorBonus | ReactionBonus;

export interface AttributeBonus extends FeatureBonus {
    type: FeatureBonusType.Attribute
    attribute: string
}
export interface ReactionBonus extends FeatureBonus {
    type: FeatureBonusType.Reaction
}
export interface ArmorBonus extends FeatureBonus {
    type: FeatureBonusType.Armor
    location: string
    amount: number
}