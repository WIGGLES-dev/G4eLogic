import { Trait } from "../trait";
import { Item } from "../equipment";
import { json } from "../../utils/json_utils";
import { CharacterElement } from "./element";
export declare type Modifiable = Trait | Item;
export declare abstract class Modifier<T extends Modifiable> extends CharacterElement<T> {
    static version: number;
    enabled: boolean;
    name: string;
    owner: T;
    constructor(owner: T);
    toJSON(): void;
    loadJSON(object: string | json): void;
    static extractValue(value: string): number;
}
