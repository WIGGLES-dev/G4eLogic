import { AttributeData, HitLocationData } from "@internal";
export interface Config {
    equipment: {
        locations: string[];
    };
    ui: {
        rolling: boolean;
        attributeOrder: string[];
        poolOrder: string[];
    };
    rulesets: {
        useMultiplicativeModifiers: boolean;
        useKnowingYourOwnStrength: boolean;
        useReducedSwingDamage: boolean;
        useNoSchoolGrognardReducedSwingDamage: boolean;
    };
    attributes: Record<string, AttributeData>;
    locations: Record<string, HitLocationData>;
}
export declare function parseHitLocations(locations: Record<string, HitLocationData>): Record<string, HitLocationData>;
