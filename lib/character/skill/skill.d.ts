import { Signature, Character } from "../character";
import { List, ListItem } from "../misc/list";
import { SkillBonus } from "../misc/feature";
import { Default } from "../misc/default";
export declare class SkillList extends List<Skill> {
    constructor(character: Character);
    populator(): any;
    sumSkills(): number;
}
export declare abstract class SkillLike<T extends SkillLike<T>> extends ListItem<T> {
    abstract type: "skill" | "skill_container" | "spell" | "spell_container" | "technique";
    static keys: string[];
    name: string;
    difficulty: Difficulty;
    points: number;
    specialization: string;
    gMod: number;
    abstract defaults: Set<SkillDefault<SkillLike<any>>>;
    abstract defaultedFrom: SkillDefault<SkillLike<any>>;
    abstract signature: Signature;
    abstract encumbrancePenaltyMultiple: number;
    hasLevels: boolean;
    constructor(list: List<T>, keys: string[]);
    abstract getBonus(): number;
    getLevel(): number;
    getAttribute(): import("../attribute").Attribute;
    getRelativeLevel(): number;
    getBaseRelativeLevel(): -2 | 0 | -3 | -1;
    calculateRelativeLevel(relativeLevel?: number): number;
    calculateLevel({ withBonuses, considerDefaults, buyLevelFromDefault }?: {
        withBonuses?: boolean;
        considerDefaults?: boolean;
        buyLevelFromDefault?: boolean;
    }): number;
    getBestDefaultWithPoints<T extends SkillLike<T>>(): SkillDefault<any>;
    getBestDefault<T extends SkillLike<T>>(): SkillDefault<SkillLike<T>>;
    isInDefaultChain(skillLike: SkillLike<any>, skillDefault: Default<SkillLike<any>>, lookedAt?: Set<unknown>): boolean;
    canSwapDefault(skill: Skill): boolean;
    hasDefaultTo(skill: SkillLike<any>): boolean;
}
export declare class Skill extends SkillLike<Skill> {
    static keys: string[];
    version: number;
    tag: string;
    type: "skill" | "skill_container";
    signature: Signature;
    techLevel: string;
    defaults: Set<SkillDefault<SkillLike<any>>>;
    defaultedFrom: SkillDefault<SkillLike<any>>;
    encumbrancePenaltyMultiple: number;
    isTechnique: boolean;
    constructor(list: List<Skill>, keys?: string[]);
    isActive(): boolean;
    childrenPoints(): number;
    getBonus(): number;
    getModList(): SkillBonus<any>[];
    addDefault(): SkillDefault<Skill>;
}
export declare class SkillDefault<T extends SkillLike<any>> extends Default<T> {
    static keys: string[];
    tag: string;
    level: number;
    adjustedLevel: number;
    points: number;
    constructor(skill: T, keys?: string[]);
    getLookupList(): SkillList;
    save(): any;
    load(data: any): any;
}
export declare enum Difficulty {
    easy = "E",
    average = "A",
    hard = "H",
    very_hard = "VH",
    wildcard = "W"
}
