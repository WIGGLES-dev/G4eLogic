import { Character } from "../character";
import { CharacterElement } from "./element";
import { Weapon } from "@character/weapon";
import { Feature } from "./feature";
export declare class Group extends CharacterElement<any> {
    name: string;
    weapons: Set<Weapon<any>>;
    features: Set<Feature<any>>;
    character: Character;
    constructor(groupName: string, character: Character, keys?: string[]);
    getCharacter(): Character;
}
