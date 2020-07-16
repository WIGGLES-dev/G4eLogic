import { Character } from "./character";
export declare class Attribute {
    sheet: Character;
    level: number;
    costPerLevel: number;
    defaultLevel: number;
    basedOn: () => number;
    constructor(sheet: Character, costPerLevel: number, { defaultLevel, basedOn }: {
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
    static bonusReducer(sheet: Character, attribute: string): number;
}
