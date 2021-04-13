import { merge } from "@app/utils/object-mapper";
import { v4 } from "uuid";
const attributeMap = {
    "ST": "strength",
    "IQ": "intelligence",
    "DX": "dexterity",
    "HT": "health",
    "Will": "willpower",
    "Per": "perception"
}
const featureMap = {
    "dr_bonus": "armor bonus",
    "skill_bonus": "skill bonus",
    "attribute_bonus": "attribute bonus",
    "reaction_bonus": "reaction bonus"
}
const locationMap = {
    arms: ["left arm", "right arm"],
    legs: ["left leg", "right leg"],
    hands: ["left hand", "right hand"],
    feet: ["left foot", "right foot"]
}
const node = {
    id: {
        key: "id",
        default() {
            return v4()
        }
    },
    enabled: "enabled",
    name: "name",
    isContainer: {
        key: "isContainer",
        default(src) {
            return src?.type?.includes("container")
        }
    },
    showingChildren: {
        key: "showingChildren",
        default(src) {
            return src?.open === true
        }
    },
    "weapons[]": {
        key: "children[]+",
        transform(value) {
            if (value.type === "melee_weapon") {
                return merge(value, meleeWeapon)
            } else if (value.type === "ranged_weapon") {
                return merge(value, rangedWeapon)
            }
        }
    },
    "features[]": {
        key: "features[]+",
        transform(value) {
            return merge(value, feature)
        }
    },
    notes: "notes",
    categories: {
        key: "categories",
        default: []
    },
};
const weapon = {
    ...node,
    "damage": {
        key: "damage",
        transform(value) {
            const {
                type,
                st,
                base,
                armor_divisor,
                fragmentation,
                fragmentation_armor_divisor,
                fragmentation_type,
                modifier_per_die
            } = value;
            return ``
        }
    },
    "damage.type": "damageType",
    "strength": "strengthRequirement",
    "usage": "usage",
    "defaults[]": {
        key: "defaults[]+",
        transform(value) {
            return merge(value, skillDefault)
        }
    }
};
const meleeWeapon = {
    ...weapon,
    type: {
        key: "type",
        transform: () => "melee weapon"
    },
    "reach": "reach",
    "parry": {
        key: "parryBonus",
        transform(value) {
            return Number.parseInt(value) || 0
        }
    },
    "block": {
        key: "blockBonus",
        transform(value) {
            return Number.parseInt(value) || 0
        }
    },
};
const rangedWeapon = {
    ...weapon,
    type: {
        key: "type",
        transform: () => "ranged weapon"
    },
    "accuracy": "accuracy",
    "range": "range",
    "rate_of_fire": "rafteOfFire",
    "shots": "shots",
    "bulk": "bulk",
    "recoil": "recoil"
};
const feature = {
    "type": {
        key: "type",
        transform(value) {
            return featureMap[value]
        }
    },
    per_level: "leveled",
    amount: "amount",
    attribute: "attribute",
    location: {
        key: "location",
        transform: value => locationMap[value] || value
    },
    "name.compare": "nameCompare",
    "name.qualifier": "name",
    "specilization.compare": "specializationCompare",
    "specialization.qualifier": "specialization",
    "category.compare": "categoryCompare",
    "category.qualifier": "category",
};
const traitModifier = {
    ...node,
    type: {
        key: "type",
        transform: () => "trait modifier"
    },
    disabled: {
        key: "enabled",
        transform: value => !value
    },
    cost_type: "costType",
    cost: "cost",
    affects: "affects",
    levels: "levels"
};
const trait = {
    ...node,
    type: {
        key: "type",
        transform: () => "trait"
    },
    version: {
        key: "version",
        transform: () => "1"
    },
    base_points: "basePoints",
    disabled: {
        key: "enabled",
        transform: value => !value
    },
    points_per_level: "pointsPerLevel",
    "children[]": {
        key: "children[]+",
        transform: value => merge(value, trait)
    },
    "levels": [
        {
            key: "levels",
            transform: value => {
                const int = Number.parseInt(value)
                if (!Number.isNaN(int)) return int
            }
        },
        {
            key: "hasLevels",
            transform: (value) => {
                const int = Number.parseInt(value);
                if (!Number.isNaN(int)) return int
            },
            default: false
        }
    ],
    "modifiers[]": {
        key: "children[]+",
        transform: value => merge(value, traitModifier)
    }
};
const skillDefault = {
    "type": {
        key: "type",
        transform(value) {
            if (value === "Skill") {
                return value
            } else if (attributeMap[value]) {
                return attributeMap[value]
            } else {
                return "Skill"
            }
        }
    },
    "name": "name",
    "specialization": "specialization",
    "modifier": "modifier"
};
const skill = {
    ...node,
    type: {
        key: "type",
        transform: () => "skill",
        default: "skill"
    },
    version: {
        key: "version",
        transform: () => 1
    },
    specialization: "specialization",
    difficulty: [
        {
            key: "difficulty",
            transform: value => value?.split("/")?.pop()
        },
        {
            key: "signature",
            transform: value => attributeMap[value?.split("/")?.shift()]
        }
    ],
    tech_level: [
        {
            key: "techLevel"
        },
        {
            key: "hasTechLevel",
            transform: value => !!value
        }
    ],
    "defaults[]": {
        key: "defaults[]+",
        transform(value) {
            return merge(value, skillDefault)
        }
    },
    encumbrance_penalty_multiplier: "encumbrancePenaltyMultiplier",
    points: {
        key: "points",
        default: src => src?.type?.includes("container") ? 0 : 1
    },
    "children[]": {
        key: "children[]+",
        transform(value) {
            return merge(value, skill);
        }
    }
};
const technique = {
    ...node,
    ...skill,
    type: {
        key: "type",
        transform: () => "technique"
    },
    difficulty: "difficulty",
    limit: "limit",
    "children[]": {
        key: "children[]+",
        transform: value => merge(value, technique)
    }
};
const spell = {
    ...node,
    ...skill,
    type: {
        key: "spell",
        transform: () => "spell"
    },
    college: "college",
    class: "class",
    resist: "resist",
    power_source: "powerSource",
    spell_class: "spellClass",
    casting_cost: "castingCost",
    maintenance_cost: "maintenanceCost",
    casting_time: "castingTime",
    duration: "duration",
    "children[]": {
        key: "children[]+",
        transform: value => merge(value, spell)
    }
};
const equipmentModifier = {

};
const equipment = {
    ...node,
    type: {
        key: "type",
        transform: () => "equipment"
    },
    version: {
        key: "version",
        transform: () => 1
    },
    equipped: {
        key: "enabled",
        transform(value, src) {
            if (src?.type?.includes("container")) {
                return false
            } else {
                return value
            }
        }
    },
    description: "name",
    tech_level: "techLevel",
    legality_class: "legalityClass",
    quantity: "quantity",
    uses: "uses",
    max_uses: "maxUses",
    weight: [
        {
            key: "weight",
            transform: value => {
                const parse = Number.parseFloat(value);
                return Number.isNaN(parse) ? 0 : parse
            },
        }
    ],
    value: "value",
    ignore_weight_for_skills: "applySkillEncumbrancePenalty",
    "children[]": {
        key: "children[]+",
        transform: value => merge(value, equipment)
    },
    "modifiers[]": {
        key: "children[]+",
        transform: value => merge(value, equipmentModifier)
    }
};
const profile = {
    name: "name",
    age: "age",
    birthday: "birthday",
    eyes: "eyes",
    hair: "hair",
    skin: "skin",
    handedness: "handedness",
    height: "height",
    weight: "weight",
    gender: "gender",
    body_type: "build",
    religion: "religion",
};
export const character = {
    type: {
        key: "type",
        transform: () => "character"
    },
    version: {
        key: "version",
        transform: () => 1
    },
    id: "id",
    settings: "settings",
    created_date: {
        key: "__meta__.createdOn",
        transform: value => new Date(value).getTime()
    },
    modified_dattate: {
        key: "__meta__.lastEdit",
        transform: value => new Date(value).getTime()
    },
    profile: {
        key: "profile",
        transform: value => merge(value, profile)
    },
    "profile.name": "name",
    "profile.portrait": {
        key: "image",
        transform: value => {
            const datatag = "data:image/jpeg;base64,"
            if (value?.startsWith(datatag)) return datatag
            return datatag + value
        }
    },
    total_points: "pointTotal",
    ST: "attributeLevels.strength.level",
    DX: "attributeLevels.dexterity.level",
    IQ: "attributeLevels.intelligence.level",
    HT: "attributeLevels.health.level",
    will_adj: "attributeLevels.will.level",
    per_adj: "attributeLevels.perception.level",
    speed_adj: "attributeLevels.speed.level",
    move_adj: "attributeLevels.move.level",
    HP_adj: "attributeLevels.hit points.level",
    FP_adj: "attributeLevels.fatigue points.level",
    hp_damage: {
        key: "attributeLevels.hit points.current",
        transform(value) {
            const {
                ST,
                HP_adj = 0
            } = this["src"] || {};
            if (value == null) return ST + HP_adj
            return ST + HP_adj - value
        }
    },
    fp_damage: {
        key: "attributeLevels.fatigue points.current",
        transform(value) {
            const {
                HT,
                FP_adj = 0
            } = this["src"] || {};
            if (value == null) return HT + FP_adj
            return HT + FP_adj - value
        }
    },
    "advantages[]": {
        key: "children[]+",
        transform(value) {
            return merge(value, trait)
        }
    },
    "equipment[]": {
        key: "children[]+",
        transform(value) {
            return merge(value, equipment)
        }
    },
    "other_equipment[]": {
        key: "children[]+",
        transform(value) {
            return merge(value, equipment)
        }
    },
    "skills[]": {
        key: "children[]+",
        transform(value) {
            if (value.type.includes("skill")) {
                return merge(value, skill);
            } else if (value.type.includes("technique")) {
                return merge(value, technique);
            }
        }
    },
    "spells[]": {
        key: "children[]+",
        transform(value) {
            return merge(value, spell)
        }
    },
    print_settings: "printSettings"
}

export async function getMasterLibraryData() {
    const url = "./gcs_master_library-master.zip";
    //const res = await fetch(url);
}