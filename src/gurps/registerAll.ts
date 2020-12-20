import {
    Equipment,
    Skill,
    Spell,
    Technique,
    Trait,
    Character,
    RangedWeapon,
    MeleeWeapon,
    Registry
} from "@internal";

import characterSchema from "./config/character.json";
import equipmentSchema from "./config/equipment.json";
import skillSchema from "./config/skill.json";
import techniqueSchema from "./config/technique.json";
import spellSchema from "./config/spell.json";
import traitSchema from "./config/trait.json";
import attributeSchema from "./config/attribute.json";
import hitLocationSchema from "./config/hitLocation.json";
import definitions from "./config/definitions.json";
import meleeWeaponSchema from "./config/meleeWeapon.json";
import rangedWeaponSchema from "./config/rangedWeapon.json";

const resources = [
    {
        type: "character",
        cast: Character,
        schema: characterSchema,
    },
    {
        type: "equipment",
        cast: Equipment,
        schema: equipmentSchema
    },
    {
        type: "skill",
        cast: Skill,
        schema: skillSchema
    },
    {
        type: "spell",
        cast: Spell,
        schema: spellSchema
    },
    {
        type: "technique",
        cast: Technique,
        schema: techniqueSchema
    },
    {
        type: "trait",
        cast: Trait,
        schema: traitSchema
    },
    {
        type: "melee weapon",
        cast: MeleeWeapon,
        schema: meleeWeaponSchema
    },
    {
        type: "ranged weapon",
        cast: RangedWeapon,
        schema: rangedWeaponSchema
    }
]
try {
    Registry
        .register(...resources);
} catch (err) {
    console.error(err);
}
try {
    Registry.validator
        .addSchema(definitions, "definitions")
        .addSchema(hitLocationSchema, "hitLocation")
        .addSchema(attributeSchema, "attribute")
} catch (err) {
    console.error(err, "error at registering extraneous schemas");
}
