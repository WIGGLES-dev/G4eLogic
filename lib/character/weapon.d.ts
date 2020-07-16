import { Featurable } from "./character";
import { json } from "../utils/json_utils";
export declare abstract class Weapon<T extends Featurable> {
    owner: T;
    constructor(owner: T);
    toJSON(): void;
    loadJSON(object: string | json): void;
}
