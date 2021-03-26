import type { HitLocation } from "@app/gurps/resources/character";
import { capitalize } from "@app/utils/strings";

export function hitLocationTemplate(location: HitLocation) {
    if (!location) return `Location Not Found`;
    return `
        <strong>${capitalize(location.name)} (${location.keys?.hitPenalty || 0})</strong>,` +
        (location.keys?.hitRange?.length > 0 ? ` hits on ${location.keys?.hitRange?.join(", ")} on 3d6` : "") +
        `<br/>
        <strong> DR ${location.damageResistance || 0}</strong>`
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