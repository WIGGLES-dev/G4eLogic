import { signatures, Character, Featurable } from "./character";
import { List, ListItem } from "./misc/list";
import { Feature } from "./misc/feature";
import { StringCompare } from "../utils/string_utils";
import { json } from "../utils/json_utils";
export declare abstract class SkillLike<T extends SkillLike<T>> extends ListItem<T> {
    name: string;
    difficulty: difficulty;
    points: number;
    specialization?: string;
    signature?: signatures;
    defaults?: Set<SkillDefault<T>>;
    defaultedFrom?: SkillDefault<T>;
    constructor(list: List<T>);
    abstract getBonus(): number;
    getBaseRelativeLevel(): -1 | 0 | -2 | -3;
    getRelativeLevel(): number;
    static calculateRelativeLevel(points: number, relativeLevel: number): number;
    calculateLevel(): number;
    getBestDefaultWithPoints(): SkillDefault<any>;
    getBestDefault(): SkillDefault<any>;
    canSwapDefaults(skill: SkillLike<T>): boolean;
    hasDefaultTo(skill: SkillLike<T>): boolean;
    swapDefault(): number;
    toJSON(): {};
    loadJSON(object: string | json): void;
}
export declare class SkillList extends List<Skill> {
    class: typeof Skill;
    constructor(character: Character);
}
export declare class Skill extends SkillLike<Skill> {
    tag: string;
    specialization: string;
    signature: signatures;
    techLevel: string;
    defaults: Set<SkillDefault<Skill>>;
    defaultedFrom: SkillDefault<Skill>;
    isTechnique: boolean;
    constructor(list: List<Skill>);
    childrenPoints(): number;
    getBonus(): number;
    toString(): string;
    toJSON(): {};
    loadJSON(object: string | json): this;
    toR20(): {
        key: string;
        row_id: string;
        data: {
            name: string;
            base: string | number;
            difficulty: string | number;
            bonus: number;
            points: number;
            wildcard_skill_points: number;
            use_wildcard_points: number;
            use_normal_points: number;
            skill_points: number;
            ref: string;
            notes: string;
        };
    };
}
export declare class SkillBonus<T extends Featurable> extends Feature<T> {
    selectionType: string;
    nameCompareType: StringCompare;
    name: string;
    specializationCompareType: string;
    specialization: string;
    categoryCompareType: string;
    constructor(owner: T);
    totalBonus(): number;
    isApplicableTo(skill: Skill): boolean;
    toJSON(): {};
    loadJSON(object: string | json): this;
}
interface SkillBinding<T> {
    skill: T;
    level: number;
    adjustedLevel: number;
    points: number;
}
export declare class SkillDefault<T extends SkillLike<T>> {
    tag: string;
    bound: SkillBinding<T>;
    type: string;
    name: string;
    specialization: string;
    modifier: number;
    constructor(skill: T);
    isSkillBased(): boolean;
    getSkillsNamedFrom(list: List<T>): {
        skills: T[];
        highest: T;
    };
    toJSON(): void;
    loadJSON(object: json, skill: T): this;
}
export declare enum difficulty {
    easy = "E",
    average = "A",
    hard = "H",
    very_hard = "VH",
    wildcard = "W"
}
export {};
