import * as jp from "jsonpath"
import { KeyList, capitalize } from "@internal";

interface DataPipe<I, O> {

}

function reverseKeys(object: any, { accessor = "accessor" } = {}) {
    Object.entries(object).reduce((object, [key, value]) => {
        if (typeof value === "string") {
            object[value] = key
        } else if (typeof value === "function") {
            const base = value();
            object[base[accessor]] = reverseKeys(base)
        } else {
            object[value[accessor]] = reverseKeys(value, { accessor })
        }
        return object
    }, {})
}

function snakeCaseToCamelCase(key: string) {
    return key.split("_").map((part, i) => i === 0 ? part.toLocaleLowerCase() : capitalize(part)).join()
}

function transform(data, map, { reverting = false, accessor = "accessor" } = {}) {
    return Object.entries(map).reduce((output, [key, value]) => {
        if (typeof value === "string") {
            output[key] = data[value]
        } else if (typeof value === "function") {
            output[key] = value()[reverting ? "revert" : "transform"](key)
        } else {
            output[key] = transform(data[accessor], value, { reverting, accessor })
        }
        return output
    }, {})
}

function revert(data, map) { transform(data, reverseKeys(map), { reverting: true }); }

function skillMap() { }
function techniqueMap() { }
function spellMap() { }
function traitMap() { }
function equipmentMap() { }
