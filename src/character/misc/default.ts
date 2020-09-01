import { json, objectify } from "@utils/json_utils"
import { SkillLike, Skill } from "@character/skill/skill"
import { CharacterElement } from "./element"
import { Signature } from "@character/character"
import { ListItem } from "./list"

export enum DefaultType {
    skill = "Skill",
    parry = "Parry",
    block = "Block"
}

export abstract class DefaultList {

}

export abstract class Default<T extends ListItem<any>> extends CharacterElement<T> {
    static keys = ["type", "modifier"]
    tag = "default"

    type: DefaultType | Signature
    modifier: number

    name?: string
    specialization?: string

    owner: T

    constructor(owner: T, keys: string[]) {
        super(owner.character, [...keys, ...Default.keys])
        this.owner = owner;
    }

    isSkillBased() {
        return Object.values(DefaultType).includes(this.type as DefaultType)
    }

    getHighestMatchLevel({ withBonuses = true } = {}) {
        if (this.isSkillBased()) {
            return this.getMatches().highest?.calculateLevel({ withBonuses }) ?? Number.NEGATIVE_INFINITY + this.modifier
        } else {
            return this.owner.character.getAttribute(this.type as Signature).calculateLevel() + this.modifier
        }
    }

    getMatches() {
        const skills: Skill[] = this.owner.list.character.skillList.iter().filter(skill => {
            if (this.specialization) {
                if (!skill.specialization) return false
                return this.name === skill.name && this.specialization === skill.specialization
            } else {
                return this.name === skill.name
            }
        }) || [];
        let highest: Skill
        if (skills.length > 0) {
            highest = skills.reduce((prev, cur) => {
                if (SkillLike.calculateRelativeLevel(prev.points, 10) > SkillLike.calculateRelativeLevel(cur.points, 10)) {
                    return prev
                } else {
                    return cur
                }
            });
        }

        return {
            skills,
            highest
        }
    }
}