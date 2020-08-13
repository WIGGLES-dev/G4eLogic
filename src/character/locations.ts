import { Character } from "./character";
import { CharacterElement } from "./misc/element";
import { FeatureType } from "@gcs/gcs";

class LocationList {
    character: Character
    #locations: Map<string, HitLocation> = new Map()

    constructor(character: Character) {
        this.character = character
    }

    getLocation(location: string) {
        let targetLocation = this.#locations.get(location);
        if (targetLocation && targetLocation instanceof HitLocation) {

        } else {

        }
    }

    addLocation(location: HitLocation) {
        this.#locations.set(location.name, location);
    }
}

class HitLocation extends CharacterElement<HitLocation> {
    static keys = []
    name: string

    constructor(character: Character, keys: string[] = []) {
        super(character, [...keys, ...HitLocation.keys]);
    }

    armorValue(): number {
        this.character.featureList.getFeaturesByType(FeatureType.damageResistanceBonus)
        return 0
    }
}