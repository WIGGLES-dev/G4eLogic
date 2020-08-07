import { Trait } from "../trait";
import { Equipment } from "../equipment";
import { CharacterElement } from "./element";
export declare type Modifiable = Trait | Equipment;
export declare abstract class Modifier<T extends Modifiable> extends CharacterElement<T> {
    static keys: string[];
    abstract version: number;
    abstract tag: string;
    enabled: boolean;
    name: string;
    owner: T;
    constructor(owner: T, keys: string[]);
    save(): any;
    load(data: any): any;
    static extractValue(value: string): number;
}
