import { Featurable } from "./character";
import { json } from "@utils/json_utils";
import { ListItem } from "./misc/list";
import { Default } from "./misc/default";
export declare abstract class Weapon<T extends Featurable> {
    owner: T;
    defaults: Set<WeaponDefault<T>>;
    constructor(owner: T);
    toJSON(): void;
    loadJSON(object: string | json): void;
}
declare class WeaponDefault<T extends ListItem<any>> extends Default<T> {
    constructor(owner: T);
}
export {};
