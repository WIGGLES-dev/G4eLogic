import { List, ListItem } from "./misc/list";
import { Attribute, AttributeList } from "./attribute";
import { SkillList } from "./skill/skill";
import { TraitList } from "./trait";
import { Equipment, EquipmentList } from "./equipment";
import { FeatureList } from "./misc/feature";
import { Profile } from "./profile";
import { SpellList } from "./spell";
import { exportR20 } from "@utils/2R20";
import { json, objectify } from "@utils/json_utils";
import { Weapon } from "./weapon";
import { FeatureType } from "@gcs/gcs";
import { Serializer, registerSerializer } from "./serialization/serializer";
import { GCSJSON } from "./serialization/gcs_json";
import { CharacterElement } from "./misc/element";
import { LocationList } from "./locations";
import { Collection } from "./misc/collection";
import { Hooks } from "../hooks/hooks";
import { getThrust, getSwing } from "../damage/damage";

export abstract class Sheet {
    hooks: Hooks = new Hooks()
    serializer = Serializer

    #currentScope
    #elements: Set<CharacterElement<Featurable>> = new Set();

    constructor(defaultScope: string = "GCSJSON") {
        this.#currentScope = defaultScope;
    }

    static registerSerializer(serializer: Serializer) {
        registerSerializer(serializer);
    }

    abstract void(): Sheet

    getSerializer(scope?: string) {
        try {
            if (scope) this.#currentScope = scope;
            return this.serializer.serializers.get(scope || this.#currentScope)
        } catch (err) {
            console.log(err);
        }
    }

    registerElement(element: CharacterElement<Featurable>) {
        this.#elements.add(element);
        this.hooks.callAll("element_added", element);
    }

    removeElement(element: CharacterElement<Featurable>) {
        this.#elements.delete(element);
        this.hooks.callAll("element_removed", element);
    }

    getElementById(type: string, id: string) {
        let result;
        this.#elements.forEach(element => {
            if (element[type] === id) {
                result = element;
            }
        })
        return result || null
    }
}

export interface Featurable extends ListItem<any> {
    hasLevels: boolean
    getLevel: () => number
}

export class Character extends Sheet {
    gCalcID: string

    attributes: Collection<Signature, Attribute> = new Collection()

    missingHP: number
    missingFP: number

    profile: Profile
    skillList: SkillList
    equipmentList: EquipmentList
    otherEquipmentList: EquipmentList
    traitList: TraitList
    spellList: SpellList

    featureList: FeatureList
    locationList: LocationList
    attributeList: AttributeList

    constructor(defaultScope: string) {
        super(defaultScope);

        this.profile = new Profile();
        this.equipmentList = new EquipmentList(this);
        this.otherEquipmentList = new EquipmentList(this);
        this.skillList = new SkillList(this);
        this.traitList = new TraitList(this);
        this.spellList = new SpellList(this);

        this.featureList = new FeatureList(this);
        this.locationList = new LocationList(this);
        this.attributeList = new AttributeList(this);
    }

    getSwingDamage(strength?: number) {
        return getSwing(strength || this.attributeList.getAttribute(Signature.ST).calculateLevel())
    }
    getThrustDamage(strength?: number) {
        return getThrust(strength || this.attributeList.getAttribute(Signature.ST).calculateLevel())
    }

    totalAttributesCost() {
        return Array.from(this.attributeList.attributes.values()).reduce((prev, cur) => {
            if (cur instanceof Attribute) {
                return prev + cur.pointsSpent()
            } else {
                return prev
            }
        }, 0)
    }

    getAttribute(attribute: Signature) {
        return this.attributeList.attributes.get(attribute)
    }

    pointTotals() {
        const racialPoints = this.traitList.sumRacials();
        const attributePoints = this.totalAttributesCost();
        const advantages = this.traitList.sumAdvantages();
        const disadvantages = this.traitList.sumDisadvantages();
        const quirks = this.traitList.sumQuirks();
        const skills = this.skillList.sumSkills();
        const spells = this.spellList.sumSpells();
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

    allItems(): Equipment[] {
        return [].concat.apply([],
            [
                this.equipmentList.iter(),
                this.otherEquipmentList.iter()
            ])
    }

    basicLift() {
        const ST = this.getAttribute(Signature.ST).calculateLevel();
        return Math.round(ST * ST / 5)
    }

    encumbranceLevel() {
        const basicLift = this.basicLift();
        const carriedWeight = this.equipmentList.totalWeight();
        if (carriedWeight < basicLift) {
            return 0
        } else if (carriedWeight < basicLift * 2) {
            return -1
        } else if (carriedWeight < basicLift * 3) {
            return -2
        } else if (carriedWeight < basicLift * 6) {
            return -3
        } else if (carriedWeight < basicLift * 10) {
            return -4
        } else {
            return -5
        }
    }

    encumberedMove() {
        return this.getAttribute(Signature.Move).calculateLevel() + this.encumbranceLevel()
    }

    dodgeScore() { return Math.floor(this.getAttribute(Signature.Speed).calculateLevel() + Attribute.bonusReducer(this, Signature.Dodge) + 3) }

    encumberedDodgeScore() {
        switch (this.encumbranceLevel()) {
            case 0:
                return this.dodgeScore()
            case -1:
                return Math.floor(this.dodgeScore() * .8)
            case -2:
                return Math.floor(this.dodgeScore() * .6)
            case -3:
                return Math.floor(this.dodgeScore() * .4)
            case -4:
                return Math.floor(this.dodgeScore() * .2)
        }
    }

    load(data: any, scope?: string) {
        this.void();
        return this.getSerializer(scope).load(this, data)
    }
    save(scope: string, target: any) {
        return this.getSerializer(scope).save(this, target);
    }

    void() {
        this.featureList.empty();
        this.traitList.empty();
        this.skillList.empty();
        this.equipmentList.empty();
        this.otherEquipmentList.empty();
        this.spellList.empty();
        return this
    }

    toR20() {
        return exportR20(this)
    }
}

export enum Signature {
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