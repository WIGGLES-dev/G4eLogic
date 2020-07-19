import { Feature } from "./misc/feature";
import { Character, Signature } from "./character";
import { json } from "utils/json_utils";
import { Featurable } from "@character/character";
export declare class Attribute {
    name: Signature;
    character: Character;
    level: number;
    costPerLevel: number;
    defaultLevel: number;
    basedOn: () => number;
    constructor(name: Signature, character: Character, costPerLevel: number, { defaultLevel, basedOn }: {
        defaultLevel?: number;
        basedOn?: () => number;
    });
    setLevel(level: number): void;
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
    attribute: Signature;
    constructor(owner: T);
    loadJSON(json: json): this;
}
