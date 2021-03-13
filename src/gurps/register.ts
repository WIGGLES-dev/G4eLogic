import {
    Equipment,
    Skill,
    Spell,
    Technique,
    Trait,
    Character,
    RangedWeapon,
    MeleeWeapon,
    System
} from "@internal";
const resources = [
    {
        type: "equipment",
        caster: Equipment,
        schema: `systems/gurps/equipment.yaml`
    },
    {
        type: "skill",
        caster: Skill,
        schema: `systems/gurps/skill.yaml`
    },
    {
        type: "spell",
        caster: Spell,
        schema: 'systems/gurps/spell.yaml'
    },
    {
        type: "technique",
        caster: Technique,
        schema: 'systems/gurps/technique.yaml'
    },
    {
        type: "trait",
        caster: Trait,
        schema: 'systems/gurps/trait.yaml'
    },
    {
        type: "character",
        caster: Character,
        schema: `systems/gurps/character.yaml`,
    },
    {
        type: "melee weapon",
        caster: MeleeWeapon,
        schema: 'systems/gurps/meleeWeapon.yaml'
    },
    {
        type: "ranged weapon",
        caster: RangedWeapon,
        schema: 'systems/gurps/rangedWeapon.yaml'
    }
];
export async function register() {
    try {
        await System.register(...resources);
    } catch (err) {
        console.error(err);
    }
}