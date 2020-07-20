export module gcs {
}
export interface Profile {
    size_modifier: string
    tech_level: string
    birthday: string
    name: string
    eyes: string
    skin: string
    hair: string
    handedness: string
    weight: string
    height: string
    gender: string
    race: string
    body_type: string
    age: string
    portrait: string
}

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

export type LooseList<T> = T[] | Set<T>;

export interface Prerequisite<T> {

}

export interface Validitable<T> {
    prereqs: LooseList<Prerequisite<T>>
}

export interface Notable {
    reference: string
    notes: string
}

export interface Categorized {
    categories: LooseList<string>
}

export interface Feature {
    type: FeatureType
    amount: number
}

export interface Modifier extends Notable {
    version: number
    disabled: boolean
    name: string
}

export interface Modifiable<T extends Modifier> {
    modifiers: LooseList<T>
}

export interface Weaponized {
    weapons: LooseList<Weapon>
}

export interface Featurable {
    features: LooseList<Feature>
}

export interface Default {
    type: string
    modifier: number
}

export interface Weapon {
    type: string
    damage: {
        type: string
        base: string
    }
    strength: string
    defaults: LooseList<WeaponDefault>
}

export interface MeleeWeapon extends Weapon {
    usage: string
    reach: string
    parry: string
    block: string
}

export interface RangedWeapon extends Weapon {
    accuracy: string
    range: string
    rate_of_fire: string
    shots: string
    bulk: string
    recoil: string
}

export interface WeaponDefault extends Default {

}

export interface ListItem<T extends ListItem<T>> {
    type?: string
    tag: string
    version: number
    open: boolean
    children: LooseList<ListItem<T>>
}

export interface SkillLike extends ListItem<SkillLike>, Weaponized, Featurable, Categorized, Notable {
    name: string
    difficulty: string
    points: number
}

export interface SkillDefault extends Default {
    name?: string
    specialization?: string

}

export interface DefaultedFrom extends SkillDefault {

}

export interface Skill extends SkillLike {
    tech_level: string
    specialization: string
    defaulted_from: DefaultedFrom
    encumbrance_penalty_multiplier: number
    defaults: LooseList<SkillDefault>
}

export interface Technique extends SkillLike {
    type: "technique"
    limit: number
    default: SkillDefault
}

export interface ItemModifier extends Modifier {

}

export interface Equipment extends ListItem<Equipment>, Weaponized, Featurable, Notable, Categorized, Modifiable<ItemModifier> {
    type: "equipment" | "equipment_container"
    quantity: number
    equipped: boolean
    weight: string
    value: string
    description: string
    tech_level: string
    legality_class: string
}

export interface TraitModifier extends Modifier {
    affects: string
    cost_type: string
    cost: number
}

export interface Trait extends ListItem<Trait>, Weaponized, Featurable, Modifiable<TraitModifier> {
    type: "advantage" | "advantage_container"
    name: string
    enabled: boolean
    physical: boolean
    exotic: boolean
    mental: boolean
    supernatural: boolean
    social: boolean
    base_points: number
    round_down: number
    cr: number
    levels: number
    allow_half_levels: boolean

    points_per_level: number
}

export interface Spell extends ListItem<Spell>, SkillLike {
    type: "spell" | "spell_container"
    college: string
    power_source: string
    spell_class: string
    casting_cost: string
    maintenance_cost: string
    casting_time: string
    duration: string
}

export interface Note extends ListItem<Note>, Notable, Featurable {
    type: "note" | "note_container"
    text: string
}