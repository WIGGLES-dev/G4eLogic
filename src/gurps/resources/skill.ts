import { Data, Entity } from "@app/entity";
import type { StringCompare } from "@app/utils/strings";
import { stringCompare } from "@utils/strings";
import { Character, CharacterData } from "./character";
import type { FeatureBonus, FeatureBonusType } from "./interfaces";
export interface SkillLikeKeys {
    points: number
    name: string
    specialization?: string
    techLevel?: string
    difficulty: SkillDifficulty,
    signature: string,
    mod: number
    encumbrancePenaltyMultiple: number
    defaults: SkillDefault[]
}
export interface SkillData extends Data, SkillLikeKeys {
    type: "skill"
    version: 1
}
export class SkillLike extends Entity<SkillData, CharacterData> {
    constructor(skill, character) {
        super(skill, character);
    }
    getAttributeLevel() {
        if (!this.value) return
        const { signature } = this.value
        const character = new Character(this.root);
        const attribute = character.getAttribute(signature);
        return attribute?.level;
    }
    get bonus() {
        return this.getFeatures()
            .filter(feature => feature.type === "skill bonus" && skillBonusMatchesSkill(this.value, feature))
            .reduce((t, b) => t + b.amount, 0);
    }
    getHighestDefault() {
        const character = new Character(this.root);
        const attributes = character.getAttributeCollection();
        const allSkills = Object.values(character.getEmbeds()).filter(r => r.type === "skill");
        const defaults = this.value.defaults;
        const matches: number[] = defaults.flatMap(sd => {
            const { type, modifier = 0 } = sd;
            if (attributes[type]) {
                return [attributes[sd.type].level + modifier];
            } else {
                return allSkills
                    .filter(e => skillMatchesDefault(e.value as any, sd))
                    .map(e => new Skill(e.value as any, this.root))
                    .map(skill => skill.getBaseRelativeLevel() + modifier)
            }
        });
        const highestMatch = Math.max(...matches);
        return highestMatch
    }
    getRelativeLevel() {
        return calculateRelativeSkillLevel(this.value);
    }
    getBaseRelativeLevel() {
        if (!this.value) return
        const { difficulty, signature } = this.value;
        return this.getRelativeLevel() + this.getAttributeLevel();
    }
    getLevel() {
        if (!this.value) return
        const character = new Character(this.root);
        const level = calculateSkillLevel(
            this.value,
            this.getAttributeLevel(),
            character.getEncumbranceLevel(),
            this.bonus
        );
        return Math.max(level, this.getHighestDefault())
    }
}
export class Skill extends SkillLike {
    static version = 1 as const
    static type = "skill" as const
    constructor(skill, character) {
        super(skill, character);
    }
}
export enum SkillDifficulty {
    Easy = "E",
    Average = "A",
    Hard = "H",
    VeryHard = "VH",
    Wildcard = "W"
}
export interface SkillDefault {
    type: "Skill" | string,
    name: string,
    specialization?: string
    modifier: number
}
export interface SkillBonus extends FeatureBonus {
    type: FeatureBonusType.Skill
    nameCompare: StringCompare
    name: string
    specializationCompare: StringCompare
    specialization: string
    categoryCompare: StringCompare
    category: string
}
export function skillBonusMatchesSkill(skill: SkillLikeKeys, skillBonus: SkillBonus) {
    if (!skill) return false
    const {
        name,
        specialization
    } = skill;
    const nameMatches = stringCompare(name, skillBonus.name, skillBonus.nameCompare);
    const specializationMatches = stringCompare(specialization, skillBonus.specialization, skillBonus.specializationCompare);
    const categoryMatches = true;
    return (
        (name && nameMatches) &&
        (specialization ?
            specializationMatches : name && nameMatches
        ) && categoryMatches)
}
export function skillMatchesAnyDefaults(skill: SkillLikeKeys, defaults: SkillDefault[]) {
    return defaults?.some((skillDefault) => skillMatchesDefault(skill, skillDefault))
}
export function skillMatchesDefault(skill: SkillLikeKeys, skillDefault: SkillDefault) {
    if (skillDefault.type !== "Skill") return false
    const {
        specialization
    } = skill
    const nameMatches = skillDefault.name === skill.name;
    const specializationMatches = skillDefault.specialization === specialization;
    return (
        skill.name && nameMatches) &&
        (skillDefault.specialization ?
            specializationMatches : skill.name && nameMatches
        )
}
function calculateBaseRelativeLevel(difficulty: SkillDifficulty) {
    switch (difficulty) {
        case SkillDifficulty.Easy:
            return 0
        case SkillDifficulty.Average:
            return -1
        case SkillDifficulty.Hard:
            return -2
        case SkillDifficulty.VeryHard:
            return -3
        case SkillDifficulty.Wildcard:
            return -3
    }
}
export function calculateRelativeSkillLevel(
    { points, difficulty } = {} as Pick<SkillLikeKeys, "points" | "difficulty">
) {
    let relativeLevel = calculateBaseRelativeLevel(difficulty);
    if (points === 1) {

    } else if (points < 4) {
        relativeLevel++;
    } else {
        relativeLevel += 1 + points / 4;
    }
    return relativeLevel
}
export function calculateSkillLevel(
    skill: SkillLikeKeys,
    baseLevel: number = 10,
    encumbranceLevel: number = 0,
    bonus: number = 0,
) {
    if (!skill) return NaN
    let {
        points = 0,
        encumbrancePenaltyMultiple = 0,
        mod = 0
    } = skill;
    if (skill.difficulty === SkillDifficulty.Wildcard) points = points / 3;
    let relativeLevel = calculateRelativeSkillLevel(skill);
    const encumbrancePenalty = encumbranceLevel * encumbrancePenaltyMultiple;
    const preliminaryLevel = baseLevel + relativeLevel + encumbrancePenalty;
    return Math.max(preliminaryLevel) + mod + bonus
}