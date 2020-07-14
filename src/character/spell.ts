import { Skill, SkillLike } from "./skill";
import { List, ListItem } from "./misc/list";
import { Character } from "./character";
import { stringToTemplate } from "../utils/element_utils";
import { Feature } from "./misc/feature";
import { Weapon } from "./weapon";


export class SpellList extends List<Spell> {
    tag = "spell"
    class = Spell

    constructor(character: Character) {
        super(character);
    }
}

export class Spell extends SkillLike<Spell> {
    tag = "spell"

    college: string
    powerSource: string
    spellClass: string
    castingCost: string
    maintenanceCost: string
    castingTime: string
    duration: string

    constructor(list: List<Spell>) {
        super(list)
        this.list = list;
    }

    getBonus() {
        return 0
    }

    toJSON() {
        return {}
    }
    loadJSON(object: any) {
        function mapSpell(object: any, spell: Spell) {
            spell.college = object.college;
            spell.powerSource = object.power_source;
            spell.spellClass = object.spell_class;
            spell.castingCost = object.casting_cost;
            spell.maintenanceCost = object.maintenance_cost;
            spell.castingTime = object.casting_time;
            spell.duration = object.duration;
        }
        function loadSubElements(object: any, parent: Spell) {
            object.children.forEach((child: any) => {
                const subElement = parent.list.addListItem().loadJSON(object);
                subElement.containedBy = parent;
                parent.children.add(subElement);
            });
        }
        super.loadJSON(object);
        mapSpell(object, this);
        if (object.type.includes("_container")) {
            this.canContainChildren = true;
            loadSubElements(object, this);
        }
        return this
    }
}