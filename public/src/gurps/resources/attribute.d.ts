import { Resource } from "@internal";
export interface AttributeData {
    isPool?: boolean;
    abbreviation?: string;
    tooltip?: string;
    costPerLevel?: number;
    defaultLevel?: number;
    basedOn?: string;
    increment?: number;
    skillSignature?: boolean;
    substats?: string[];
    tags?: string[];
    color?: string;
}
export interface AttributeLevel {
    level: number;
    mod: number;
    current: number;
}
export declare class Attribute {
    host: Resource;
    keys: AttributeData;
    signature: string;
    attributes: Record<string, Attribute>;
    bonus: number;
    selector: string;
    get attribute(): any;
    constructor(host: Resource, keys: AttributeData, signature: string, attributes: Record<string, Attribute>, bonus?: number);
    get level(): any;
    set level(level: any);
    updateLevel(level: any): void;
    get modifier(): number;
    set modifier(mod: number);
    updateModifier(mod: any): void;
    get unmodifiedLevel(): number;
    get displayLevel(): number;
    set displayLevel(level: number);
    calculateLevel(): number;
    basedOn(): number;
    pointsSpent(): number;
    levelsIncreased(): number;
    hasTag(tag: string): boolean;
    get costPerLevel(): number;
    get currentValue(): any;
    set currentValue(val: any);
    setCurrentValue(currentValue: number): void;
}
