import { SkillLike, Skill } from "@character/skill/skill"
import { CharacterElement } from "./element"
import { Signature } from "@character/character"
import { ListItem, List } from "./list"

export enum DefaultType {
    skill = "Skill",
    parry = "Parry",
    block = "Block"
}

export abstract class DefaultList {

}

export abstract class Default<T extends ListItem> extends CharacterElement {
    static keys = ["type", "modifier", "name", "specialization"]
    tag = "default"

    type: DefaultType | Signature
    modifier: number = 0

    name?: string
    specialization?: string

    owner: T

    constructor(owner: T, keys: string[]) {
        super(owner.character, [...keys, ...Default.keys])
        this.owner = owner;
    }

    abstract getLookupList(): List<SkillLike>

    isSkillBased() {
        return Object.values(DefaultType).includes(this.type as DefaultType)
    }

    getHighestMatchLevel({ withBonuses = true } = {}) {
        if (this.isSkillBased()) {
            let skill = this.getMatches().highest
            return skill?.calculateLevel({ withBonuses, considerDefaults: false }) + (this.modifier || 0) ?? Number.NEGATIVE_INFINITY
        } else {
            return this.owner.character.getAttribute(this.type as Signature).calculateLevel() + (this.modifier || 0)
        }
    }

    getMatches() {
        const skills: SkillLike[] = this.getLookupList().iter().filter(skill => {
            if (this.specialization) {
                if (!skill.specialization) return false
                return this.name === skill.name && this.specialization === skill.specialization
            } else {
                return this.name === skill.name
            }
        }) || [];
        let highest: SkillLike = null
        if (skills.length > 0) {
            highest = skills.reduce((prev, cur) => {
                if (prev.calculateRelativeLevel(10) > cur.calculateRelativeLevel(10)) {
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