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
import characterSchema from "./config/character.yaml";
import defaultCharacterConfig from './config/characterConfig.yaml';
import equipmentSchema from "./config/equipment.yaml";
import skillSchema from "./config/skill.yaml";
import techniqueSchema from "./config/technique.yaml";
import spellSchema from "./config/spell.yaml";
import traitSchema from "./config/trait.yaml";
import attributeSchema from "./config/attribute.yaml";
import hitLocationSchema from "./config/hitLocation.yaml";
import definitions from "./config/definitions.yaml";
import meleeWeaponSchema from "./config/meleeWeapon.yaml";
import rangedWeaponSchema from "./config/rangedWeapon.yaml";
characterSchema.properties.config.default = defaultCharacterConfig;
import Editor from '@ui/Editors/Editor.svelte';
import Home from '@ui/Home.svelte';
import Main from '@ui/Main.svelte';
import View from '@components/View.svelte';
System.components.set('editor', Editor);
System.components.set('home', Home);
System.components.set('main', Main)
System.components.set('view', View)
const resources = [
    {
        type: "character",
        caster: Character,
        schema: characterSchema,
    },
    {
        type: "equipment",
        caster: Equipment,
        schema: equipmentSchema
    },
    {
        type: "skill",
        caster: Skill,
        schema: skillSchema
    },
    {
        type: "spell",
        caster: Spell,
        schema: spellSchema
    },
    {
        type: "technique",
        caster: Technique,
        schema: techniqueSchema
    },
    {
        type: "trait",
        caster: Trait,
        schema: traitSchema
    },
    {
        type: "melee weapon",
        caster: MeleeWeapon,
        schema: meleeWeaponSchema
    },
    {
        type: "ranged weapon",
        caster: RangedWeapon,
        schema: rangedWeaponSchema
    }
]
try {
    System
        .register(...resources);
} catch (err) {
    console.error(err);
}
try {
    System.validator
        .addSchema(definitions, "definitions")
        .addSchema(hitLocationSchema, "hitLocation")
        .addSchema(attributeSchema, "attribute")
} catch (err) {
    console.error(err, "error at registering extraneous schemas");
}