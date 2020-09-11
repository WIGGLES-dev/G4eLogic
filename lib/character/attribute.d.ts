import { Feature } from "./misc/feature";
import { Character } from "./character";
import { FeatureType } from "@gcs/gcs";
import { Featurable } from "@character/character";
import { CharacterElement } from "./misc/element";
import { Collection } from "./misc/collection";
export declare class AttributeList {
    static keys: any[];
    character: Character;
    attributes: Collection<string, Attribute>;
    constructor(character: Character, keys?: string[]);
    private configureAttributes;
    signatureOptions(): string[];
    getAttribute(attribute: string): Attribute;
    addAttribute({ signature, costPerLevel, defaultLevel, basedOn }: {
        signature: any;
        costPerLevel?: number;
        defaultLevel?: number;
        basedOn?: () => any;
    }): Attribute;
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
        basedOn?: () => any;
    }, keys?: string[]);
    setLevel(level: number): number;
    setLevelDelta(): void;
    getMod(): number;
    getModList(): AttributeBonus<any>[];
    pointsSpent(): number;
    levelsIncreased(): number;
    calculateLevel(): number;
    get displayLevel(): number;
    set displayLevel(level: number);
}
export declare class AttributeBonus<T extends Featurable> extends Feature<T> {
    static type: FeatureType;
    static keys: string[];
    attribute: string;
    constructor(owner: T, keys?: string[]);
}
