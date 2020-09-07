import { Difficulty, SkillDefault, SkillLike } from "./skill";
export declare function getBaseRelativeLevel(difficulty: Difficulty): -2 | 0 | -3 | -1;
export declare function calculateRelativeLevel(points: number, relativeLevel: number): number;
export declare function calculateSkillLevel(buyLevelFromDefault: boolean, difficulty: Difficulty, points: number, base?: number, defaultedFrom?: SkillDefault<SkillLike<any>>, bonus?: number, encumbranceLevel?: number, encPenaltyMult?: number, gMod?: number, bestDefaultLevel?: number): number;
