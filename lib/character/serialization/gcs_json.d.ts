import { Serializer } from "./serializer";
import { Skill } from "../../character/skill";
import { Technique } from "../../character/technique";
import { Spell } from "../../character/spell";
import { Equipment } from "../../character/equipment";
import { Trait } from "../../character/trait";
import * as gcs from "@gcs/gcs";
import { json } from "@utils/json_utils";
import { Character } from "@character/character";
export declare class GCSJSON extends Serializer {
    constructor();
    private static mapSkillLike;
    mapSkill(skill: Skill, data?: gcs.Skill): gcs.Skill[];
    mapTechnique(technique: Technique, data?: gcs.Technique): any;
    mapSpell(spell: Spell, data?: gcs.Spell): json[];
    mapEquipment(equipment: Equipment, data?: gcs.Equipment): gcs.Equipment[];
    mapTrait(trait: Trait, data?: json): json[];
    load(character: Character, data: any): Character;
}
