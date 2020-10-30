import { SheetStore, SheetQuery } from "./entities/sheet/store";
import { SkillStore, SkillQuery } from "./entities/skill/store";
import { EquipmentStore, EquipmentQuery } from "./entities/equipment/store";

import { Sheet, Skill } from "./wrappers";

export interface Stores {
    sheets: SheetStore
    skills: SkillStore,
    equipment: EquipmentStore
}

export interface Queries {
    sheets: SheetQuery
    skills: SkillQuery
    equipment: EquipmentQuery
}

const sheets = new SheetStore()
const skills = new SkillStore();
const equipment = new EquipmentStore();

export class Valor {
    static Stores: Stores = {
        sheets,
        skills,
        equipment
    }
    static get Queries(): Queries {
        return {
            sheets: new SheetQuery(sheets),
            skills: new SkillQuery(skills),
            equipment: new EquipmentQuery(equipment)
        }
    }
}