import { List, ListItem } from "./misc/list";
import { Attribute } from "./attribute";
import { SkillList } from "./skill/skill";
import { TraitList } from "./trait";
import { Equipment, EquipmentList } from "./equipment";
import { FeatureList } from "./misc/feature";
import { Profile } from "./profile";
import { SpellList } from "./spell";
import { Serializer } from "./serialization/serializer";
import { CharacterElement } from "./misc/element";
declare abstract class Sheet {
    #private;
    serializer: Serializer;
    constructor(serializer: Serializer);
    abstract load(sheet: Sheet, data: any): Sheet;
    registerElement(element: CharacterElement<Featurable>): void;
    removeElement(element: CharacterElement<Featurable>): void;
    getElementById(type: string, id: string): any;
}
export interface Featurable extends ListItem<any> {
    hasLevels: boolean;
    getLevel: () => number;
}
export declare class Character extends Sheet {
    gCalcID: string;
    attributes: Map<Signature, Attribute>;
    missingHP: number;
    missingFP: number;
    profile: Profile;
    skillList: SkillList;
    equipmentList: EquipmentList;
    otherEquipmentList: EquipmentList;
    traitList: TraitList;
    spellList: SpellList;
    featureList: FeatureList;
    constructor(serializer?: Serializer);
    totalAttributesCost(): number;
    getAttribute(attribute: Signature): Attribute;
    pointTotals(): {
        racialPoints: number;
        attributePoints: number;
        advantages: number;
        disadvantages: number;
        quirks: number;
        skills: number;
        spells: number;
        total: number;
    };
    allItems(): Equipment[];
    basicLift(): number;
    encumbranceLevel(): 0 | -1 | -2 | -3 | -4;
    encumberedMove(): number;
    carriedWeight(list: List<Equipment>): number;
    carriedValue(list: List<Equipment>): number;
    dodgeScore(): number;
    encumberedDodgeScore(): number;
    load(data: any): Character;
    void(): void;
    toR20(): string;
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
