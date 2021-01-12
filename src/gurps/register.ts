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
import Editor from '@ui/Editors/Editor.svelte';
import Home from '@ui/Home.svelte';
import Main from '@ui/Main.svelte';
import View from '@components/View.svelte';
const resources = [
    {
        type: "character",
        caster: Character,
        schema: `systems/gurps/character.yaml`,
    },
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
    System.components.set('editor', Editor);
    System.components.set('home', Home);
    System.components.set('main', Main);
    System.components.set('view', View);
    try {
        await System.register(...resources);
    } catch (err) {
        console.error(err);
    }
}