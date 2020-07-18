import { json, objectify } from "utils/json_utils"

enum DefaultType {
    skill = "Skill"
}

export abstract class DefaultList {

}

export abstract class Default<T> {
    tag = "default"

    type: DefaultType
    modifier: number

    name?: string
    specialization?: string

    owner: T

    constructor(owner: T) {
        this.owner = owner;
    }
    toJSON() { }
    loadJSON(object: json) {
        object = objectify(object);
        this.type = object.type;
        this.modifier = object.modifier;
        this.name = object.name;
        this.specialization = object.specialization;
        return this
    }
}