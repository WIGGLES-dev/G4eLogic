import { Character } from "./character";
import { CharacterElement } from "./misc/element";
import { DRBonus } from "./misc/feature";
import { Featurable } from "index";
export declare class LocationList {
    #private;
    character: Character;
    constructor(character: Character);
    getLocation(location: string): HitLocation;
    addLocation(location: HitLocation): void;
}
declare class HitLocation extends CharacterElement<HitLocation> {
    static keys: any[];
    name: string;
    constructor(character: Character, name: string, keys?: string[]);
    armorValue(): number;
    getArmorFeatures(): DRBonus<Featurable>[];
}
export {};
