import { FeatureType } from "@internal";
import objectMapper from "object-mapper";

function reverseMap() { }

const mapSkill = () => ({
    "type": {
        key: "type",
        transform: () => FeatureType.Skill
    },
    "name": "name",
    "difficulty": {
        key: "difficulty",
        transform: value => value.split('/')[1],
        default: () => "A"
    },
    "points": {
        key: "points",
        default: (src, key, dest, destKey) => 1
    },
    "specialization": "specialization",
    "mod": "mod",
    "signature": {
        key: "signature",
        default: (src) => src?.difficulty?.split('/')[0]
    },
    "hasTechLevel": {
        default: (src) => Boolean(src?.tech_level)
    },
    "tech_level": "techLevel",
    "defaults": "defaults",
    "defaulted_from": "defaultedFrom",
    "encumbrance_penalty_multiplier": "encumbrancePenaltyMultiplier"
})
const mapTechnique = () => ({
    "type": {
        key: "type",
        transform: () => FeatureType.Technique
    },
    ...mapSkill(),
    "default": "default"
})
const mapSpell = () => ({
    ...mapSkill()
})

const mapTrait = {

}

const mapEquipment = {

}

const mapProfile = {

}

const mapAttributes = {

}
