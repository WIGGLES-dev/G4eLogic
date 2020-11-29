import Schema from "validate"
import { AttributeBonus, FeatureBonusType, Sheet, debounce } from "@internal";
import * as jp from "jsonpath"

export interface AttributeData {
    isPool?: boolean,
    abbreviation?: string,
    tooltip?: string
    costPerLevel?: number
    defaultLevel?: number
    basedOn?: string
    increment?: number
    skillSignature?: boolean
    substats?: string[]
    tags?: string[]
    color?: string
}
export const attributeSchema = () =>
    new Schema({
        isPool: Boolean,
        abbreviation: String,
        tooltip: String,
        costPerLevel: Number,
        defaultLevel: Number,
        basedOn: String,
        increment: Number,
        skillSignature: Boolean,
        subStats: [String],
        tags: [String],
        color: [String]
    })

export interface AttributeLevel {
    level: number,
    mod: number,
    current: number
}

export class Attribute {
    sheet: Sheet
    keys: AttributeData
    signature: string
    attributes: Record<string, Attribute>

    selector = "attributeLevels"
    get attribute() { return this.sheet.keys.attributeLevels[this.signature] }

    constructor(sheet: Sheet, keys: AttributeData, signature: string, attributes: Record<string, Attribute>) {
        this.sheet = sheet;
        this.keys = keys;
        this.signature = signature;
        this.attributes = attributes;
    }

    get level() { return (this.attribute?.level > Number.NEGATIVE_INFINITY ? this.attribute?.level ?? null : this.keys.defaultLevel || null) || null }
    set level(level) { this.updateLevel(level) }
    @debounce(220)
    updateLevel(level) {
        this.sheet.pathUpdate(`$.keys.${this.selector}['${this.signature}'].level`, level)
    }

    get modifier(): number { return this.attribute?.mod ?? null }
    set modifier(mod) { this.updateModifier(mod) }
    @debounce(220)
    updateModifier(mod) {
        this.sheet.pathUpdate(`$.keys.${this.selector}['${this.signature}'].mod`, mod)
    }

    get unmodifiedLevel(): number { return this.calculateLevel() - this.modifier - this.attributeBonus }
    get displayLevel(): number { return this.calculateLevel() }
    set displayLevel(level) { this.level = level - this.modifier - this.basedOn() - this.attributeBonus }
    calculateLevel() { return this.level + this.modifier + this.basedOn() + this.attributeBonus }
    basedOn(): number {
        try {
            return new Function(`attributes`, this.keys.basedOn || "return null")(this.attributes)
        } catch (err) {
            return null
        }
    }
    pointsSpent() { return this.levelsIncreased() * this.keys.costPerLevel }
    levelsIncreased() { return this.level - (this.keys.defaultLevel || null) }
    hasTag(tag: string) { return this.keys.tags?.includes(tag) ?? false }

    get costPerLevel() { return this.keys.costPerLevel }

    get currentValue() { return this.attribute?.current ?? 0 }
    set currentValue(val) { this.setCurrentValue(val) }
    @debounce(220)
    setCurrentValue(val) { this.sheet.pathUpdate(`$.keys.${this.selector}['${this.signature}'].current`, val) }

    get attributeBonus() {
        if (!this.sheet) return null
        return this.sheet.get(this.sheet.bonuses$)
            .filter(bonus => !bonus.disabled)
            .map(bonus => {
                bonus.bonuses = bonus.bonuses.filter(
                    bonus =>
                        bonus.type === FeatureBonusType.Attribute &&
                        bonus.attribute === this.signature)
                return bonus
            })
            .reduce((total, feature) => {
                return total + feature.bonuses.reduce((total, bonus) => total + (bonus.leveled ? bonus.amount * feature.level : bonus.amount), 0)
            }, 0)
    }
}