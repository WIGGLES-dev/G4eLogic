import { HitLocation } from "@character/locations";
import { capitalize } from "@utils/string_utils";

export function hitLocationTemplate(location: HitLocation) {
    if (!location) return `Location Not Found`;
    return `
        <strong>${capitalize(location.name)} (${location.hitPenalty})</strong>,` +
        (location.hitsOn.length > 0 ? ` hits on ${location.hitsOn.join(", ")} on 3d6` : "") +
        `<br/>
        <strong> DR ${location.armorValue() || 0}</strong>`
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