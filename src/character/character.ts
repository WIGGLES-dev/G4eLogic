import { List, ListItem } from "./misc/list";
import { Attribute } from "./attribute";
import { SkillList } from "./skill";
import { TraitList } from "./trait";
import { Item, ItemList } from "./equipment";
import { Feature } from "./misc/feature";
import { Profile } from "./profile";
import { SpellList } from "./spell";
import { exportR20 } from "../utils/2R20";
import { json, objectify } from "../utils/json_utils";

abstract class Sheet {
    configuration: {}

    constructor(configuration: {}) {
        this.configuration = configuration;
    }
}

export type Featurable = ListItem<any>;
class FeatureList {
    #contents: Map<string, Feature<Featurable>>

    constructor() {
        this.#contents = new Map();
    }

    get table() { return this.#contents }

    registerFeature(feature: Feature<Featurable>) {
        this.#contents.set(feature.uuid, feature);
    }
    removeFeature(uuid: string) {
        this.#contents.delete(uuid);
    }
    getFeaturesByUUID(id: string) {
        return Array.from(this.#contents.values()).filter(feature => {
            if (feature.owner.uuid = id) {
                return true
            } else {
                return false
            }
        });
    }
    iter() { return Array.from(this.#contents.values()) }
}

export class Character extends Sheet {
    gCalcID: string

    ST: Attribute
    DX: Attribute
    IQ: Attribute
    HT: Attribute
    Will: Attribute
    Speed: Attribute
    Move: Attribute
    Per: Attribute
    HP: Attribute
    FP: Attribute

    missingHP: number
    missingFP: number

    profile: Profile
    skillList: SkillList
    equipmentList: ItemList
    otherEquipmentList: ItemList
    traitList: TraitList
    spellList: SpellList

    featureList: FeatureList

    constructor() {
        super({});
        this.profile = new Profile();
        this.equipmentList = new ItemList(this);
        this.otherEquipmentList = new ItemList(this);
        this.skillList = new SkillList(this);
        this.traitList = new TraitList(this);
        this.spellList = new SpellList(this);
        this.ST = new Attribute(
            this,
            10,
            { defaultLevel: 10 }
        );
        this.DX = new Attribute(
            this,
            20,
            { defaultLevel: 10 }
        );
        this.IQ = new Attribute(
            this,
            20,
            { defaultLevel: 10 }
        );
        this.HT = new Attribute(
            this,
            10,
            { defaultLevel: 10 }
        );
        this.Will = new Attribute(
            this,
            5,
            { basedOn: () => this.IQ.calculateLevel() }
        );
        this.Speed = new Attribute(
            this,
            20,
            { basedOn: () => (this.DX.calculateLevel() + this.HT.calculateLevel()) / 4 }
        );
        this.Move = new Attribute(
            this,
            5,
            { basedOn: () => Math.floor(this.Speed.calculateLevel()) }
        );
        this.Per = new Attribute(
            this,
            5,
            { basedOn: () => this.IQ.calculateLevel() }
        );
        this.HP = new Attribute(
            this,
            2,
            { basedOn: () => this.ST.calculateLevel() }
        );
        this.FP = new Attribute(
            this,
            3,
            { basedOn: () => this.HT.calculateLevel() }
        );
        this.featureList = new FeatureList();
    }

    totalAttributesCost() {
        return Object.values(this).reduce((prev, cur) => {
            if (cur instanceof Attribute) {
                return prev + cur.pointsSpent()
            } else {
                return prev
            }
        }, 0)
    }

    attributes(attribute: signatures) {
        switch (attribute) {
            case signatures.HP: return this.HP.calculateLevel()
            case signatures.FP: return this.FP.calculateLevel()
            case signatures.ST: return this.ST.calculateLevel()
            case signatures.DX: return this.DX.calculateLevel()
            case signatures.IQ: return this.IQ.calculateLevel()
            case signatures.HT: return this.HT.calculateLevel()
            case signatures.Per: return this.Per.calculateLevel()
            case signatures.Will: return this.Will.calculateLevel()
            case signatures.Base: return 10
            case signatures.Speed: return this.Speed.calculateLevel()
            case signatures.Move: return this.Move.calculateLevel()
        }
    }

    pointTotals() {
        const racialPoints = this.traitList.sumRacials();
        const attributePoints = this.totalAttributesCost();
        const advantages = this.traitList.sumAdvantages();
        const disadvantages = this.traitList.sumDisadvantages();
        const quirks = this.traitList.sumQuirks();
        const skills = this.traitList.sumQuirks();
        const spells = 0;

        return {
            racialPoints,
            attributePoints,
            advantages,
            disadvantages,
            quirks,
            skills,
            spells,
            total: racialPoints + attributePoints + advantages + disadvantages + quirks + skills + spells
        }
    }

    allItems(): Item[] {
        return [].concat.apply([],
            [
                this.equipmentList.iter(),
                this.otherEquipmentList.iter()
            ])
    }
    basicLift() {
        const ST = this.ST.calculateLevel();
        return Math.round(ST * ST / 5)
    }
    encumbranceLevel() {
        const basicLift = this.basicLift();
        const carriedWeight = this.carriedWeight(this.equipmentList);
        if (carriedWeight < basicLift) {
            return 0
        } else if (carriedWeight < basicLift * 2) {
            return 1
        } else if (carriedWeight < basicLift * 3) {
            return 2
        } else if (carriedWeight < basicLift * 6) {
            return 3
        } else if (carriedWeight < basicLift * 10) {
            return 4
        }
    }

    encumberedMove() {
        return this.Move.calculateLevel() + this.encumbranceLevel() + 1
    }
    carriedWeight(list: List<Item>) {
        return list.iterTop().reduce((prev, cur) => {
            return prev + cur.extendedWeight()
        }, 0)
    }
    carriedValue(list: List<Item>) {
        return list.iterTop().reduce((prev, cur) => {
            return prev + cur.extendedValue()
        }, 0);
    }

    dodgeScore() { return Math.floor(this.Speed.calculateLevel() + Attribute.bonusReducer(this, "dodge") + 3) }

    encumberedDodgeScore() {
        switch (this.encumbranceLevel()) {
            case 0:
                return this.dodgeScore()
            case 1:
                return Math.floor(this.dodgeScore() * .8)
            case 2:
                return Math.floor(this.dodgeScore() * .6)
            case 3:
                return Math.floor(this.dodgeScore() * .4)
            case 4:
                return Math.floor(this.dodgeScore() * .2)
        }
    }
    toJSON() {

    }
    loadJSON(json: string  | json) {
        json = objectify(json);
        this.gCalcID = json.id;

        this.profile.loadJSON(json.profile);
        this.equipmentList.loadJSON(json.equipment);
        this.otherEquipmentList.loadJSON(json.otherEquipmentList);
        this.skillList.loadJSON(json.skills);
        this.traitList.loadJSON(json.advantages);
        this.spellList.loadJSON(json.spells);

        this.missingHP = json?.hp_damage ?? 0;
        this.missingFP = json?.fp_damage ?? 0;

        this.DX.setLevel(json.DX);
        this.FP.setLevel(json.fp_adj);
        this.HP.setLevel(json.hp_adj);
        this.HT.setLevel(json.HT);
        this.IQ.setLevel(json.IQ)
        this.Move.setLevel(json.move_adj);
        this.Per.setLevel(json.per_adj);
        this.ST.setLevel(json.ST);
        this.Speed.setLevel(json.speed_adj);
        this.Will.setLevel(json.will_adj);

        return this
    }
    toR20() {
        return exportR20(this)
    }
    loadFromActor(actor: Actor) {
        
    }
}

export enum signatures {
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
    Touch = "Touch",
}