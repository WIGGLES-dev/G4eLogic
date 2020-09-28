import { Serializer } from "./serializer";
import { Skill, Difficulty, SkillDefault, SkillLike } from "@character/skill/skill"
import { Spell } from "@character/spell"
import { Equipment, EquipmentModifier } from "@character/equipment/equipment";
import { Trait, TraitModifier } from "@character/trait/trait";
import { json, objectify } from "@utils/json_utils";
import { Signature, Character, Featurable } from "@character/character";
import { Feature, DRBonus, SkillBonus, FeatureType } from "@character/misc/feature";
import { List, ListItem } from "@character/misc/list";
import { Modifier, Modifiable } from "@character/misc/modifier";
import { AttributeBonus } from "@character/attribute";
import { Weapon, MeleeWeapon, RangedWeapon } from "@character/weapon";
import { Technique, TehchniqueDifficulty } from "@character/technique";

import jp from "jsonpath";

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
                load: GCSJSON.mapSkill
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
    mapSkillDefault(skillDefault: SkillDefault<any>, data: any) {
        skillDefault.setValue({
            type: data.type,
            modifier: data.modifier,
            specialization: data.specialization,
            name: data.name
        }, { update: false })
        return skillDefault
    }

    saveSkillDefault() { }

    static mapSkill(skill: Skill, data?: any) {
        skill.setValue({
            name: data.name,
            difficulty: data.difficulty.split("/")[1],
            signature: data.difficulty.split("/")[0],
            techLevel: data.tech_level,
            specialization: data.specialization,
            encumbrancePenaltyMultiple: data.encumbrance_penalty_multiplier,
            points: +data.points,
            notes: data.notes,
            reference: data.reference
        }, { update: false });
        //if (data.defaulted_from) skill.defaultedFrom = new SkillDefault<Skill>(skill).load(data.defaulted_from);
        data.defaults?.forEach((skillDefault: json) => skill.addDefault().load(skillDefault));
        data.weapon?.forEach(weapon => skill.addWeapon(weapon.type).load(weapon));
        if (data && data.type?.includes("_container")) {
            return data.children as any[]
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
        return data
    }

    mapTechnique(technique: Technique, data?: any) {
        technique.setValue({
            limit: data.limit,
            difficulty: data.difficulty,
            reference: data.reference,
            points: +data.points,
        }, { update: false })
        technique.default.load(data.default)
        data.weapons?.forEach((weapon: json) => {
            technique.addWeapon(weapon.type).load(weapon);
        });
        return null
    }
    saveTechnique(): any { }
    mapSpell(spell: Spell, data?: any) {
        spell.setValue({
            name: data.name,
            points: +data.points,
            reference: data.reference,
            difficulty: data.difficulty.split("/")[1],
            signature: data.difficulty.split("/")[0],
            college: data.college,
            powerSource: data.power_source,
            spellClass: data.spell_class,
            castingCost: data.casting_cost,
            maintenanceCost: data.maintenance_cost,
            castingTime: data.castingTime,
            duration: data.duration
        }, { update: false })
        data.weapons?.forEach((weapon: json) => {
            spell.addWeapon(weapon.type).load(weapon);
        });
        if (data && data.type?.includes("_container")) {
            return data.children as json[]
        }
    }
    saveSpell(): any { }

    mapEquipment(equipment: Equipment, data?: any) {
        equipment.setValue({
            description: data.description,
            disabled: !data.equipped,
            quantity: data.quantity,
            value: +data.value || 0,
            weight: +(data.weight?.split(" ")[0] ?? "0"),
            techLevel: data.tech_level,
            legalityClass: data.legality_class,
            reference: data.reference,
        }, { update: false });

        // equipment.containedWeightReduction = isArray(data?.features)?.find(feature => feature.type === "contained_weight_reduction")?.reduction ?? null;

        data.features?.forEach((feature: json) => {
            Feature.loadFeature<Equipment>(equipment, feature.type)?.load(feature)
        });

        // data.modifiers?.forEach((modifier: json) => {
        //     equipment.addModifier().load(modifier);
        // });

        data.weapons?.forEach((weapon: any) => {
            equipment.addWeapon(weapon.type).load(weapon);
        });

        if (data && data.type?.includes("_container")) {
            return data?.children as any[] || null
        }
    }

    saveEquipment(equipment: Equipment): any { }

    mapTrait(trait: Trait, data?: json) {
        trait.setValue({
            name: data.name,
            basePoints: data.base_points,
            hasLevels: Boolean(data?.levels),
            levels: data.levels ? +data.levels : undefined,
            allowHalfLevels: data.allow_half_levels,
            hasHalfLevel: data.has_half_level,
            roundDown: data.round_down,
            controlRating: data.cr === 0 ? "none" : data?.cr?.toString() ?? "n/a",
            pointsPerLevel: data.points_per_level,
            disabled: trait.disabled,
            reference: data.reference,
            notes: data.notes
        }, { update: false });

        data.modifiers?.forEach((modifier: json) => trait.addModifier().load(modifier));

        //data.types?.forEach((type: TraitType) => trait.types.add(type));

        data.features?.forEach((feature: json) => {
            Feature.loadFeature<Trait>(trait, feature.type)?.load(feature);
        });

        data.weapons?.forEach((weapon: json) => {
            trait.addWeapon(weapon.type).load(weapon);
        })

        data.categories?.forEach((category: string) => {
            trait.categories.add(category);
        })

        if (data && data.type?.includes("_container")) {
            return data.children as json[]
        }
    }
    saveTrait(trait: Trait): any { }

    mapFeature(feature: Feature<Featurable>, data: json) {
        feature.setValue({
            type: data.type,
            leveled: data.per_level,
            amount: data.amount,
        }, { update: false });
        switch (data.type) {
            case FeatureType.attributeBonus:
                if (feature instanceof AttributeBonus) {
                    feature.setValue({
                        attribute: data.attribute
                    }, { update: false });
                }
                break
            case FeatureType.damageResistanceBonus:
                if (feature instanceof DRBonus) {
                    feature.setValue({
                        location: data.location
                    }, { update: false })
                }
                break
            case FeatureType.reactionBonus:
                break
            case FeatureType.skillBonus:
                if (feature instanceof SkillBonus) {
                    feature.setValue({
                        selectionType: data.selection_type,
                        nameCompareType: data.name?.compare,
                        name: data.name?.qualifier,
                        specializationCompareType: data.specialization?.compare,
                        specialization: data.specialization?.qualifier,
                        categoryCompareType: data.category?.compare,
                        category: data.category?.qualifier
                    }, { update: false });
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

    }

    mapModifier(modifier: Modifier<Modifiable>, data: json) {
        modifier.setValue({
            enabled: !data.disabled,
            name: data.name,
            notes: data.notes,
            reference: data.reference
        }, { update: false })
        switch (modifier.tag) {
            case "modifier":
                if (modifier instanceof TraitModifier) {
                    modifier.setValue({
                        cost: data.cost,
                        type: data.cost_type,
                        affects: data.affects,
                        levels: data.levels
                    }, { update: false });
                }
            case "eqp_modifier":
                if (modifier instanceof EquipmentModifier) {
                    modifier.setValue({
                        cost: data.cost,
                        weight: data.weigth,
                        costType: data.weight_type,
                        weightType: data.weight_type
                    }, { update: false });
                }
        }
        return modifier
    }

    saveModifier(modifier: Modifier<Modifiable>) { }

    mapWeapon(weapon: Weapon<any>, data: any) {
        weapon.setValue({
            usage: data.usage,
            strength: data.strength,
            damageStrength: data?.damage?.st,
            damageBase: data?.damage?.base,
            damageType: data?.damage?.type
        }, { update: false })
        switch (weapon.getType()) {
            case "melee_weapon":
                if (weapon instanceof MeleeWeapon) {
                    weapon.setValue({
                        reach: data.reach,
                        parry: data.parry,
                        block: data.block
                    }, { update: false });
                }
            case "ranged_weapon":
                if (weapon instanceof RangedWeapon) {
                    weapon.setValue({
                        accuracy: data.accuracy,
                        range: data.range,
                        rateOfFire: data.rate_of_fire,
                        shots: data.shots,
                        bulk: data.bulk
                    }, { update: false });
                }
        }
        data.defaults?.forEach(weaponDefault => {
            let proxy = weapon.addDefault()
            this.mapSkillDefault(proxy as SkillDefault<any>, weaponDefault);
        });
        return weapon
    }

    saveWeapon() { }

    loadList(list: List<any>, data: any[]) {
        data = objectify<json[]>(data);
        if (data) {
            data?.forEach(listItem => {
                const item = list.populator(data);
                item.load(listItem);
            });
        }
        list.generate();
        return list
    }
    saveList(list: List<Featurable>, data) {
        return list.iterTop().map(root => root.save(data))
    }

    load(character: Character, data: any) {
        data = objectify<json>(data);
        character.gCalcID = data.id;

        character.totalPoints = data.total_points;

        character.profile.load(data.profile);
        character.equipmentList.load(data.equipment);
        character.otherEquipmentList.load(data.other_equipment);

        const skills = jp.query(data, `$.skills..[?(@.type=='skill')]`);
        character.skillList.load(skills);

        const techniques = jp.query(data, `$.skills..[?(@.type=="technique")]`);
        character.techniqueList.load(techniques);

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
    save(character: Character, target): any { }
}
