
export class AttributeList {
    static keys = [];
    attributes: Map<string, Attribute> = new Map()

    constructor() { }

    private configure(CONFIG: any) {
        try {
            if (!CONFIG) return
            const newAttributes = Object.entries(CONFIG.attributes)?.map(([signature, attribute]: [string, AttributeData]) => {
                const oldAttribute = this.attributes.get(signature)
                let basedOn = () => null;
                if (typeof attribute.basedOn === "string") {
                    basedOn = new Function(attribute.basedOn).bind(this);
                }
                // return new Attribute(Object.assign(attribute, {
                //     level: attribute.defaultLevel ?? 0,
                //     basedOn,
                //     signature,
                //     modifier: oldAttribute?.modifier ?? 0
                // }))
            });
            const newPools = Object.entries(CONFIG.pools)?.map(([signature, pool]: [string, PoolData]) => {
                const oldPool = this.attributes.get(signature)
                let basedOn = () => null;
                if (typeof pool.basedOn === "string") {
                    basedOn = new Function(pool.basedOn).bind(this);
                }
                // return new Pool(Object.assign(pool, {
                //     level: pool.defaultLevel ?? 0,
                //     basedOn,
                //     signature,
                //     currentValue: oldPool instanceof Pool ? oldPool.currentValue : 0,
                //     modifier: oldPool?.modifier ?? 0
                // }));
            });
            this.attributes.clear();
            return [...newAttributes, ...newPools]
        } catch (err) {
            console.log(`Failed to configure attribute`, err);
        }
    }
}

interface AttributeData {
    signature: string
    skillSignature: boolean
    abbreviation: string
    basedOn: () => number
    modifier
    tags: string[]
    defaultLevel: number
    costPerLevel: number
    increment: number
}
export class Attribute implements AttributeData {
    signature: string
    skillSignature = false
    abbreviation: string
    costPerLevel: number
    defaultLevel: number
    basedOn: () => number
    modifier = 0
    tags: string[] = []
    increment: number
    color: string
    substats: string[]

    level: number

    constructor() {

    }

    get unmodifiedLevel() { return this.calculateLevel() - this.modifier }
    hasTag(tag: string) { return this.tags.includes(tag) }

    pointsSpent() { return this.levelsIncreased() * this.costPerLevel }
    levelsIncreased() { return this.level - this.defaultLevel }
    calculateLevel() {
        try {
            return this.level + (/* The modifier */0) + this.basedOn() + this.modifier
        } catch (err) {
            return NaN
        }
    }

    get displayLevel() { return this.calculateLevel() }
    set displayLevel(level) {
        const mod = 0
        if (this.defaultLevel) {
            this.level = level - mod - this.modifier;
        } else if (!this.defaultLevel && this.basedOn) {
            this.level = level - this.basedOn() - mod - this.modifier;
        }
    }
}

interface PoolData extends AttributeData {

}
export class Pool extends Attribute implements AttributeData {
    currentValue: number = 0

    constructor() {
        super()
    }

    percentage() { return this.currentValue / this.calculateLevel() }
    get missing() { return this.calculateLevel() - this.currentValue }
}