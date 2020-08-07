import { Difficulty, SkillDefault, SkillLike } from "./skill";
export declare function calculateSkillLevel(difficulty: Difficulty, points: number, base?: number, defaultedFrom?: SkillDefault<SkillLike<any>>, bonus?: number, encumbranceLevel?: number, encPenaltyMult?: number, gMod?: number): number;
