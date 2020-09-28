import { Character, Signature, Featurable } from "./character/character";
import { Skill, Difficulty, SkillDefault, SkillLike, SkillList } from "./character/skill/skill";
import { Trait, TraitType, TraitList, TraitModifier } from "./character/trait/trait";
import { Spell, SpellList } from "./character/spell";
import { Equipment, EquipmentList, EquipmentModifier } from "./character/equipment/equipment";

import { Serializer, registerSerializer } from "./externals/serializer"
import { isArray, json } from "@utils/json_utils";
import { Feature, SkillBonus, DRBonus } from "@character/misc/feature";
import { MeleeWeapon, RangedWeapon, Weapon } from "@character/weapon";
import { List, ListItem } from "@character/misc/list";
import { AttributeBonus, Attribute } from "@character/attribute";
import { FeatureType } from "@character/misc/feature";
import { GCSJSON } from "./externals/gcs_json"
import { TehchniqueDifficulty, Technique } from "@character/technique";

import defaultConfig from "@character/config.json";

export {
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
    isArray,
    json,
    Feature,
    FeatureType,
    Featurable,
    List,
    ListItem,
    GCSJSON,
    defaultConfig
}