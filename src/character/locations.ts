import { Character, Signature } from "./character";
import { CharacterElement } from "./misc/element";
import { Collection } from "./misc/collection";
import { DRBonus, FeatureType } from "./misc/feature";
import { Equipment } from "./equipment/equipment";

export class LocationList {
    character: Character
    locations: Map<string, HitLocation> = new Map()

    constructor(character: Character) {
        this.character = character
        this.configureLocations(character);
        this.character.Hooks.on("reconfigure", this.configureLocations.bind(this));
    }

    private configureLocations(character) {
        const CONFIG = character.config;
        this.locations.clear()
        Object.entries(CONFIG.locations).forEach(([key, location]: [string, any]) => {
            const cripplesOn = new Function(location.cripples_on) as (damageTaken, maxHP) => boolean;
            this.addLocation({
                location: location.location,
                hitsOn: location.hits_on,
                hitPenalty: location.hit_penalty,
                crippleRatio: location.cripple_ratio,
                cripplesOn: location.cripples_on === undefined ? (damageTaken, maxHP) => false : cripplesOn
            })
        });
    }
    getLocation(location: string) {
        let targetLocation = this.locations.get(location);
        if (targetLocation && targetLocation instanceof HitLocation) {
            return targetLocation
        } else {

        }
    }
    addLocation({ location, crippleRatio = null, hitsOn = [], hitPenalty = 0, cripplesOn = (damageTaken, maxHP) => false }) {
        const hitLocation = new HitLocation(
            this.character,
            location,
            crippleRatio,
            hitPenalty,
            hitsOn,
            cripplesOn
        )
        this.locations.set(location, hitLocation);
    }
}

export class HitLocation extends CharacterElement {
    static keys = ["crippleThreshold", "damageTaken"]
    damageTaken = 0

    equippedItems: Set<Equipment> = new Set()
    name: string
    crippleThresholdFormula: (damageTaken: number, maxHP: number) => boolean
    crippleRatio
    hitPenalty
    hitsOn: number[]

    constructor(character: Character, name: string, crippleRatio = null, hitPenalty: number = 0, hitsOn: number[] = [], cripplesOn = (damageTaken: number, maxHP: number) => false, keys: string[] = []) {
        super(character, [...keys, ...HitLocation.keys]);
        this.name = name;
        this.crippleRatio = crippleRatio
        this.crippleThresholdFormula = cripplesOn
        this.hitPenalty = hitPenalty;
        this.hitsOn = hitsOn;
    }

    equip(equipment: Equipment) {
        if (equipment.boundLocation instanceof HitLocation) return false
        equipment.boundLocation = this;
        this.equippedItems.add(equipment);
    }

    /**
     * Tests if this limb is crippled based on the formula provided in character
     * configuration. If the function fails will return false
     */
    isLimbCrippled() {
        try {
            return this.crippleThresholdFormula(this.damageTaken, this.character.getAttribute(Signature.HP).calculateLevel());
        } catch (err) {
            return false
        }
    }
    /**
     * Looks at all the DRBonus features on the character that match the locations name and sums them up.
     */
    armorValue(): number {
        return this.getArmorFeatures().reduce((prev, cur) => {
            if (cur instanceof DRBonus) {
                if (cur.location.toLowerCase() === this.name.toLowerCase()) prev += cur.getBonus();
            }
            return prev
        }, 0);
    }
    getArmorFeatures(): DRBonus[] {
        return this.character.featureList.getFeaturesByType(FeatureType.damageResistanceBonus).filter(feature => {
            if (feature instanceof DRBonus) {
                if (feature.location.toLowerCase() === this.name.toLowerCase()) return true
            }
        }) as DRBonus[];
    }
}