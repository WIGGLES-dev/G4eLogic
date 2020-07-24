import { Feature } from "./misc/feature";
import { Character, Signature } from "./character";
import { FeatureType } from "@gcs/gcs";
import { objectify, json } from "@utils/json_utils";
import { Featurable } from "@character/character";

export class Attribute {
    name: Signature
    character: Character
    level: number
    costPerLevel: number
    defaultLevel: number
    basedOn: () => number

    constructor(
        name: Signature,
        character: Character,
        costPerLevel: number,
        {
            defaultLevel = 0,
            basedOn = () => 0
        }
    ) {
        this.name = name;
        this.character = character;
        this.level = defaultLevel;
        this.costPerLevel = costPerLevel;
        this.defaultLevel = defaultLevel;
        this.basedOn = basedOn;
    }

    setLevel(level: number) { if (level) this.level = level }
    setLevelDelta() { }

    getMod() { return Attribute.bonusReducer(this.character, this.name) }
    pointsSpent() { return this.levelsIncreased() * this.costPerLevel }
    levelsIncreased() { return this.level - this.defaultLevel }
    calculateLevel() { return this.level + this.getMod() + this.basedOn() }


    get displayLevel() { return this.calculateLevel() }
    set displayLevel(level) {
        const mod = this.getMod();
        if (this.defaultLevel) {
            this.level = level - mod;
        } else if (!this.defaultLevel && this.basedOn) {
            this.level = level - this.basedOn() - mod;
        }
    }

    static bonusReducer(sheet: Character, attribute: Signature) {
        return sheet.featureList.getFeaturesByType(FeatureType.attributeBonus).reduce((prev, cur) => {
            if (cur instanceof AttributeBonus) {
                if (cur.ownerIsActive() && cur.attribute?.toString()?.toLowerCase() === attribute?.toString()?.toLowerCase() && !cur.limitation) {
                    prev += cur.getBonus()
                }
            }
            return prev
        }, 0)
    }
}

export class AttributeBonus<T extends Featurable> extends Feature<T> {
    attribute: Signature
    constructor(owner: T) {
        super(owner, FeatureType.attributeBonus);
    }
}