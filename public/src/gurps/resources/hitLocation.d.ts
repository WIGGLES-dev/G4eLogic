import { Resource } from "@internal";
export interface HitLocationData {
    isGroup?: boolean;
    subLocations?: string[];
    has?: string[];
    hitPenalty?: number;
    crippleDivisor?: number;
    hitRange?: number[];
    naturalDR?: number;
}
export declare class HitLocation {
    host: Resource;
    keys: HitLocationData;
    name: string;
    locations: Record<string, HitLocation>;
    context: {
        armorBonus: number;
        hitPoints: number;
    };
    constructor(host: Resource, keys: HitLocationData, name: string, locations: Record<string, HitLocation>, context: HitLocation["context"]);
    get subLocations(): HitLocation[];
    get damageTaken(): any;
    set damageTaken(damage: any);
    setDamageTaken(damage: number): void;
    isCrippled(): boolean;
    crippleThreshold(): number;
}
