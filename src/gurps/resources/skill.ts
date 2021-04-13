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
export class SkillLike<T extends SkillLikeKeys & Data> extends Entity<CharacterData, T> {
    character: Character
    constructor(character: CharacterData | Character, skilllike, ...args) {
        super(
            character,
            skilllike,
            ...args
        );
        this.character = character instanceof Character ? character : new Character(character);
    }
    getAttributeLevel() {
        const value = this.getValue();
        if (!value) return
        const { signature } = value
        const attribute = this.character.getAttribute(signature);
        return attribute?.level ?? 10;
    }
    get bonus() {
        const { features = [] } = this.character;
        return features
            .filter(feature => feature.type === "skill bonus" && skillBonusMatchesSkill(this.getValue(), feature))
            .reduce((t, b) => t + b.amount, 0);
    }
    get defaults() {
        return this.getValue()?.defaults ?? []
    }
    getHighestDefault() {
        const attributes = this.character.getAttributeCollection();
        const allSkills = Object.values(this.character.embedded).filter((e): e is Skill => e.type === "skill" && e instanceof Skill);
        const matches: number[] = this.defaults.flatMap(sd => {
            const { type, modifier = 0 } = sd;
            if (attributes[type]) {
                return [attributes[sd.type].level + modifier];
            } else {
                const skills = allSkills.filter(e => skillMatchesDefault(e.getValue() as any, sd))
                return skills.map(skill => skill.getBaseRelativeLevel() + modifier)
            }
        });
        const highestMatch = Math.max(...matches);
        return highestMatch
    }
    getRelativeLevel() {
        return calculateRelativeSkillLevel(this.getValue());
    }
    getBaseRelativeLevel() {
        const { mod = 0 } = this.getValue();
        const rsl = this.getRelativeLevel();
        const base = this.getAttributeLevel();
        return rsl + base + mod;
    }
    get level() {
        const value = this.getValue();
        if (!value) return
        const level = calculateSkillLevel(
            value,
            this.getAttributeLevel(),
            this.character.getEncumbranceLevel(),
            this.bonus
        );
        return Math.max(level, this.getHighestDefault())
    }
    getLevel() {
        return this.level
    }
    process() {
        const pd = {
            level: this.level,
            relativeLevel: this.getRelativeLevel()
        }
        return { ...super.process(), ...pd }
    }
}
export class Skill extends SkillLike<SkillData> {
    static version = 1 as const
    static type = "skill" as const
    constructor(character, skill, ...args) {
        super(character, skill, ...args);
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
    { points = 0, difficulty = SkillDifficulty.Average } = {} as SkillLikeKeys
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