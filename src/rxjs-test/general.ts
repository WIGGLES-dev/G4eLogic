import { ID } from "@datorama/akita";
import { Observable } from "rxjs";

export interface StoreEntity {
    id: ID
}

export interface SheetElement extends StoreEntity {
    sheetId?: ID
}

export interface NestedElement extends SheetElement {
    ownedById?: ID
}

export interface Weaponized {
    active: boolean
    weapons: Weapon[]
}

export interface Weapon {
    damage: string
    strengthRequirement: string
}

export interface Featurable {
    active: boolean
    features: Feature[]
}

enum FeatureEffect {

}
enum FeatureTarget {

}
export interface Feature {
    effect: string
    target: string
    criteria: string
}

export interface Listable extends NestedElement {
    list?: {
        open: boolean
        index: number,
        rowColor?: string
        textColor?: string
        hiddenColumns?: string[]
    }
}

export interface ListItem extends Listable, Weaponized, Featurable, StoreEntity {

}

function list() {
    return (source: Observable<Listable[]>) => {

    }
}

function sort(prop: string) {}

export function merge(...objects) {
    return Object.assign({}, ...objects);
}

export function strEncodeUTF16(str: string) {
    return [...str].reduce((prev, cur) => prev + cur.charCodeAt(0), 0);
}

class Formatter {

}

export function capitalize(string) {
    return string.split(" ").map(word => {
        return word[0].toUpperCase() + word.slice(1);
    }).join(' ');
}