import { Character, Signature } from "./character";
import { Feature } from "./features/feature";
import { AttributeBonus } from "./features/modules/AttributeBonus";
import { CharacterElement } from "./misc/element";
import { ListItem } from "./misc/list";

export class AttributeList {
    static keys = []
    character: Character
    attributes: Map<string, Attribute> = new Map()

    constructor(character: Character, keys: string[] = []) {
        this.character = character
        this.configureAttributes(character);
        this.character.Hooks.on("reconfigure", this.configureAttributes.bind(this));
    }

    private configureAttributes(character) {
        const CONFIG = character.config.getConfig();
        this.attributes.clear();
        Object.entries(CONFIG.attributes).forEach(([key, attribute]: [string, any]) => {
            const basedOn = new Function(attribute.based_on).bind(this);
            const attr = new Attribute(
                attribute.name,
                attribute.signature,
                this.character,
                {
                    costPerLevel: attribute.cost_per_level,
                    defaultLevel: attribute.default_level,
                    basedOn: attribute.based_on === undefined ? () => null : basedOn,
                    tags: attribute.tags,
                    increment: attribute.increment,
                    abbreviation: attribute.abbreviation,
                    color: attribute.color
                },
            );
            attr.ui.tooltip = attribute.tooltip || "";
            this.attributes.set(attribute.signature, attr);
        });
    }

    signatureOptions() { return Array.from(this.attributes.values()).map(attribute => attribute.name) }

    getAttribute(attribute: string) {
        return this.attributes.get(attribute)
    }
}

export class Attribute extends CharacterElement {
    static keys = ["name", "level", "currentValue", "costPerLevel", "defaultLevel", "modifier", "color"]

    ui: any = {}

    name: string
    signature: string
    abbreviation: string
    character: Character
    level: number
    currentValue: number
    tempValue: number
    costPerLevel: number
    defaultLevel: number
    basedOn: () => number
    modifier = 0
    tags: string[]
    increment: number
    color: string
    substats: string[]

    constructor(
        name: string,
        signature: string,
        character: Character,
        {
            costPerLevel = 0,
            defaultLevel = 0,
            basedOn = () => null,
            tags = [],
            increment = 1,
            substats = [],
            abbreviation,
            color = "transparent"
        },
        currentValue?: number,
        tempValue: number = 0,
        keys: string[] = []
    ) {
        super(character, [...keys, ...Attribute.keys]);
        this.name = name;
        this.signature = signature;
        this.character = character;
        this.level = defaultLevel;
        this.costPerLevel = costPerLevel;
        this.defaultLevel = defaultLevel;
        this.basedOn = basedOn;
        this.tags = tags;
        this.increment = increment;
        this.substats = substats;
        this.currentValue = currentValue || defaultLevel;
        this.tempValue = tempValue;
        this.abbreviation = abbreviation || name
        this.color = color;
    }

    get unmodifiedLevel() { return this.calculateLevel() - this.modifier }

    setLevel(level: number) { this.setValue({ level }, { update: false }); return level }
    setLevelDelta() { }

    getMod() {
        return this.getModList().reduce((prev, cur) => prev + cur.getBonus(), 0)
    }

    hasTag(tag: string) { return this.tags.includes(tag) }

    getModList() {
        const attributeName = this.signature;
        return this.character.featureList.getFeaturesByType(AttributeBonus).filter((feature) => {
            return feature.type instanceof AttributeBonus && feature.ownerIsActive() && feature.type.attribute.toLowerCase() === attributeName.toLowerCase()
        }) as Feature[]
    }

    pointsSpent() { return this.levelsIncreased() * this.costPerLevel }
    levelsIncreased() { return this.level - this.defaultLevel }
    calculateLevel() { return this.level + (this.getMod() || 0) + this.basedOn() + this.modifier }

    get displayLevel() { return this.calculateLevel() }
    set displayLevel(level) {
        const mod = this.getMod();
        if (this.defaultLevel) {
            this.level = level - mod - this.modifier;
        } else if (!this.defaultLevel && this.basedOn) {
            this.level = level - this.basedOn() - mod - this.modifier;
        }
    }
}

// class Pool extends Attribute {
//     constructor() {
//         super();
//     }
// }

