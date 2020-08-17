import { Serializer, registerSerializer } from "./serializer";
import { Skill, Difficulty, SkillDefault, SkillLike } from "../../character/skill/skill";
import { Technique, TehchniqueDifficulty } from "../../character/technique";
import { Spell } from "../../character/spell";
import { Equipment, EquipmentModifier } from "../../character/equipment";
import { Trait, TraitType, TraitModifier } from "../../character/trait";
import * as gcs from "@gcs/gcs";
import { isArray, json, objectify } from "@utils/json_utils";
import { Signature, Character, Featurable } from "@character/character";
import { Feature, DRBonus, SkillBonus } from "@character/misc/feature";
import { List, ListItem } from "@character/misc/list";
import { Modifier, Modifiable } from "@character/misc/modifier";
import { FeatureType } from "@gcs/gcs";
import { AttributeBonus } from "@character/attribute";
import { Weapon, MeleeWeapon, RangedWeapon } from "../weapon";

@registerSerializer
export class GCSJSON extends Serializer {
    static scope = "GCSJSON"
    constructor() {
        super();
    }

    init() {
        this.
            register(SkillDefault, {
                save: this.saveSkillDefault,
                load: this.mapSkillDefault
            })
            .register(Skill, {
                save: this.saveSkill,
                load: this.mapSkill
            })
            .register(Technique, {
                save: this.saveTechnique,
                load: this.mapTechnique
            })
            .register(Spell, {
                save: this.saveSpell,
                load: this.mapSpell
            })
            .register(Equipment, {
                save: this.saveEquipment,
                load: this.mapEquipment
            })
            .register(Trait, {
                save: this.saveTrait,
                load: this.mapTrait
            })
            .register("feature", {
                save: this.saveFeature,
                load: this.mapFeature
            })
            .register(TraitModifier, {
                save: this.saveModifier,
                load: this.mapModifier
            })
            .register(EquipmentModifier, {
                save: this.saveModifier,
                load: this.mapModifier
            })
            .register("weapon", {
                save: this.saveWeapon,
                load: this.mapWeapon
            })
    }

    private static saveListLike(listLike: ListItem<any>, data: any) {
        data.children = Array.from(listLike.children).map(listLike => listLike.save());
        data.categories = Array.from(listLike.categories);
        data.reference = listLike.reference;
        data.notes = listLike.notes;
        return data
    }

    private static mapSkillLike(skillLike: SkillLike<any>, data?: gcs.SkillLike) {
        skillLike.name = data.name;
        skillLike.difficulty = data.difficulty as Difficulty;
        skillLike.points = data.points;
    }

    mapSkillDefault(skillDefault: SkillDefault<any>, data: any) {
        return skillDefault
    }

    saveSkillDefault(skillDefault: SkillDefault<any>) {
        let data: any = {

        }
        return data
    }

    mapSkill(skill: Skill, data?: gcs.Skill) {
        GCSJSON.mapSkillLike(skill, data);
        skill.difficulty = data.difficulty?.split("/")[1] as Difficulty;
        skill.signature = data.difficulty?.split("/")[0] as Signature;
        skill.techLevel = data.tech_level ?? "";
        if (data.encumbrance_penalty_multiplier) skill.encumbrancePenaltyMultiple = data.encumbrance_penalty_multiplier;
        if (data.defaulted_from) skill.defaultedFrom = new SkillDefault<Skill>(skill).load(data.defaulted_from);
        isArray(data.defaults)?.forEach((skillDefault: json) => skill.addDefault().load(skillDefault));

        if (data && data.type?.includes("_container")) {
            return data.children as gcs.Skill[]
        }
    }
    saveSkill(skill: Skill): any {
        let data = {
            type: "skill",
            version: 1,
            name: skill.name,
            difficulty: skill.difficulty,
            points: skill.points,
            // prereqs: {},
        };
        GCSJSON.saveListLike(skill, data);
        return data
    }

    mapTechnique(technique: Technique, data?: gcs.Technique) {
        this.mapSkill(technique, data)
        technique.limit = data.limit;
        technique.difficulty = data.difficulty as TehchniqueDifficulty;
        technique.default = new SkillDefault<Technique>(technique).load(data.default) as SkillDefault<Technique>;
        return null
    }
    saveTechnique(technique: Technique): any {

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

        if (data && data.type?.includes("_container")) {
            return data.children as json[]
        }
    }
    saveSpell(spell: Spell): any {

    }

