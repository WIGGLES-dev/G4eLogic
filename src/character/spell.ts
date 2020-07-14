import { SkillLike } from "./skill";
import { List } from "./misc/list";
import { Character } from "./character";
import { objectify, json } from "../utils/json_utils";


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
    loadJSON(object: string | json) {
        object = objectify(object);
        super.loadJSON(object);
        function mapSpell(object: json, spell: Spell) {
            spell.college = object.college;
            spell.powerSource = object.power_source;
            spell.spellClass = object.spell_class;
            spell.castingCost = object.casting_cost;
            spell.maintenanceCost = object.maintenance_cost;
            spell.castingTime = object.casting_time;
            spell.duration = object.duration;
        }
        function loadSubElements(object: json, parent: Spell) {
            object.children.forEach((child: json) => {
                const subElement = parent.list.addListItem().loadJSON(child);
                subElement.containedBy = parent;
                parent.children.add(subElement);
            });
        }
        mapSpell(object, this);
        if (object.type.includes("_container")) {
            this.canContainChildren = true;
            loadSubElements(object, this);
        }
        return this
    }
}