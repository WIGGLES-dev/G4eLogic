import { SkillDifficulty, Data, SkillLikeKeys, SkillDefault, SkillLike } from "@internal";
import { Observable } from 'rxjs';
export declare type TechniqueDifficulty = SkillDifficulty.Average | SkillDifficulty.Hard;
export interface TechniqueData extends Data, SkillLikeKeys {
    type: "technique";
    version: 1;
    difficulty: TechniqueDifficulty;
    limit?: number;
    default: SkillDefault;
    defaults: undefined;
}
export declare class Technique extends SkillLike<TechniqueData> {
    static type: "technique";
    static version: 1;
    constructor(state: Technique["state"]);
    get level$(): Observable<number>;
}
export declare function calculateTechniqueLevel(technique: TechniqueData, baseLevel?: number, bonus?: number): number;
