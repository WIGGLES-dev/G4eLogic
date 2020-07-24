import { SkillLike } from "@character/skill";
import { CharacterElement } from "./element";
declare enum DefaultType {
    skill = "Skill"
}
export declare abstract class DefaultList {
}
export declare abstract class Default<T extends SkillLike<any>> extends CharacterElement<T> {
    tag: string;
    type: DefaultType;
    modifier: number;
    name?: string;
    specialization?: string;
    owner: T;
    constructor(owner: T);
}
export {};
