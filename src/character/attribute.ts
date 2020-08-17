import { Feature } from "./misc/feature";
import { Character, Signature } from "./character";
import { FeatureType } from "@gcs/gcs";
import { Featurable } from "@character/character";
import { CharacterElement } from "./misc/element";
import { Collection } from "./misc/collection";

export class AttributeList {
    static keys = []
    character: Character
    attributes: Collection<Signature, Attribute> = new Collection

    constructor(character: Character, keys: string[] = []) {
        this.character = character

        this.attributes.set(
            Signature.ST,
            new Attribute(
                Signature.ST,
                character,
                10,
                { defaultLevel: 10 }
            ));
        this.attributes.set(
            Signature.DX,
            new Attribute(
                Signature.DX,
                character,
                20,
                { defaultLevel: 10 }
            ));
        this.attributes.set(
            Signature.IQ,
            new Attribute(
                Signature.IQ,
                character,
                20,
                { defaultLevel: 10 }
            ));
        this.attributes.set(
            Signature.HT,
            new Attribute(
                Signature.HT,
                character,
                10,
                { defaultLevel: 10 }
            ));
        this.attributes.set(
            Signature.Will,
            new Attribute(
                Signature.Will,
                character,
                5,
                { basedOn: () => this.getAttribute(Signature.IQ).calculateLevel() }
            ));
        this.attributes.set(
            Signature.Speed,
            new Attribute(
                Signature.Speed,
                character,
                20,
                { basedOn: () => (this.getAttribute(Signature.DX).calculateLevel() + this.getAttribute(Signature.HT).calculateLevel()) / 4 }
            ));
        this.attributes.set(
            Signature.Move,
            new Attribute(
                Signature.Move,
                character,
                5,
                { basedOn: () => Math.floor(this.getAttribute(Signature.Speed).calculateLevel()) }
            ));
        this.attributes.set(
            Signature.Per,
            new Attribute(
                Signature.Per,
                character,
                5,
                { basedOn: () => this.getAttribute(Signature.IQ).calculateLevel() }
            ));
        this.attributes.set(
            Signature.HP,
            new Attribute(
                Signature.HP,
                character,
                2,
                { basedOn: () => this.getAttribute(Signature.ST).calculateLevel() }
            ));
        this.attributes.set(
            Signature.FP,
            new Attribute(
                Signature.FP,
                character,
                3,
                { basedOn: () => this.getAttribute(Signature.HT).calculateLevel() }
            ));
    }

    getAttribute(attribute: Signature) { return this.character.getAttribute(attribute) }
    addAttribute({ signature = "", costPerLevel = 0, defaultLevel = 0, basedOn = () => null }) {
        if (typeof signature === "string") {
            const attribute = new Attribute(signature, this.character, costPerLevel, { defaultLevel, basedOn })
        }
    }
}

export class Attribute extends CharacterElement<Attribute> {
    static keys = ["name", "level", "costPerLevel", "defaultLevel"]
    name: string
    character: Character
    level: number
    costPerLevel: number
    defaultLevel: number
    basedOn: () => number

    constructor(
        name: string,
        character: Character,
        costPerLevel: number,
        {
            defaultLevel = 0,
            basedOn = () => 0
        },
        keys: string[] = []
    ) {
        super(character, [...keys, ...Attribute.keys]);
        this.name = name;
        this.character = character;
        this.level = defaultLevel;
        this.costPerLevel = costPerLevel;
        this.defaultLevel = defaultLevel;
        this.basedOn = basedOn;
    }

    setLevel(level: number) { if (level || level === 0) this.level = level; return level }
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

    static bonusReducer(sheet: Character, attribute: string) {
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
    static type = FeatureType.attributeBonus
    static keys = ["attribute"]

    attribute: string
    constructor(owner: T, keys: string[] = []) {
        super(owner, [...keys, ...AttributeBonus.keys]);
    }
}