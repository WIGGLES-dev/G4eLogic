import * as jp from "jsonpath"
import { ArmorBonus, FeatureBonusType, debounce, Character, Resource } from "@internal";
export interface HitLocationData {
    isGroup?: boolean
    subLocations?: string[]
    has?: string[]
    hitPenalty?: number
    crippleDivisor?: number
    hitRange?: number[]
    naturalDR?: number
}

export class HitLocation {
    host: Resource
    keys: HitLocationData
    name: string
    locations: Record<string, HitLocation>
    context: {
        armorBonus: number
        hitPoints: number
    }
    constructor(host: Resource, keys: HitLocationData, name: string, locations: Record<string, HitLocation>, context: HitLocation["context"]) {
        this.host = host;
        this.keys = keys;
        this.name = name;
        this.locations = locations;
        this.context = context
    }
    get subLocations() {
        return this.keys.subLocations?.map(
            subLocation => this.locations[subLocation]) ?? []
    }
    get damageTaken() { return this.host.getKeys().hitLocationDamage[this.name] || 0 }
    set damageTaken(damage) { this.setDamageTaken(damage) }
    @debounce(220)
    setDamageTaken(damage: number) {
        this.host.sub('hitLocationDamage').sub(this.name).value = damage;
    }
    isCrippled() {
        return this.crippleThreshold() > 0 && this.damageTaken > this.crippleThreshold()
    }
    crippleThreshold() {
        return (this.context?.hitPoints / this.keys.crippleDivisor) || 0
    }
}