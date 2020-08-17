import { Feature } from "./misc/feature";
import { Character, Signature } from "./character";
import { FeatureType } from "@gcs/gcs";
import { Featurable } from "@character/character";
import { CharacterElement } from "./misc/element";
import { Collection } from "./misc/collection";
export declare class AttributeList {
    static keys: any[];
    character: Character;
    attributes: Collection<Signature, Attribute>;
    constructor(character: Character, keys?: string[]);
    getAttribute(attribute: Signature): Attribute;
    addAttribute({ signature, costPerLevel, defaultLevel, basedOn }: {
        signature?: string;
        costPerLevel?: number;
        defaultLevel?: number;
        basedOn?: () => any;
    }): void;
}
export declare class Attribute extends CharacterElement<Attribute> {
    static keys: string[];
    name: string;
    character: Character;
    level: number;
    costPerLevel: number;
    defaultLevel: number;
    basedOn: () => number;
    constructor(name: string, character: Character, costPerLevel: number, { defaultLevel, basedOn }: {
        defaultLevel?: number;
        basedOn?: () => number;
    }, keys?: string[]);
    setLevel(level: number): number;
    setLevelDelta(): void;
    getMod(): number;
    pointsSpent(): number;
    levelsIncreased(): number;
    calculateLevel(): number;
    get displayLevel(): number;
    set displayLevel(level: number);
    static bonusReducer(sheet: Character, attribute: string): number;
}
export declare class AttributeBonus<T extends Featurable> extends Feature<T> {
    static type: FeatureType;
    static keys: string[];
    attribute: string;
    constructor(owner: T, keys?: string[]);
}
