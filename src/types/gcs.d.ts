declare namespace gcs {
    interface Profile {
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

    enum FeatureType {
        attributeBonus = "attribute_bonus",
        damageResistanceBonus = "dr_bonus",
        skillBonus = "skill_bonus",
        weaponDamageBonus = "weapon_bonus",
        reactionBonus = "reaction_bonus",
        spell_bonus = "spell_bonus",
        containedWeightReduction = "contained_weight_reduction",
        costReduction = "cost_reduction"
    }

    type LooseList<T> = T[] | Iterable<T>;

    interface Prerequisite<T> {

    }

    interface Validitable<T> {
        prereqs: LooseList<Prerequisite<T>>
    }

    interface Notable {
        reference: string
        notes: string
    }

    interface Categorized {
        categories: LooseList<string>
    }

    interface Feature {
        type: FeatureType
        amount: number
    }

    interface Modifier extends Notable {
        version: number
        disabled: boolean
        name: string
    }

    interface Modifiable<T extends Modifier> {
        modifiers: LooseList<T>
    }

    interface Weaponized {
        weapons: LooseList<Weapon>
    }

    interface Featurable {
        features: LooseList<Feature>
    }

    interface Default {
        type: string
        modifier: number
    }

    interface Weapon {
        type: string
        damage: {
            type: string
            base: string
        }
        strength: string
        defaults: LooseList<WeaponDefault>
    }

    interface MeleeWeapon extends Weapon {
        usage: string
        reach: string
        parry: string
        block: string
    }

    interface RangedWeapon extends Weapon {
        accuracy: string
        range: string
        rate_of_fire: string
        shots: string
        bulk: string
        recoil: string
    }

    interface WeaponDefault extends Default {

    }

    interface ListItem<T extends ListItem<T>> {
        type: string
        version: number
        open: boolean
        children: LooseList<ListItem<T>>
    }

    interface SkillLike extends ListItem<SkillLike>, Weaponized, Featurable, Categorized, Notable {
        name: string
        difficulty: string
        points: number
    }

    interface SkillDefault extends Default {
        name?: string
        specialization?: string

    }

    interface DefaultedFrom extends SkillDefault {

    }

    interface Skill extends SkillLike {
        tech_level: string
        specialization: string
        defaulted_from: DefaultedFrom
        encumbrance_penalty_multiplier: number
        defaults: LooseList<SkillDefault>
    }

    interface Technique extends SkillLike {
        type: "technique"
        limit: number
        default: SkillDefault
    }

    interface ItemModifier extends Modifier {

    }

    interface Equipment extends ListItem<Equipment>, Weaponized, Featurable, Notable, Categorized, Modifiable<ItemModifier> {
        type: "equipment" | "equipment_container"
        quantity: number
        equipped: boolean
        weight: number
        value: number
        description: string
        tech_level: string
        legality_class: string
    }

    interface TraitModifier extends Modifier {
        affects: string
        cost_type: string
        cost: number
    }

    interface Trait extends ListItem<Trait>, Weaponized, Featurable, Modifiable<TraitModifier> {
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

    interface Spell extends ListItem<Spell>, SkillLike {
        type: "spell" | "spell_container"
        college: string
        power_source: string
        spell_class: string
        casting_cost: string
        maintenance_cost: string
        casting_time: string
        duration: string
    }

    interface Note extends ListItem<Note>, Notable, Featurable {
        type: "note" | "note_container"
        text: string
    }
}