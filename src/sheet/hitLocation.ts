import { Sheet } from "./feature";
import { HitLocationData } from "./keys";

export class HitLocation {
    #sheet: Sheet
    keys: HitLocationData
    constructor(sheet: Sheet, keys: HitLocationData, location: string) {
        this.#sheet = sheet;
        this.keys = keys;
    }
}