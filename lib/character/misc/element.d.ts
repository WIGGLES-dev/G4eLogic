import { json } from "../../utils/json_utils";
export declare abstract class CharacterElement<T extends CharacterElement<T>> {
    uuid: string;
    r20rowID: string;
    reference: string;
    userDescription: string;
    notes: string;
    categories: Set<string>;
    constructor();
    toJSON(): void;
    loadJSON(object: string | json): void;
}
