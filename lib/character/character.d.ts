import { List, ListItem } from "./misc/list";
import { Attribute } from "./attribute";
import { SkillList } from "./skill";
import { TraitList } from "./trait";
import { Item, ItemList } from "./equipment";
import { Feature } from "./misc/feature";
import { Profile } from "./profile";
import { SpellList } from "./spell";
import { json } from "../utils/json_utils";
declare abstract class Sheet {
    configuration: {};
    constructor(configuration: {});
}
export declare type Featurable = ListItem<any>;
declare class FeatureList {
    #private;
    constructor();
    get table(): Map<string, Feature<Featurable>>;
    registerFeature(feature: Feature<Featurable>): void;
    removeFeature(uuid: string): void;
    getFeaturesByUUID(id: string): Feature<Featurable>[];
    iter(): Feature<Featurable>[];
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
    equipmentList: ItemList;
    otherEquipmentList: ItemList;
    traitList: TraitList;
    spellList: SpellList;
    featureList: FeatureList;
    constructor();
    totalAttributesCost(): any;
    attributes(attribute: signatures): number;
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
    allItems(): Item[];
    basicLift(): number;
    encumbranceLevel(): 1 | 0 | 2 | 3 | 4;
    encumberedMove(): number;
    carriedWeight(list: List<Item>): number;
    carriedValue(list: List<Item>): number;
    dodgeScore(): number;
    encumberedDodgeScore(): number;
    toJSON(): void;
    loadJSON(json: string | json): this;
    toR20(): string;
    loadFromActor(actor: Actor): void;
}
export declare enum signatures {
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
    Taste_Smell = "Taste Smell",
    Touch = "Touch"
}
export {};
