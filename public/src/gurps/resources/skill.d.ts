import { Data, Entity } from "@app/entity";
import type { StringCompare } from "@app/utils/strings";
import { CharacterData } from "./character";
import type { FeatureBonus, FeatureBonusType } from "./interfaces";
export interface SkillLikeKeys {
    points: number;
    name: string;
    specialization?: string;
    techLevel?: string;
    difficulty: SkillDifficulty;
    signature: string;
    mod: number;
    encumbrancePenaltyMultiple: number;
    defaults: SkillDefault[];
}
export interface SkillData extends Data, SkillLikeKeys {
    type: "skill";
    version: 1;
}
export declare class SkillLike extends Entity<SkillData, CharacterData> {
    constructor(skill: any, character: any);
    getAttributeLevel(): number;
    get bonus(): any;
    getHighestDefault(): number;
    getRelativeLevel(): number;
    getBaseRelativeLevel(): number;
    getLevel(): number;
}
export declare class Skill extends SkillLike {
    static version: 1;
    static type: "skill";
    constructor(skill: any, character: any);
}
export declare enum SkillDifficulty {
    Easy = "E",
    Average = "A",
    Hard = "H",
    VeryHard = "VH",
    Wildcard = "W"
}
export interface SkillDefault {
    type: "Skill" | string;
    name: string;
    specialization?: string;
    modifier: number;
}
export interface SkillBonus extends FeatureBonus {
    type: FeatureBonusType.Skill;
    nameCompare: StringCompare;
    name: string;
    specializationCompare: StringCompare;
    specialization: string;
    categoryCompare: StringCompare;
    category: string;
}
export declare function skillBonusMatchesSkill(skill: SkillLikeKeys, skillBonus: SkillBonus): boolean;
export declare function skillMatchesAnyDefaults(skill: SkillLikeKeys, defaults: SkillDefault[]): boolean;
export declare function skillMatchesDefault(skill: SkillLikeKeys, skillDefault: SkillDefault): boolean;
export declare function calculateRelativeSkillLevel({ points, difficulty }?: Pick<SkillLikeKeys, "points" | "difficulty">): number;
export declare function calculateSkillLevel(skill: SkillLikeKeys, baseLevel?: number, encumbranceLevel?: number, bonus?: number): number;
