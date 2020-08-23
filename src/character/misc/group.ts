import { ListItem, List } from "./list";
import { Character, Featurable } from "../character";
import { CharacterElement } from "./element";
import { Collection } from "./collection";

export class Group<T> extends CharacterElement<any> {
    groupName: string
    name: string = ""
    contents: Collection<string, T>

    constructor(groupName: string, character: Character, keys: string[] = []) {
        super(character, keys);
        this.groupName = groupName;
    }
}