import { Difficulty, SkillList, SkillLike, Skill, SkillDefault } from "./skill/skill";
import { List } from "./misc/list";
import { Signature } from "./character";
import { Character } from "index";
export declare class TechniqueList extends SkillList {
    constructor(character: Character);
    populator(): any;
    sumSkills(): number;
}
export declare type TehchniqueDifficulty = Difficulty.average | Difficulty.hard;
export declare class Technique extends Skill {
    static keys: string[];
    tag: string;
    limit: number;
    difficulty: TehchniqueDifficulty;
    defaults: Set<SkillDefault<SkillLike<any>>>;
    default: SkillDefault<Skill>;
    defaultedFrom: SkillDefault<SkillLike<any>>;
    isTechnique: boolean;
    constructor(list: List<Skill>, keys?: string[]);
    get signature(): Signature;
    getBonus(): number;
    calculateLevel(): number;
    getBestDefault(): SkillDefault<any>;
    getBaseLevel(): number;
    getRelativeLevel(): number;
}
