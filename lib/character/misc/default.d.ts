import { SkillLike } from "@character/skill/skill";
import { CharacterElement } from "./element";
import { Signature } from "@character/character";
import { ListItem, List } from "./list";
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
    abstract getLookupList(): List<SkillLike<any>>;
    isSkillBased(): boolean;
    getHighestMatchLevel({ withBonuses }?: {
        withBonuses?: boolean;
    }): number;
    getMatches(): {
        skills: SkillLike<any>[];
        highest: SkillLike<any>;
    };
}
