import { Sheet } from "./sheet";
import * as jp from "jsonpath"
import { KeyList } from "@internal";

export interface HitLocationData {
    isGroup?: boolean
    subLocations?: string[]
    has?: string[]
    hitPenalty?: number
    crippleRatio?: number
    hitRange?: number[]
    naturalDR?: number
}


export class HitLocation {
    #sheet: Sheet
    get sheet() { return this.#sheet }
    #keys: HitLocationData
    get keys() { return this.#keys }
    #location: string
    get location() { return this.#location }
    #locations: KeyList<HitLocation>
    get locations() { return this.#locations }
    constructor(sheet: Sheet, keys: HitLocationData, location: string, locations: KeyList<HitLocation>) {
        this.#sheet = sheet;
        this.#keys = keys;
        this.#location = location
        this.#locations = locations
    }
    get subLocations() { return this.keys.subLocations?.map(subLocation => this.locations[subLocation]) ?? [] }
    get damageTaken() { return this.sheet.keys.hitLocationDamage[this.location] || 0 }
    set damageTaken(damage) { this.sheet.update((data) => { data.keys.hitLocationDamage[this.location] = damage }) }
    get armor() { return 0 }

    isCrippled() {
        return this.damageTaken > this.crippleThreshold()
    }
    crippleThreshold() {
        const pools = this.sheet.pools;
        return pools["hit points"]?.calculateLevel() / this.keys.crippleRatio || NaN
    }
}