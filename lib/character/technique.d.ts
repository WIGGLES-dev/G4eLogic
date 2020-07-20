import { Skill, SkillDefault, Difficulty, SkillLike } from "./skill";
import { Signature } from "./character";
import { List } from "./misc/list";
import { json } from "@utils/json_utils";
declare type TehcniqueDifficulty = Difficulty.average | Difficulty.hard;
export declare class Technique extends Skill {
    tag: string;
    limit: number;
    difficulty: TehcniqueDifficulty;
    defaults: Set<SkillDefault<SkillLike<any>>>;
    default: SkillDefault<Skill>;
    defaultedFrom: SkillDefault<SkillLike<any>>;
    isTechnique: boolean;
    constructor(list: List<Skill>);
    get signature(): Signature;
    getBonus(): number;
    calculateLevel(): number;
    getBaseLevel(def: SkillDefault<Skill>, requirePoints: boolean): number;
    getRelativeLevel(): number;
    toJSON(): {};
    loadJSON(json: string | json): this;
    toR20(): any;
}
export {};
