export interface ConfigList<T> {
    [key: string]: T
}

export interface Config {
    UI: {
        rolling: boolean
    }
    rulesets: {
        useMultiplicativeModifiers: boolean
        useKnowingYourOwnStrength: boolean
        useReducedSwingDamage: boolean
        useNoSchoolGrognardReducedSwingDamage: boolean
    },
    attributes: ConfigList<AttributeData>
    pools: ConfigList<PoolData>
    locations: ConfigList<HitLocation>
}

interface AttributeLevel {
    level: number,
    mod: number
}
interface PoolLevel extends AttributeLevel {
    current: number
}
export interface SheetData {
    id: string,
    profile: Profile
    skills: string[]
    techniques: string[]
    traits: string[]
    equipment: string[],
    config: Config,
    hitLocationDamage: ConfigList<number>,
    poolLevels: ConfigList<PoolLevel>,
    attributeLevels: ConfigList<AttributeLevel>
}

export interface Profile {

}

function parseConfig(config: Config) {

}

interface AttributeData {
    abbreviation?: string,
    tooltip?: string
    costPerLevel?: number
    defaultLevel?: number
    basedOn?: string
    skillSignature?: boolean
    substats?: string[]
    tags?: string[]
}
interface Attribute extends AttributeData {
    pointsSpent(),
    levelsIncreased()
}
interface PoolData extends AttributeData {
    color: string
}
interface Pool extends PoolData {

}

function parseAttributes(attributes: ConfigList<AttributeData>) {
    const attributeList = Object.entries(attributes).reduce(
        (attributes, [signature, data]) => {
            attributes[signature] = {
                ...data,
                get unmodifiedLevel() { return null },
                pointsSpent() {

                },
                levelsIncreased() {

                }
            }
            return attributes
        }, {} as ConfigList<Attribute>
    );
    return attributeList
}

function parsePools(pools: ConfigList<PoolData>) {

}

interface HitLocationData {
    isGroup?: boolean
    subLocations?: string[]
    has?: string[]
    hitPenalty?: number
    crippleRatio?: number
    hitRange?: number[]
    naturalDR?: number
}
export interface HitLocation extends HitLocationData {

}
export function parseHitLocations(locations: ConfigList<HitLocationData>) {
    const hitLocations = Object.entries(locations).reduce(
        (locations, [location, data]) => {
            let toCreate = [{
                location,
                subLocations: data.subLocations || []
            }];
            if (data.has instanceof Array) {
                toCreate = data.has?.map(specifier => ({
                    location: `${specifier} ${location}`,
                    subLocations: data.subLocations?.map(
                        location => `${specifier} ${location}`
                    )
                }))
            }
            const newLocations = toCreate.map(({ location, subLocations }) => {
                return Object.assign({}, data, {
                    location,
                    subLocations,
                    genericLocation: location,
                })
            })
            newLocations.forEach(data => {
                locations[data.location] = data
            });
            return locations
        }, {} as ConfigList<HitLocation>
    )
    return hitLocations
}