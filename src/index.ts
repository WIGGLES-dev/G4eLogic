import { Character, Signature } from "./character/character";
import { Skill, Difficulty, SkillDefault, SkillLike, SkillList } from "./character/skill/skill";
import { Trait, TraitType, TraitList, TraitModifier } from "./character/trait/trait";
import { Spell, SpellList } from "./character/spell";
import { Equipment, EquipmentList, EquipmentModifier } from "./character/equipment/equipment";

import { Serializer, registerSerializer } from "./externals/serializer"
import { Feature, SkillBonus, DRBonus } from "@character/misc/feature";
import { MeleeWeapon, RangedWeapon, Weapon } from "@character/weapon";
import { List, ListItem } from "@character/misc/list";
import { AttributeBonus, Attribute } from "@character/attribute";
import { FeatureType } from "@character/misc/feature";
import { GCSJSON } from "./externals/gcs_json"
import { TehchniqueDifficulty, Technique } from "@character/technique";

import defaultConfig from "@character/config.json";

import App from "@ui/App.svelte";

export {
    App,
    Attribute,
    AttributeBonus,
    Weapon,
    MeleeWeapon,
    RangedWeapon,
    Character,
    Signature,
    Skill,
    Difficulty,
    SkillDefault,
    SkillLike,
    SkillList,
    SkillBonus,
    Trait,
    TraitType,
    TraitList,
    TraitModifier,
    Spell,
    SpellList,
    Technique,
    TehchniqueDifficulty,
    Equipment,
    DRBonus,
    EquipmentList,
    EquipmentModifier,

    Serializer,
    registerSerializer,
    GCSJSON,

    Feature,
    FeatureType,
    List,
    ListItem,

    defaultConfig
}