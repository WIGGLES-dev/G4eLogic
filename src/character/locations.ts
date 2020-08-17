import { Character } from "./character";
import { CharacterElement } from "./misc/element";
import { FeatureType } from "@gcs/gcs";
import { Collection } from "./misc/collection";
import { DRBonus } from "./misc/feature";
import { Featurable } from "index";

export class LocationList {
    character: Character
    #locations: Collection<string, HitLocation> = new Collection()

    constructor(character: Character) {
        this.character = character

        Object.values(Locations).forEach(location => {
            this.addLocation(new HitLocation(character, location));
        });
    }

    getLocation(location: string) {
        let targetLocation = this.#locations.get(location);
        if (targetLocation && targetLocation instanceof HitLocation) {
            return targetLocation
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

    constructor(character: Character, name: string, keys: string[] = []) {
        super(character, [...keys, ...HitLocation.keys]);
        this.name = name;
    }
    /**
     * Looks at all the DRBonus features on the character that match the locations name and sums them up.
     */
    armorValue(): number {
        return this.getArmorFeatures().reduce((prev, cur) => {
            if (cur instanceof DRBonus) {
                if (cur.location.toLowerCase() === this.name.toLowerCase()) prev += cur.getBonus();
                if (cur.location.toLowerCase() === Locations.full_body.toLowerCase()) prev += cur.getBonus();
            }
            return prev
        }, 0);
    }
    
    getArmorFeatures(): DRBonus<Featurable>[] {
        return this.character.featureList.getFeaturesByType(FeatureType.damageResistanceBonus).filter(feature => {
            if (feature instanceof DRBonus) {
                if (feature.location.toLowerCase() === this.name.toLowerCase()) return true
                if (feature.location.toLowerCase() === Locations.full_body.toLowerCase()) return true
            }
        }) as DRBonus<Featurable>[];
    }
}

enum Locations {
    skull = "Skull",
    face = "Face",
    eyes = "Eyes",
    neck = "Neck",
    arms = "Arms",
    hands = "Hands",
    torso = "Torso",
    vitals = "Vitals",
    groin = "Groin",
    legs = "Legs",
    feet = "Feet",
    full_body = "Full_Body",
}