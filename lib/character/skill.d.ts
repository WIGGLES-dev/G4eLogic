import { Signature, Character } from "./character";
import { List, ListItem } from "./misc/list";
import { json } from "@utils/json_utils";
import { Default } from "./misc/default";
import * as gcs from "@gcs/gcs";
export declare class SkillList extends List<Skill> {
    populator: typeof Skill;
    constructor(character: Character);
}
export declare abstract class SkillLike<T extends SkillLike<T>> extends ListItem<T> {
    abstract type: "skill" | "skill_container" | "spell" | "spell_container" | "technique";
    name: string;
    difficulty: Difficulty;
    points: number;
    specialization: string;
    abstract defaults: Set<SkillDefault<SkillLike<any>>>;
    abstract defaultedFrom: SkillDefault<SkillLike<any>>;
    abstract signature: Signature;
    abstract encumbrancePenaltyMultiple: number;
    hasLevels: boolean;
    constructor(list: List<T>);
    abstract getBonus(): number;
    getLevel(): number;
    getBaseRelativeLevel(): -1 | 0 | -2 | -3;
    static getBaseRelativeLevel(difficulty: Difficulty): -1 | 0 | -2 | -3;
    static calculateRelativeLevel(points: number, relativeLevel: number): number;
    calculateLevel(): number;
    static calculateLevel(difficulty: Difficulty, points: number, base?: number, defaultedFrom?: SkillDefault<SkillLike<any>>, bonus?: number, encumbranceLevel?: number, encPenaltyMult?: number): number;
    static getBestDefaultWithPoints<T extends SkillLike<T>>(character: Character, skill: T, defaults: Set<SkillDefault<T>>): SkillDefault<T>;
    static getBestDefault<T extends SkillLike<T>>(character: Character, defaults: Set<SkillDefault<T>>): SkillDefault<T>;
    canSwapDefaults(skill: SkillLike<T>, defaults: Set<SkillDefault<T>>): boolean;
    hasDefaultTo(skill: SkillLike<T>, defaults: Set<SkillDefault<T>>): boolean;
    swapDefault(skill: SkillLike<T>, defaults: Set<SkillDefault<T>>): number;
    loadJSON(json: string | json): void;
}
export declare class Skill extends SkillLike<Skill> {
    version: number;
    tag: string;
    type: "skill" | "skill_container";
    signature: Signature;
    techLevel: string;
    defaults: Set<SkillDefault<SkillLike<any>>>;
    defaultedFrom: SkillDefault<SkillLike<any>>;
    encumbrancePenaltyMultiple: number;
    isTechnique: boolean;
    constructor(list: List<Skill>, isTechnique?: boolean);
    isActive(): boolean;
    childrenPoints(): number;
    getBonus(): any;
    toString(): string;
    static mapSkill(data: gcs.Skill, skill: Skill): Skill;
    toJSON(): {};
    loadJSON(json: string | json): this;
    toR20(): {
        key: string;
        row_id: string;
        data: {
            name: string;
            base: string | number;
            difficulty: string | number;
            bonus: any;
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
export declare class SkillDefault<T extends SkillLike<any>> extends Default<T> {
    level: number;
    adjustedLevel: number;
    points: number;
    constructor(skill: T);
    isSkillBased(): boolean;
    getSkillsNamedFrom(list: List<T>): {
        skills: T[];
        highest: T;
    };
    toJSON(): void;
    loadJSON(data: json): this;
}
export declare enum Difficulty {
    easy = "E",
    average = "A",
    hard = "H",
    very_hard = "VH",
    wildcard = "W"
}
