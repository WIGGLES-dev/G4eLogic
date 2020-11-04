export function makeLocationObject(locations: any) {
    let newLocations = [];
    Object.entries(locations).forEach(([key, location]: [string, any]) => {
        let toCreate = [{ name: key, subLocations: location.subLocations }]
        if (location.has instanceof Array) {
            toCreate = location.has?.map(specifier => {
                return {
                    name: `${specifier} ${key}`,
                    subLocations: location.subLocations?.map(location => `${specifier} ${location}`)
                }
            });
        }
        newLocations = [...newLocations, ...toCreate?.map(({ name, subLocations }) => {
            return Object.assign({}, location, {
                subLocations,
                genericLocation: key,
                location: name,
            })
        })];
    });
    console.log(newLocations);
    return newLocations
}

interface HitLocationData {
    genericLocation: string
    location: string,
    has: string[]
    isGroup: boolean
    subLocations: string[]
    crippleRatio: number,
    crippleBasis: string,
    hitPenalty: number,
    hitsOn: number[],
    naturalDR: number
}
export class HitLocation implements HitLocationData {
    damageTaken: number

    has: string[] = null
    genericLocation: string
    specifier: string
    location: string
    naturalDR = null
    crippleRatio = null
    crippleBasis: string = "hit points"
    hitPenalty = null
    hitsOn: number[] = []
    isGroup = false
    subLocations: string[] = null

    get name() { return this.location }

    getSubLocations() { }

    crippleThreshold(threshold: number) { return threshold / this.crippleRatio }


    isCrippled() {
        try {
            return this.damageTaken > this.crippleThreshold(0);
        } catch (err) {
            return false
        }
    }
    /**
     * Looks at all the DRBonus features on the character that match the locations name and sums them up.
     */
    armorValue(): number {
        return null
    }
}