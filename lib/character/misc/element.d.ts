import { json } from "@utils/json_utils";
export declare abstract class CharacterElement<T extends CharacterElement<T>> {
    uuid: string;
    r20rowID: string;
    foundryID: string;
    reference: string;
    userDescription: string;
    notes: string;
    categories: Set<string>;
    constructor(foundryID?: string);
    static mapElement(data: json, element: CharacterElement<any>): void;
    toJSON(): void;
    loadJSON(object: string | json): void;
}
