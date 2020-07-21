import { registerDataType, Serializer } from "./serializer";
import { Skill, Difficulty, SkillDefault, SkillLike } from "../../character/skill";
import { Technique, TehchniqueDifficulty } from "../../character/technique";
import { Spell } from "../../character/spell";
import { Equipment, EquipmentModifier } from "../../character/equipment";
import { Trait, TraitType, TraitModifier } from "../../character/trait";
import * as gcs from "@gcs/gcs";
import { isArray, json, objectify } from "@utils/json_utils";
import { Signature, Character } from "@character/character";
import { Feature } from "@character/misc/feature";

@registerDataType(GCSJSON)
export class GCSJSON extends Serializer {

    constructor() {
        super();
    }

    private static mapSkillLike(skillLike: SkillLike<any>, data?: gcs.SkillLike) {
        skillLike.name = data.name;
        skillLike.difficulty = data.difficulty as Difficulty;
        skillLike.points = data.points;
    }

    mapSkill(skill: Skill, data?: gcs.Skill) {
        GCSJSON.mapSkillLike(skill, data);
        skill.difficulty = data.difficulty?.split("/")[1] as Difficulty;
        skill.signature = data.difficulty?.split("/")[0] as Signature;
        skill.techLevel = data.tech_level ?? "";
        if (data.encumbrance_penalty_multiplier) skill.encumbrancePenaltyMultiple = data.encumbrance_penalty_multiplier;
        if (data.defaulted_from) skill.defaultedFrom = new SkillDefault<Skill>(skill).loadJSON(data.defaulted_from);
        isArray(data.defaults)?.forEach((skillDefault: json) => skill.defaults.add(new SkillDefault<Skill>(skill).loadJSON(skillDefault)));
        const children = data.children as gcs.Skill[]
        if (data.type.includes("_container")) {
            return children
        }
    }
    mapTechnique(technique: Technique, data?: gcs.Technique) {
        this.mapSkill(technique, data)
        technique.limit = data.limit;
        technique.difficulty = data.difficulty as TehchniqueDifficulty;
        technique.default = new SkillDefault<Technique>(technique).loadJSON(data.default);
        return null
    }
    mapSpell(spell: Spell, data?: gcs.Spell) {
        GCSJSON.mapSkillLike(spell, data);
        spell.college = data.college;
        spell.powerSource = data.power_source;
        spell.spellClass = data.spell_class;
        spell.castingCost = data.casting_cost;
        spell.maintenanceCost = data.maintenance_cost;
        spell.castingTime = data.casting_time;
        spell.duration = data.duration;

        if (spell.type.includes("_container")) {
            return data.children as json[]
        }
    }
    mapEquipment(equipment: Equipment, data?: gcs.Equipment) {
        isArray(data?.modifiers)?.forEach((modifier: json) => equipment.modifiers.add(new EquipmentModifier(equipment).loadJSON(modifier)));

        equipment.description = data.description;
        equipment.equipped = data.equipped;
        equipment.quantity = data.quantity;
        equipment.value = parseFloat(data?.value);
        equipment.weight = parseFloat(data?.weight?.split(" ")[0] ?? "0");
        equipment.techLevel = data.tech_level;
        equipment.legalityClass = data.legality_class;
        equipment.containedWeightReduction = isArray(data?.features)?.find(feature => feature.type === "contained_weight_reduction")?.reduction ?? null;
        data.features?.forEach((feature: json) => {
            Feature.loadFeature<Equipment>(equipment, feature.type)?.loadJSON(feature)
        });

        const children = data?.children as gcs.Equipment[] || null
        if (data.type.includes("_container")) {
            return children
        }
    }
    mapTrait(trait: Trait, data?: json) {
        trait.name = data.name;
        data.modifiers?.forEach((modifier: json) => trait.modifiers.add(new TraitModifier(trait).loadJSON(modifier)));
        trait.basePoints = data.base_points;
        trait.levels = parseInt(data?.levels) ?? null;
        trait.allowHalfLevels = data.allow_half_levels;
        trait.hasHalfLevel = data.has_half_level;
        trait.roundDown = data.round_down;
        trait.controlRating = data.cr;
        data.types?.forEach((type: TraitType) => trait.types.add(type));
        trait.pointsPerLevel = data.points_per_level;
        trait.disabled = data.disabled;
        trait.hasLevels = trait.levels ? true : false;

        data.features?.forEach((feature: json) => {
            Feature.loadFeature<Trait>(trait, feature.type)?.loadJSON(feature)
        });

        if (data.type.includes("_container")) {
            return data.children as json[]
        }
    }

    load(character: Character, data: any) {
        data = objectify<json>(data);
        character.gCalcID = data.id;

        character.profile.loadJSON(data.profile);
        character.equipmentList.load(data.equipment);
        character.otherEquipmentList.load(data.other_equipment);
        character.skillList.load(data.skills);
        character.traitList.load(data.advantages);
        character.spellList.load(data.spells);

        character.missingHP = data?.hp_damage ?? 0;
        character.missingFP = data?.fp_damage ?? 0;

        character.DX.setLevel(data.DX);
        character.FP.setLevel(data.fp_adj);
        character.HP.setLevel(data.hp_adj);
        character.HT.setLevel(data.HT);
        character.IQ.setLevel(data.IQ)
        character.Move.setLevel(data.move_adj);
        character.Per.setLevel(data.per_adj);
        character.ST.setLevel(data.ST);
        character.Speed.setLevel(data.speed_adj);
        character.Will.setLevel(data.will_adj);

        return character
    }
}