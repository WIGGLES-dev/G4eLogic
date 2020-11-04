import { Sheet } from "./feature";
import { AttributeData, KeyList, PoolData } from "./keys";
import * as jp from "jsonpath"

export class Attribute {
    #sheet: Sheet
    get sheet() { return this.#sheet }
    #keys: AttributeData
    get keys() { return this.#keys }
    #signature: string
    get signature() { return this.#signature }
    #attributes: KeyList<Attribute>
    get attributes() { return this.#attributes }

    protected get selector(): string { return "attributeLevels" }

    constructor(sheet: Sheet, keys: AttributeData, signature: string, attributes: KeyList<Attribute>) {
        this.#sheet = sheet;
        this.#keys = keys;
        this.#signature = signature;
        this.#attributes = attributes;
    }
    get level() { return jp.value(this.sheet.data, `$.${this.selector}['${this.signature}'].level`) || 0 + this.keys.defaultLevel || null }
    set level(level) { this.sheet.update(data => { jp.value(data, `$.${this.selector}['${this.signature}'].level`, level) }) }
    get modifier() { return jp.value(this.sheet.data, `$.${this.selector}['${this.signature}'].mod`) || null }
    set modifier(mod) { this.sheet.update(data => { jp.value(data, `$.${this.selector}['${this.signature}'].mod`, mod) }) }
    get unmodifiedLevel() { return null }
    get displayLevel() { return this.calculateLevel() }
    set displayLevel(level) { this.level = level - this.modifier - this.basedOn() }
    calculateLevel() { return this.level + this.modifier + this.basedOn() }
    basedOn() { return new Function(`attributes`, this.keys.basedOn || "return null")(this.attributes) }
    pointsSpent() { return this.levelsIncreased() * this.keys.costPerLevel }
    levelsIncreased() { return this.level - (this.keys.defaultLevel || null) }
    hasTag(tag: string) { return this.keys.tags?.includes(tag) ?? false }
}

export class Pool extends Attribute {
    get keys() { return super.keys as PoolData }
    get selector() { return "poolLevels" }
    constructor(sheet: Sheet, keys: PoolData, signature, attributes: KeyList<Attribute>) {
        super(sheet, keys, signature, attributes)
    }
    get currentValue() { return jp.value(this.sheet.data, `$.${this.selector}['${this.signature}'].current`) || 0 }
    set currentValue(val) { this.sheet.update(data => { jp.value(data, `$.${this.selector}['${this.signature}'].current`, val) }) }
}