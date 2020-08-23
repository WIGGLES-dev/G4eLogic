import { Character } from "../character";
import { CharacterElement } from "./element";
import { Collection } from "./collection";
export declare class Group<T> extends CharacterElement<any> {
    groupName: string;
    name: string;
    contents: Collection<string, T>;
    constructor(groupName: string, character: Character, keys?: string[]);
}
