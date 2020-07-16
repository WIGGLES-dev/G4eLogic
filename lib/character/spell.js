"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spell = exports.SpellList = void 0;
const skill_1 = require("./skill");
const list_1 = require("./misc/list");
const json_utils_1 = require("../utils/json_utils");
class SpellList extends list_1.List {
    constructor(character) {
        super(character);
        this.tag = "spell";
        this.class = Spell;
    }
}
exports.SpellList = SpellList;
class Spell extends skill_1.SkillLike {
    constructor(list) {
        super(list);
        this.tag = "spell";
        this.list = list;
    }
    getBonus() {
        return 0;
    }
    toJSON() {
        return {};
    }
    loadJSON(object) {
        object = json_utils_1.objectify(object);
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
exports.Spell = Spell;
//# sourceMappingURL=spell.js.map