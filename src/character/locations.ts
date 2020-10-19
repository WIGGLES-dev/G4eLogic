import { Character, Signature } from "./character";
import { CharacterElement } from "./misc/element";
import { Equipment } from "./equipment/equipment";
import { DRBonus } from "./features/modules/DRBonus";
import { Feature } from "./features/feature";

export class LocationList {
    character: Character
    locations: Map<string, HitLocation> = new Map()

    constructor(character: Character) {
        this.character = character
        this.configureLocations(character);
        this.character.Hooks.on("reconfigure", this.configureLocations.bind(this));
    }

    private configureLocations(character) {
        const CONFIG = character.config.getConfig();
        this.locations.clear()
        Object.entries(CONFIG.locations).forEach(([key, location]: [string, any]) => {
            if (location.has) {
                location.has.forEach(extraLocation => {
                    const locationName = `${extraLocation} ${key}`;
                    const newLocation = new HitLocation(this.character, locationName, location.cripple_ratio, location.hit_penalty, location.hit_range);
                    newLocation.has = location.has || null;
                    newLocation.location = key
                    newLocation.hasSubLocations = location.is_group;
                    newLocation.subLocationNames = location.sub_locations?.map(location => `${extraLocation} ${location}`) ?? []
                    this.locations.set(locationName, newLocation);
                });
            } else {
                const newLocation = new HitLocation(this.character, key, location.cripple_ratio, location.hit_penalty, location.hit_range);
                newLocation.has = location.has || null;
                newLocation.location = key
                newLocation.hasSubLocations = location.is_group;
                newLocation.subLocationNames = location.sub_locations?.map(location => `${location}`) ?? []
                this.locations.set(key, newLocation);
            }
        });
    }
    getLocation(location: string) {
        let targetLocation = this.locations.get(location);
        if (targetLocation && targetLocation instanceof HitLocation) {
            return targetLocation
        } else {

        }
    }
    addLocation({ location, crippleRatio = null, hitsOn = [], hitPenalty = 0 }) {
        const hitLocation = new HitLocation(
            this.character,
            location,
            crippleRatio,
            hitPenalty,
            hitsOn,
        )
        this.locations.set(location, hitLocation);
    }
}

export class HitLocation extends CharacterElement {
    static keys = ["damageTaken"]
    damageTaken = 0

    name: string
    location: string

    has: string[] = null
    hasSubLocations = false;
    subLocationNames: string[] = null

    equippedItems: Set<Equipment> = new Set()

    crippleRatio
    hitPenalty
    hitsOn: number[]

    constructor(character: Character, name: string, crippleRatio = null, hitPenalty: number = 0, hitsOn: number[] = [], keys: string[] = []) {
        super(character, [...keys, ...HitLocation.keys]);
        this.name = name;
        this.crippleRatio = crippleRatio
        this.hitPenalty = hitPenalty;
        this.hitsOn = hitsOn;
    }

    get key() { return this.name.split(" ").join("_") }

    getSubLocations() {
        return this.subLocationNames.map(name => {
            const location = this.character.locationList.getLocation(name);
            return this.character.locationList.getLocation(name)
        });
    }

    equip(equipment: Equipment) {
        if (equipment.boundLocation instanceof HitLocation) return false
        equipment.boundLocation = this;
        this.equippedItems.add(equipment);
    }
    crippleThreshold() { return this.character.getAttribute(Signature.HP).calculateLevel() / this.crippleRatio }
    /**
     * Tests if this limb is crippled based on the formula provided in character
     * configuration. If the function fails will return false
     */
    isCrippled() {
        try {
            return this.damageTaken > this.crippleThreshold();
        } catch (err) {
            return false
        }
    }
    /**
     * Looks at all the DRBonus features on the character that match the locations name and sums them up.
     */
    armorValue(): number {
        return this.getArmorFeatures().reduce((prev, cur) => {
            if (cur.core instanceof DRBonus) {
                if (cur.core.location.toLowerCase() === this.name.toLowerCase()) prev += cur.getBonus();
            }
            return prev
        }, 0);
    }
    getArmorFeatures() {
        return this.character.featureList.getFeaturesByType(DRBonus).filter(feature => {
            if (feature.core instanceof DRBonus) {
                if (feature.core.location?.toLowerCase() === this.name?.toLowerCase()) return true
            }
        }) as Feature[];
    }
}