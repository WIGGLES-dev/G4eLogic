import { SkillLike, Difficulty } from "./skill";
import { List } from "./misc/list";
import { Signature } from "./character";
import { objectify } from "@utils/json_utils";
export class SpellList extends List {
    constructor(character) {
        super(character);
        this.populator = Spell;
    }
}
export class Spell extends SkillLike {
    constructor(list) {
        super(list);
        this.version = 1;
        this.tag = "spell";
        this.difficulty = Difficulty.hard;
        this.signature = Signature.IQ;
        this.defaultedFrom = null;
        this.encumbrancePenaltyMultiple = null;
        this.list = list;
    }
    isActive() { return true; }
    getBonus() {
        return 0;
    }
    toJSON() {
        return {};
    }
    loadJSON(object) {
        object = objectify(object);
        super.loadJSON(object);
        function mapSpell(object, spell) {
            spell.college = object.college;
            spell.powerSource = object.power_source;
            spell.spellClass = object.spell_class;
            spell.castingCost = object.casting_cost;
            spell.maintenanceCost = object.maintenance_cost;
            spell.castingTime = object.casting_time;
            spell.duration = object.duration;
        }
        function loadSubElements(object, parent) {
            object.children.forEach((child) => {
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
        return this;
    }
}
//# sourceMappingURL=spell.js.map