    mapEquipment(equipment: Equipment, data?: gcs.Equipment) {
        equipment.description = data.description;
        equipment.equipped = data.equipped;
        equipment.quantity = data.quantity;
        equipment.value = parseFloat(data?.value);
        equipment.weight = parseFloat(data?.weight?.split(" ")[0] ?? "0");
        equipment.techLevel = data.tech_level;
        equipment.legalityClass = data.legality_class;
        equipment.containedWeightReduction = isArray(data?.features)?.find(feature => feature.type === "contained_weight_reduction")?.reduction ?? null;

        data.features?.forEach((feature: json) => {
            Feature.loadFeature<Equipment>(equipment, feature.type)?.load(feature)
        });
        data.modifiers?.forEach((modifier: json) => {
            equipment.addModifier().load(modifier);
        });

        data.weapons?.forEach((weapon: any) => {
            equipment.addWeapon(weapon.type).load(weapon)
        });

        if (data && data.type?.includes("_container")) {
            return data?.children as gcs.Equipment[] || null
        }
    }
    saveEquipment(equipment: Equipment): any {
        let data = {
            type: "equipment",
            version: 1,
            equipped: equipment.equipped,
            quantity: equipment.quantity,
            description: equipment.description,
            value: equipment.toString(),
            weight: `${equipment.weight} lb`,
            reference: equipment.reference,
            notes: equipment.notes,
            categories: Array.from(equipment.categories)
        };
        GCSJSON.saveListLike(equipment, data);
        return data
    }

