import { Character } from "index";
import { List } from "@character/misc/list";
export declare type Constructor<T = {}> = new (...arger: any[]) => T;
export declare abstract class Serializer {
    abstract scope: string;
    transformers: Map<Constructor | string, {
        save: any;
        load: any;
    }>;
    constructor();
    static purgeObject(object: any): any;
    abstract init(): void;
    register(key: Constructor | string, transformer: {
        save: any;
        load: any;
    }): this;
    static reverseMap(input: string): void;
    abstract loadList(list: List<any>, data: any[]): List<any>;
    abstract saveList(list: List<any>): any;
    abstract load(character: Character, data: any): Character;
    abstract save(character: Character): any;
}
