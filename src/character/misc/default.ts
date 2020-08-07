import { json, objectify } from "@utils/json_utils"
import { SkillLike } from "@character/skill/skill"
import { CharacterElement } from "./element"

enum DefaultType {
    skill = "Skill"
}

export abstract class DefaultList {

}

export abstract class Default<T extends SkillLike<any>> extends CharacterElement<T> {
    static keys = ["type", "modifier"]
    tag = "default"

    type: DefaultType
    modifier: number

    name?: string
    specialization?: string

    owner: T

    constructor(owner: T, keys: string[]) {
        super(owner.character, [...keys, ...Default.keys])
        this.owner = owner;
    }
}