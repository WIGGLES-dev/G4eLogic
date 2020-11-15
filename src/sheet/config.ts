import { KeyList, AttributeData, PoolData, HitLocationData } from "@internal";

export function parseAttributes(attributes: KeyList<AttributeData>) {
    const attributeList = Object.entries(attributes).reduce(
        (attributes, [signature, data]) => {
            attributes[signature] = {
                ...defaultAttributeData(),
                ...data
            }
            return attributes
        }, {} as KeyList<AttributeData>
    );
    return attributeList
}
export const defaultAttributeData = (): AttributeData => ({
    increment: 1,
    tags: [],
    substats: []
})

export function parsePools(pools: KeyList<PoolData>) {
    return parseAttributes(pools) as KeyList<PoolData>;
}
export function parseHitLocations(locations: KeyList<HitLocationData>) {
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