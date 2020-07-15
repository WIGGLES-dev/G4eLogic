import { Feature, FeatureType } from "./misc/feature";
import { Character } from "./character";

export class Attribute {
    sheet: Character
    level: number
    costPerLevel: number
    defaultLevel: number
    basedOn: () => number

    constructor(
        sheet: Character,
        costPerLevel: number,
        {
            defaultLevel = 0,
            basedOn = () => 0
        }
    ) {
        this.sheet = sheet
        this.level = defaultLevel;
        this.costPerLevel = costPerLevel;
        this.defaultLevel = defaultLevel;
        this.basedOn = basedOn;
    }

    setLevel(level: number) { if (level) this.level = level }
    setLevelDelta() { }

    getMod() { return 0 }
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

    static bonusReducer(sheet: Character, attribute: string) {
        return 0
    }
}

class AttributeBonus extends Feature<any> {
    element: Element
    constructor(element: Element) {
        super(element, FeatureType.attributeBonus);
        this.element = element;
    }
    get attribute() { return this.element.querySelector("attribute")?.textContent ?? "" }
}