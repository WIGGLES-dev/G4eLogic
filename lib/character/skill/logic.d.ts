import { Difficulty, SkillDefault, SkillLike } from "./skill";
export declare function getBaseRelativeLevel(difficulty: Difficulty): 0 | -1 | -2 | -3;
export declare function calculateRelativeLevel(points: number, relativeLevel: number): number;
export declare function calculateSkillLevel(buyLevelFromDefault: boolean, difficulty: Difficulty, points: number, base?: number, defaultedFrom?: SkillDefault<SkillLike<any>>, bonus?: number, encumbranceLevel?: number, encPenaltyMult?: number, gMod?: number): number;
