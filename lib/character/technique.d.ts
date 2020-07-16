import { Skill, SkillDefault, difficulty } from "./skill";
import { signatures } from "./character";
import { List } from "./misc/list";
import { json } from "../utils/json_utils";
export declare class Technique extends Skill {
    tag: string;
    limit: number;
    difficulty: difficulty;
    default: SkillDefault<Skill>;
    constructor(list: List<Skill>);
    get signature(): signatures;
    getBonus(): number;
    calculateLevel(): number;
    getBaseLevel(def: SkillDefault<Skill>, requirePoints: boolean): number;
    getRelativeLevel(): number;
    toJSON(): {};
    loadJSON(object: string | json): this;
    toR20(): any;
}
