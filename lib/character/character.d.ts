import { List, ListItem } from "./misc/list";
import { Attribute } from "./attribute";
import { SkillList } from "./skill";
import { TraitList } from "./trait";
import { Equipment, EquipmentList } from "./equipment";
import { FeatureList } from "./misc/feature";
import { Profile } from "./profile";
import { SpellList } from "./spell";
import { json } from "@utils/json_utils";
declare abstract class Sheet {
    configuration: {};
    constructor(configuration: {});
}
export interface Featurable extends ListItem<any> {
    hasLevels: boolean;
    getLevel: () => number;
}
export declare class Character extends Sheet {
    gCalcID: string;
    ST: Attribute;
    DX: Attribute;
    IQ: Attribute;
    HT: Attribute;
    Will: Attribute;
    Speed: Attribute;
    Move: Attribute;
    Per: Attribute;
    HP: Attribute;
    FP: Attribute;
    missingHP: number;
    missingFP: number;
    profile: Profile;
    skillList: SkillList;
    equipmentList: EquipmentList;
    otherEquipmentList: EquipmentList;
    traitList: TraitList;
    spellList: SpellList;
    featureList: FeatureList;
    constructor();
    totalAttributesCost(): any;
    attributes(attribute: Signature): number;
    pointTotals(): {
        racialPoints: number;
        attributePoints: any;
        advantages: number;
        disadvantages: number;
        quirks: number;
        skills: number;
        spells: number;
        total: any;
    };
    allItems(): Equipment[];
    basicLift(): number;
    encumbranceLevel(): -1 | 0 | -2 | -3 | -4;
    encumberedMove(): number;
    carriedWeight(list: List<Equipment>): number;
    carriedValue(list: List<Equipment>): number;
    dodgeScore(): number;
    encumberedDodgeScore(): number;
    toJSON(): void;
    loadJSON(json: string | json): this;
    toR20(): string;
    loadFromActor(actor: Actor): this;
}
export declare enum Signature {
    ST = "ST",
    DX = "DX",
    IQ = "IQ",
    HT = "HT",
    FP = "FP",
    HP = "HP",
    Per = "Per",
    Will = "Will",
    Base = 10,
    Quint = "QT",
    Speed = "Speed",
    Move = "Move",
    Vision = "Vision",
    Hearing = "Hearing",
    TasteSmell = "Taste Smell",
    Touch = "Touch",
    Dodge = "dodge"
}
export {};
