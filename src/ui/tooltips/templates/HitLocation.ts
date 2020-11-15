import { HitLocation } from "@sheet/hitLocation";
import { capitalize } from "@utils/strings";

export function hitLocationTemplate(location: HitLocation) {
    if (!location) return `Location Not Found`;
    return `
        <strong>${capitalize(location.location)} (${location.keys.hitPenalty})</strong>,` +
        (location.keys.hitRange?.length > 0 ? ` hits on ${location.keys.hitRange.join(", ")} on 3d6` : "") +
        `<br/>
        <strong> DR ${location.armor || 0}</strong>`
        // + ` - ${"PLACEHOLDER"} from natural DR.` 
        // + `</br>`
        // + `<strong>${location.damageTaken || 0}</strong> out of ${Math.floor(location.crippleThreshold())} to cripple<br/>`
        // + `<strong>Armor Equipped</strong>
        // <blockquote>
        //     ${[...location.equippedItems]
        //     .map((item) => ``)
        //     .join("")}
        // </blockquote>
        // <strong>
        //     Natural DR
        // </strong>
        // <blockquote>

        // </blockquote>
        // <strong>Extended Rules</strong>
        // <blockquote>

        // </blockquote>`
        ;
}