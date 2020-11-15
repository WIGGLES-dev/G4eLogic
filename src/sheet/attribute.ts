import { KeyList, Sheet } from "@internal";
import * as jp from "jsonpath"

export interface AttributeData {
    abbreviation?: string,
    tooltip?: string
    costPerLevel?: number
    defaultLevel?: number
    basedOn?: string
    increment?: number
    skillSignature?: boolean
    substats?: string[]
    tags?: string[]
}
export interface PoolData extends AttributeData {
    color: string
}

export interface AttributeLevel {
    level: number,
    mod: number
}
export interface PoolLevel extends AttributeLevel {
    current: number
}

export class Attribute {
    #sheet: Sheet
    get sheet() { return this.#sheet }
    #keys: AttributeData
    get keys() { return this.#keys }
    #signature: string
    get signature() { return this.#signature }
    #attributes: KeyList<Attribute>
    get attributes() { return this.#attributes }

    get selector() { return "attributeLevels" }
    get attribute() { return this.sheet.keys.attributeLevels[this.signature] }

    constructor(sheet: Sheet, keys: AttributeData, signature: string, attributes: KeyList<Attribute>) {
        this.#sheet = sheet;
        this.#keys = keys;
        this.#signature = signature;
        this.#attributes = attributes;
    }
    get level() { return this.attribute?.level || 0 + this.keys.defaultLevel || null }
    set level(level) { this.sheet.pathUpdate(`$.keys.${this.selector}['${this.signature}'].level`, level) }
    get modifier(): number { return this.attribute?.mod ?? null }
    set modifier(mod) { this.sheet.pathUpdate(`$.keys.${this.selector}['${this.signature}'].mod`, mod) }
    get unmodifiedLevel(): number { return null }
    get displayLevel(): number { return this.calculateLevel() }
    set displayLevel(level) { this.level = level - this.modifier - this.basedOn() }
    calculateLevel() { return this.level + this.modifier + this.basedOn() }
    basedOn(): number { return new Function(`attributes`, this.keys.basedOn || "return null")(this.attributes) }
    pointsSpent() { return this.levelsIncreased() * this.keys.costPerLevel }
    levelsIncreased() { return this.level - (this.keys.defaultLevel || null) }
    hasTag(tag: string) { return this.keys.tags?.includes(tag) ?? false }
}

export class Pool extends Attribute {
    get keys() { return super.keys as PoolData }
    get selector() { return "poolLevels" }
    get attribute() { return this.sheet.keys.poolLevels[this.signature] }
    constructor(sheet: Sheet, keys: PoolData, signature, attributes: KeyList<Attribute>) {
        super(sheet, keys, signature, attributes)
    }
    get currentValue() { return this.attribute?.current ?? 0 }
    set currentValue(val) { this.sheet.pathUpdate(`$.keys.${this.selector}['${this.signature}'].current`, val) }
}