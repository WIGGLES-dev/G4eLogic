import { FeatureBonusType, FeatureBonus, StringCompare, Resource, Data } from "@internal";
import { Observable } from "rxjs";
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
export declare abstract class SkillLike<Model extends SkillLikeKeys & Data = SkillLikeKeys & Data> extends Resource<Model> {
    constructor(state: Resource<Model>["state"]);
    static selectBestDefault(): void;
    selectHighestDefault$(): Observable<number>;
    getRelativeLevel(): number;
    get attribute$(): Observable<number>;
    get relativeLevel$(): Observable<number>;
    get baseRelativeLevel$(): Observable<number>;
    get bonus$(): Observable<number>;
    get level$(): Observable<number>;
}
export declare class Skill extends SkillLike<SkillData> {
    static version: 1;
    static type: "skill";
    constructor(state: Skill["state"]);
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
