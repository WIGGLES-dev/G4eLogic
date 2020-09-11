import { ListItem } from "./misc/list";
import { Attribute, AttributeList } from "./attribute";
import { SkillList } from "./skill/skill";
import { TraitList } from "./trait/trait";
import { Equipment, EquipmentList } from "./equipment/equipment";
import { FeatureList } from "./misc/feature";
import { Profile } from "./profile";
import { SpellList } from "./spell";
import { Serializer } from "./serialization/serializer";
import { CharacterElement } from "./misc/element";
import { LocationList } from "./locations";
import { Hooks } from "../hooks/hooks";
import { TechniqueList } from "./technique";
export declare abstract class Sheet {
    #private;
    hooks: Hooks;
    serializer: typeof Serializer;
    defaultConfig: any;
    config: any;
    constructor(config?: any);
    static registerSerializer(serializer: Serializer): void;
    void(): this;
    getSerializer(scope?: string): Serializer;
    registerElement(element: CharacterElement<Featurable>): void;
    removeElement(element: CharacterElement<Featurable>): void;
    getElementById(type: string, id: string): any;
    reconfigure(config: any): void;
}
export interface Featurable extends ListItem<any> {
    hasLevels: boolean;
    getLevel: () => number;
}
export declare class Character extends Sheet {
    gCalcID: string;
    missingHP: number;
    missingFP: number;
    profile: Profile;
    skillList: SkillList;
    techniqueList: TechniqueList;
    equipmentList: EquipmentList;
    otherEquipmentList: EquipmentList;
    traitList: TraitList;
    spellList: SpellList;
    featureList: FeatureList;
    locationList: LocationList;
    attributeList: AttributeList;
    constructor(config?: any);
    isReeling(ratio?: number): boolean;
    isExhausted(ratio?: number): boolean;
    getSwingDamage(): string;
    getThrustDamage(): string;
    totalAttributesCost(): number;
    getAttribute(attribute: string): Attribute;
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
    encumbranceLevel({ forSkillEncumbrance }?: {
        forSkillEncumbrance?: boolean;
    }): -5 | -2 | 0 | -3 | -4 | -1;
    encumberedMove(): number;
    dodgeScore(): number;
    encumberedDodgeScore(): number;
    load(data: any, scope: string): this;
    save(scope: string, target: any): this;
    void(): this;
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
    Base = "10",
    Quint = "QT",
    Speed = "Speed",
    Move = "Move",
    Vision = "Vision",
    Hearing = "Hearing",
    TasteSmell = "Taste Smell",
    Touch = "Touch",
    Dodge = "dodge"
}