    mapTrait(trait: Trait, data?: json) {
        trait.name = data.name;
        data.modifiers?.forEach((modifier: json) => trait.addModifier().load(modifier));
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
            Feature.loadFeature<Trait>(trait, feature.type)?.load(feature)
        });

        if (data && data.type?.includes("_container")) {
            return data.children as json[]
        }
    }
    saveTrait(trait: Trait): any {
        let data: any = {
            type: "advantage",
            version: 1,
            name: trait.name,

            base_points: trait.basePoints,
            reference: trait.reference,
            categories: Array.from(trait.categories),
            modifiers: Array.from(trait.modifiers).map(trait => trait.save())
        }
        GCSJSON.saveListLike(trait, data);
        return data
    }

    mapFeature(feature: Feature<Featurable>, data: json) {
        feature.type = data.type;

        feature.leveled = data.per_level;
        feature.limitation = data.limitation;
        feature.amount = data.amount;

        switch (data.type) {
            case FeatureType.attributeBonus:
                if (feature instanceof AttributeBonus) {
                    feature.attribute = data.attribute;
                }
                break
            case FeatureType.damageResistanceBonus:
                if (feature instanceof DRBonus) {
                    feature.location = data.location;
                }
                break
            case FeatureType.reactionBonus:
                break
            case FeatureType.skillBonus:
                if (feature instanceof SkillBonus) {
                    feature.selectionType = data.selection_type;
                    feature.nameCompareType = data.name?.compare;
                    feature.name = data.name?.qualifier;
                    feature.specializationCompareType = data.specialization?.compare;
                    feature.specialization = data.specialization?.qualifier;
                    feature.categoryCompareType = data?.category?.compare;
                    feature.category = data?.category?.qualifier;
                }
                break
            case FeatureType.spellBonus:
                break
            case FeatureType.weaponDamageBonus:
                break
            default:
        }
        return feature
    }

    saveFeature(feature: Feature<Featurable>) {
        let data: any = {

        };
        switch (feature.type) {

        }
        return data
    }

    mapModifier(modifier: Modifier<Modifiable>, data: json) {
        modifier.enabled = data.enabled;
        modifier.name = data.name;
        modifier.notes = data.notes;
        modifier.reference = data.reference;
        switch (modifier.tag) {
            case "modifier":
                if (modifier instanceof TraitModifier) {
                    modifier.cost = data.cost;
                    modifier.type = data.type;
                    modifier.affects = data.affects;
                    modifier.levels = data.levels;
                }
            case "eqp_modifier":
                if (modifier instanceof EquipmentModifier) {
                    modifier.cost = data.cost;
                    modifier.weight = data.weight;
                    modifier.costType = data.cost_type;
                    modifier.weightType = data.weight_type;
                }
        }
        return modifier
    }

    saveModifier(modifier: Modifier<Modifiable>) {
        let data: any = {
            enabled: modifier.enabled,
            name: modifier.name
        }
        switch (modifier.tag) {
            case "modifier":
                if (modifier instanceof TraitModifier) {
                    Object.assign(data, {
                        cost: modifier.cost,
                        type: modifier.type,
                        affects: modifier.affects,
                        levels: modifier.levels
                    });
                }
            case "eqp_modifier":
                if (modifier instanceof EquipmentModifier) {
                    Object.assign(data, {
                        cost: modifier.cost,
                        weight: modifier.weight,
                        cost_type: modifier.costType,
                        weight_type: modifier.weightType
                    });
                }
        }
        return data
    }

    mapWeapon(weapon: Weapon<any>, data: any) {
        weapon.usage = data.usage;
        weapon.strength = data.strength
        switch (weapon.getType()) {
            case "melee_weapon":
                if (weapon instanceof MeleeWeapon) {
                    weapon.reach = data.reach;
                    weapon.parry = data.parry;
                }
            case "ranged_weapon":
                if (weapon instanceof RangedWeapon) {
                    weapon.accuracy = data.accurage;
                    weapon.range = data.range;
                    weapon.rateOfFire = data.rate_of_fire;
                    weapon.shots = data.shots;
                    weapon.bulk = data.bulk
                }
        }
        return weapon
    }

    saveWeapon() {

    }

    loadList(list: List<any>, data: any[]) {
        data = objectify<json[]>(data);
        if (data) {
            data.forEach(listItem => {
                const item = list.populator(data);
                item.load(listItem);
            });
        }
        list.generate();
        return list
    }
    saveList(list: List<Featurable>) {
        return list.iterTop().map(root => root.save())
    }

    load(character: Character, data: any) {
        data = objectify<json>(data);
        character.gCalcID = data.id;

        character.profile.load(data.profile);
        character.equipmentList.load(data.equipment);
        character.otherEquipmentList.load(data.other_equipment);
        character.skillList.load(data.skills);
        character.traitList.load(data.advantages);
        character.spellList.load(data.spells);

        character.missingHP = data?.hp_damage ?? 0;
        character.missingFP = data?.fp_damage ?? 0;

        character.getAttribute(Signature.DX).setLevel(data.DX);
        character.getAttribute(Signature.FP).setLevel(data.fp_adj);
        character.getAttribute(Signature.HP).setLevel(data.hp_adj);
        character.getAttribute(Signature.HT).setLevel(data.HT);
        character.getAttribute(Signature.IQ).setLevel(data.IQ)
        character.getAttribute(Signature.Move).setLevel(data.move_adj);
        character.getAttribute(Signature.Per).setLevel(data.per_adj);
        character.getAttribute(Signature.ST).setLevel(data.ST);
        character.getAttribute(Signature.Speed).setLevel(data.speed_adj);
        character.getAttribute(Signature.Will).setLevel(data.will_adj);

        return character
    }
    save(character: Character, target): any {
        let output = {
            DX: character.getAttribute(Signature.DX).level,
            fp_adj: character.getAttribute(Signature.FP).level,
            hp_adj: character.getAttribute(Signature.HP).level,
            HT: character.getAttribute(Signature.HT).level,
            IQ: character.getAttribute(Signature.IQ).level,
            move_adj: character.getAttribute(Signature.Move).level,
            per_adj: character.getAttribute(Signature.Per).level,
            ST: character.getAttribute(Signature.ST).level,
            speed_adj: character.getAttribute(Signature.Speed).level,
            will_adj: character.getAttribute(Signature.Will).level,

            hp_damage: character.missingHP,
            fp_damage: character.missingFP,

            profile: character.profile.save(),

            equipment: character.equipmentList.save(),
            other_equipment: character.otherEquipmentList.save(),
            skills: character.skillList.save(),
            advantages: character.traitList.save()
        }
        GCSJSON.purgeObject(output);
        return JSON.stringify(output)
    }
}
