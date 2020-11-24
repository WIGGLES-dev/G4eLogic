import Schema from "validate";
import { AttributeData, PoolData, HitLocationData, poolSchema, attributeSchema } from "@internal";

export interface Config {
    UI: {
        rolling: boolean
        attributeOrder: string[]
        poolOrder: string[]
    }
    rulesets: {
        useMultiplicativeModifiers: boolean
        useKnowingYourOwnStrength: boolean
        useReducedSwingDamage: boolean
        useNoSchoolGrognardReducedSwingDamage: boolean
    },
    attributes: Record<string, AttributeData>
    pools: Record<string, PoolData>
    locations: Record<string, HitLocationData>
}
export const configSchema = () =>
    new Schema({
        UI: {
            rolling: Boolean,
            attributeOrder: [String],
            poolOrder: [String],
        },
        rulesets: { "*": Boolean },
        attributes: { "*": attributeSchema() },
        pools: { "*": poolSchema() }
    })

export function parseAttributes(attributes: Record<string, AttributeData>) {
    const attributeList = Object.entries(attributes).reduce(
        (attributes, [signature, data]) => {
            attributes[signature] = {
                ...defaultAttributeData(),
                ...data
            }
            return attributes
        }, {} as Record<string, AttributeData>
    );
    return attributeList
}
export const defaultAttributeData = (): AttributeData => ({
    increment: 1,
    tags: [],
    substats: []
})

export function parsePools(pools: Record<string, PoolData>) {
    return parseAttributes(pools) as Record<string, PoolData>;
}
export function parseHitLocations(locations: Record<string, HitLocationData>): Record<string, HitLocationData> {
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
        }, {}
    )
    return hitLocations
}