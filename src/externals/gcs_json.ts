import { Serializer } from "./serializer";

import { Signature, Character } from "@character/character";
import { List, ListItem } from "@character/misc/list";

import GCSCONFIG from "./gcs-loader.json";

import jp from "jsonpath";
import { SkillBonus } from "@character/features/modules/SkillBonus";
import { DRBonus } from "@character/features/modules/DRBonus";
import { AttributeBonus } from "@character/features/modules/AttributeBonus";
import { Feature } from "@character/features/feature";
import { ReactionBonus } from "@character/features/modules/ReactionBonus";

export class GCSJSON extends Serializer {
    static scope = "GCSJSON"

    constructor() {
        super();
    }

    init() {
        this.parseConfig(GCSCONFIG);
    }

    loadFeature() {
        return {
            load: (feature: Feature, type: string) => {
                switch (type) {
                    case FeatureType.skillBonus:
                        return new SkillBonus(feature);
                    case FeatureType.DRBonus:
                        return new DRBonus(feature);
                    case FeatureType.reactionBonus:
                        return new ReactionBonus(feature);
                    default:
                        return new AttributeBonus(feature);
                }
            },
            save: (feature: Feature, type: string) => {
                switch (feature.core.constructor) {
                    case SkillBonus:
                        return FeatureType.skillBonus
                    case DRBonus:
                        return FeatureType.DRBonus
                    case ReactionBonus:
                        return FeatureType.reactionBonus
                    case AttributeBonus:
                        return FeatureType.attributeBonus
                    default:

                }
            }
        }
    }

    loadList(list: List<any>, data: any[]) {
        if (data) {
            data?.forEach(listItem => {
                const item = list.populator(data);
                item.load(listItem);
            });
        }
        return list
    }
    saveList(list: List<ListItem>, data) {
        return list.rootItems().map(root => root.save(data))
    }

    load(character: Character, data: any) {
        const { third_party } = data;

        if (third_party) {
            const { config, attributes, pools, locations, notes, skills, techniques, equipment, traits } = third_party;

            if (config) character.config.reconfigure(JSON.parse(data.third_party.config));
            if (notes) character.notes = notes;

            attributes?.forEach(attribute => {
                const charAttribtue = character.getAttribute(attribute.name);
                charAttribtue.level = attribute.level;
                charAttribtue.modifier = attribute.mod
            });
            pools?.forEach(pool => {
                const attribute = character.getAttribute(pool.name);
                if (attribute) {
                    attribute.currentValue = pool.current;
                    attribute.modifier = pool.modifier;
                }
            });
            locations?.forEach(location => {
                const hitLocaiton = character.locationList.getLocation(location.name);
                if (hitLocaiton) {
                    hitLocaiton.damageTaken = location.injury;
                }
            });
        }

        character.totalPoints = data.total_points;
        character.sizeModifier = data.profile.size;
        character.techLevel = data.profile.tech_level;

        const items = (data.equipment || []).map(item => {
            return item
        }).concat(
            (data.other_equipment || []).map(item => {
                item.location = "other";
                item.equipped = false;
                return item
            })
        )
        character.equipmentList.load(items);

        const skills = jp.query(data, `$.skills..[?(@.type=='skill')]`);
        character.skillList.load(skills);

        const techniques = jp.query(data, `$.skills..[?(@.type=='technique')]`);
        character.techniqueList.load(techniques);

        character.traitList.load(data.advantages);
        character.spellList.load(data.spells);

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

        Object.assign(character.profile, {
            name: data.profile.name,
            portrait: new URL('data:image/jpeg;base64,' + data.profile.portrait)
        })

        return character
    }
    save(character: Character, target): any {
        const attributes = [...character.attributeList.attributes.values()].map(attribute => {
            return {
                name: attribute.signature,
                mod: attribute.modifier,
                level: attribute.level
            }
        });
        const pools = [...character.attributeList.attributes.values()].filter(attribute => attribute.hasTag("pool")).map(pool => {
            return {
                name: pool.signature,
                current: pool.currentValue,
                modifier: pool.modifier
            }
        });
        const locations = [...character.locationList.locations.values()].map(location => {
            return {
                name: location.name,
                injury: location.damageTaken
            }
        });
        return {
            type: "character",
            profile: {
                name: character.profile.name,
                portrait: character.profile.portrait.href,
            },
            total_points: character.totalPoints,
            ST: character.getAttribute("ST").level,
            DX: character.getAttribute("DX").level,
            IQ: character.getAttribute("IQ").level,
            HT: character.getAttribute("HT").level,
            fp_adj: character.getAttribute("FP").level,
            hp_adj: character.getAttribute("HP").level,
            move_adj: character.getAttribute("Move").level,
            per_adj: character.getAttribute("Per").level,
            speed_adj: character.getAttribute("Speed").level,
            will_adj: character.getAttribute("Will").level,
            advantages: character.traitList.save(),
            skills: [...character.skillList.save(), ...character.techniqueList.iter().map(technique => technique.save({}))],
            equipment: character.equipmentList.itemsByLocation("carried").map(item => item.save({})),
            other_equipment: character.equipmentList.itemsByLocation("other").map(item => item.save({})),
            third_party: {
                attributes,
                pools,
                locations,
                notes: character.notes,
                config: character.config.stringify(),
                skills: character.skillList.save(),
                techniques: character.techniqueList.save(),
                equipment: character.equipmentList.save(),
                traits: character.traitList.save(),
            }
        }
    }
}

enum FeatureType {
    skillBonus = "skill_bonus",
    DRBonus = "dr_bonus",
    attributeBonus = "attribute_bonus",
    reactionBonus = "reaction_bonus",
    spellBonus = "spell_bonus",
    weaponDamageBonus = "weapon_damage_bonus"
}