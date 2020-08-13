import { Feature } from "./misc/feature";
import { Character, Signature } from "./character";
import { FeatureType } from "@gcs/gcs";
import { Featurable } from "@character/character";
import { CharacterElement } from "./misc/element";
export declare class Attribute extends CharacterElement<Attribute> {
    static keys: string[];
    name: Signature;
    character: Character;
    level: number;
    costPerLevel: number;
    defaultLevel: number;
    basedOn: () => number;
    constructor(name: Signature, character: Character, costPerLevel: number, { defaultLevel, basedOn }: {
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
    static bonusReducer(sheet: Character, attribute: Signature): number;
}
export declare class AttributeBonus<T extends Featurable> extends Feature<T> {
    static type: FeatureType;
    static keys: string[];
    attribute: Signature;
    constructor(owner: T, keys?: string[]);
}
