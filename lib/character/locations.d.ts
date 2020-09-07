import { Character } from "./character";
import { CharacterElement } from "./misc/element";
import { Collection } from "./misc/collection";
import { DRBonus } from "./misc/feature";
import { Featurable } from "index";
import { Equipment } from "./equipment/equipment";
export declare class LocationList {
    character: Character;
    locations: Collection<string, HitLocation>;
    constructor(character: Character);
    private configureLocations;
    getLocation(location: string): HitLocation;
    addLocation({ location, crippleRatio, hitsOn, hitPenalty, cripplesOn }: {
        location: any;
        crippleRatio?: any;
        hitsOn?: any[];
        hitPenalty?: number;
        cripplesOn?: (damageTaken: any, maxHP: any) => boolean;
    }): void;
}
export declare class HitLocation extends CharacterElement<HitLocation> {
    static keys: string[];
    damageTaken: number;
    equippedItems: Set<Equipment>;
    name: string;
    crippleThresholdFormula: (damageTaken: number, maxHP: number) => boolean;
    crippleRatio: any;
    hitPenalty: any;
    hitsOn: number[];
    constructor(character: Character, name: string, crippleRatio?: any, hitPenalty?: number, hitsOn?: number[], cripplesOn?: (damageTaken: number, maxHP: number) => boolean, keys?: string[]);
    equip(equipment: Equipment): boolean;
    isLimbCrippled(): boolean;
    armorValue(): number;
    getArmorFeatures(): DRBonus<Featurable>[];
}
