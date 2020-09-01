import { Skill } from "@character/skill/skill";
import { CharacterElement } from "./element";
import { Signature } from "@character/character";
import { ListItem } from "./list";
export declare enum DefaultType {
    skill = "Skill",
    parry = "Parry",
    block = "Block"
}
export declare abstract class DefaultList {
}
export declare abstract class Default<T extends ListItem<any>> extends CharacterElement<T> {
    static keys: string[];
    tag: string;
    type: DefaultType | Signature;
    modifier: number;
    name?: string;
    specialization?: string;
    owner: T;
    constructor(owner: T, keys: string[]);
    isSkillBased(): boolean;
    getHighestMatchLevel({ withBonuses }?: {
        withBonuses?: boolean;
    }): number;
    getMatches(): {
        skills: Skill[];
        highest: Skill;
    };
}
