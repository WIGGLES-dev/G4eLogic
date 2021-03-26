import { merge } from "object-mapper";
const attributeMap = {
    "ST": "strength",
    "IQ": "intelligence",
    "DX": "dexterity",
    "HT": "health",
    "Will": "willpower",
    "Per": "perception"
}
const weapon = {
    usage: "usage",
    strength: "strength",
    "damage.st": {

    }
};
const meleeWeapon = {
    ...weapon,
    type: {
        key: "type",
        transform: () => "melee weapon"
    }
};
const rangedWeapon = {
    ...weapon,
    type: {
        key: "type",
        transform: () => "ranged weapon"
    }
};
const feature = {
    per_level: "leveled",
    amount: "amount",
    attribute: "attribute",
    location: "location",
    "name.compare": "nameCompare",
    "name.qualifier": "name",
    "specilization.compare": "specializationCompare",
    "specialization.qualifier": "specialization",
    "category.compare": "categoryCompare",
    "category.qualifier": "category",
};
const node = {
    id: "id",
    name: "name",
    weapons: [
        {
            key: "children.ranged weapon",
            transform: value => value
                ?.filter(value => value.type === "melee_weapon")
                ?.map(value => merge(value, meleeWeapon))
        },
        {
            key: "children.melee weapon",
            transform: values => values
                ?.filter(value => value.type === "ranged_weapon")
                ?.map(value => merge(value, rangedWeapon))
        }
    ],
    "features[]": {
        key: "features[]",
        transform: value => merge(value, feature)
    },
    notes: "notes",
    categories: "categories",
};
const trait = {
    ...node,
    type: {
        transform: () => "trait"
    },
    version: {
        transform: () => "1"
    },
    base_points: "basePoints",
    disabled: {
        key: "enabled",
        transform: value => !value
    },
    points_per_level: "pointsPerLevel",
    children: {
        key: "children.trait[]",
        transform: value => merge(value, trait)
    }
};
const skillDefault = {

};
const skill = {
    ...node,
    type: {
        key: "version",
        transform: () => "skill"
    },
    version: {
        key: "version",
        transform: () => 1
    },
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
    defaults: "defaults",
    encumbrance_penalty_multiplier: "encumbrancePenaltyMultiplier",
    points: "points",
    children: {
        key: "children.skill[]",
        transform: value => merge(value, skill)
    }
};
const technique = {
    ...node,
    ...skill,
    type: {
        transform: () => "technique"
    },
    difficulty: "difficulty",
    limit: "limit",
    children: {
        key: "children.technique[]",
        transform: value => merge(value, technique)
    }
};
const spell = {
    ...node,
    ...skill,
    type: {
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
    children: {
        key: "children.spell[]",
        transform: value => merge(value, spell)
    }
};

const equipment = {
    ...node,
    type: {
        transform: () => "equipment"
    },
    version: {
        transform: () => 1
    },
    equipped: "equipped",
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
    children: {
        key: "children.equipment[]",
        transform: value => merge(value, equipment)
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
    portrait: {
        key: "portrait",
        transform: value => {
            const datatag = "data:image/jpeg;base64,"
            if (value?.startsWith(datatag)) return datatag
            return datatag + value
        }
    }
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
    total_points: "pointTotal",
    ST: "attributeLevels.strength.level",
    DX: "attributeLevels.dexterity.level",
    IQ: "attributeLevels.intelligence.level",
    HT: "attributeLevels.health.level",
    will_adj: "attributeLevels.will.level",
    per_adj: "attributeLevels.perception.level",
    speed_adj: "attributeLevels.speed.level",
    move_adj: "attributeLevels.move.level",
    "advantages[]": {
        key: "children.trait[]",
        transform: value => merge(value, trait)
    },
    "equipment[]": {
        key: "children.equipment[]",
        transform: value => merge(value, equipment)
    },
    "other_equipment[]": {
        key: "children.equipment[]+",
        transform: value => merge(value, equipment)
    },
    skills: [
        {
            key: "children.skill",
            transform: values => values
                ?.filter(value => value.type.includes("skill"))
                ?.map(value => merge(value, skill))
        },
        {
            key: "children.technique",
            transform: values => values
                ?.filter(value => value.type.includes("technique"))
                ?.map(value => merge(value, skill))
        },
    ],
    "spells[]": {
        key: "children.spell[]",
        transform: value => merge(value, spell)
    },
    print_settings: "printSettings"
}