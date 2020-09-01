import { ListItem, List } from "./list";
import { Character, Featurable } from "../character";
import { CharacterElement } from "./element";
import { Collection } from "./collection";
import { Weapon } from "@character/weapon";
import { Feature } from "./feature";

export class Group extends CharacterElement<any> {
    name: string

    weapons: Set<Weapon<any>> = new Set()
    features: Set<Feature<any>> = new Set()

    character: Character

    constructor(groupName: string, character: Character, keys: string[] = []) {
        super(character, keys);
        this.character = character;
        this.name = groupName;
    }

    getCharacter() { return this.character }
}