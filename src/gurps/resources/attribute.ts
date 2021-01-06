import { FeatureBonusType, Resource, debounce } from "@internal";

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
export interface AttributeLevel {
    level: number,
    mod: number,
    current: number
}
export class Attribute {
    host: Resource
    keys: AttributeData
    signature: string
    attributes: Record<string, Attribute>
    bonus: number
    selector = "attributeLevels"
    get attribute() { return this.host.getKeys().attributeLevels[this.signature] }

    constructor(
        host: Resource,
        keys: AttributeData,
        signature: string,
        attributes: Record<string, Attribute>,
        bonus = 0
    ) {
        this.host = host;
        this.keys = keys;
        this.signature = signature;
        this.attributes = attributes;
        this.bonus = bonus
    }

    get level() { return (this.attribute?.level > Number.NEGATIVE_INFINITY ? this.attribute?.level ?? null : this.keys.defaultLevel || null) || null }
    set level(level) { this.updateLevel(level) }
    @debounce(220)
    updateLevel(level) {
        this.host.update({
            [this.selector]: {
                [this.signature]: {
                    level
                }
            }
        });
    }

    get modifier(): number { return this.attribute?.mod ?? null }
    set modifier(mod) { this.updateModifier(mod) }
    @debounce(220)
    updateModifier(mod) {
        this.host.set({
            [this.selector]: {
                [this.signature]: {
                    mod
                }
            }
        });
    }
    get unmodifiedLevel(): number { return this.calculateLevel() - this.modifier - this.bonus }
    get displayLevel(): number { return this.calculateLevel() }
    set displayLevel(level) { this.level = level - this.modifier - this.basedOn() - this.bonus }
    calculateLevel(): number { return this.level + this.modifier + this.basedOn() + this.bonus }
    basedOn(): number {
        const { basedOn } = this.keys;
        if (basedOn?.startsWith("return")) {
            try {
                return new Function(`attributes`, this.keys.basedOn || "return null")(this.attributes)
            } catch (err) {
                return null
            }
        } else {
            return this.attributes[basedOn]?.calculateLevel() ?? null
        }
    }
    pointsSpent() { return this.levelsIncreased() * this.keys.costPerLevel }
    levelsIncreased() { return this.level - (this.keys.defaultLevel || null) }
    hasTag(tag: string) { return this.keys.tags?.includes(tag) ?? false }

    get costPerLevel() { return this.keys.costPerLevel }

    get currentValue() { return this.attribute?.currentValue ?? 0 }
    set currentValue(val) { this.setCurrentValue(val) }
    @debounce(220)
    setCurrentValue(currentValue: number) {
        this.host.set({
            [this.selector]: {
                [this.signature]: {
                    currentValue
                }
            },
        })
    }
}