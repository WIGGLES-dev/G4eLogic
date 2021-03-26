import type { Data } from "@app/entity";
import type { SkillLikeKeys, SkillDefault } from "./skill";
import { SkillDifficulty } from "./skill";
export declare type TechniqueDifficulty = SkillDifficulty.Average | SkillDifficulty.Hard;
export interface TechniqueData extends Data, SkillLikeKeys {
    type: "technique";
    version: 1;
    difficulty: TechniqueDifficulty;
    limit?: number;
    default: SkillDefault;
    defaults: undefined;
}
export declare class Technique {
    static type: "technique";
    static version: 1;
}
export declare function calculateTechniqueLevel(technique: TechniqueData, baseLevel?: number, bonus?: number): number;
