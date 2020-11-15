import {
    AttributeData,
    config,
    EquipmentData,
    HitLocationData,
    MeleeWeaponData,
    PoolData,
    RangedWeaponData,
    SkillBonus,
    SkillData,
    SpellData,
    TechniqueData,
    TraitData
} from "@internal";

export interface KeyList<T = any> { [key: string]: T }

export interface Config {
    UI: {
        rolling: boolean
    }
    rulesets: {
        useMultiplicativeModifiers: boolean
        useKnowingYourOwnStrength: boolean
        useReducedSwingDamage: boolean
        useNoSchoolGrognardReducedSwingDamage: boolean
    },
    attributes: KeyList<AttributeData>
    pools: KeyList<PoolData>
    locations: KeyList<HitLocationData>
}


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
    levels: number
}
export type FeatureBonuses = AttributeBonus | SkillBonus | ArmorBonus | ReactionBonus;

export const defaultFeatureData = () => ({
    disabled: false,
    bonuses: [],
    templates: [],
    categories: [],
});
export interface AttributeBonus extends FeatureBonus {

}
export interface ReactionBonus extends FeatureBonus {
    type: FeatureBonusType.Reaction
}
export interface ArmorBonus extends FeatureBonus {
    type: FeatureBonusType.Armor
    location: string
    amount: number
}


