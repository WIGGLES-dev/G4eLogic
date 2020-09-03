import { List, ListItem } from "./misc/list";
import { Attribute, AttributeList } from "./attribute";
import { SkillList } from "./skill/skill";
import { TraitList } from "./trait";
import { Equipment, EquipmentList } from "./equipment";
import { FeatureList } from "./misc/feature";
import { Profile } from "./profile";
import { SpellList } from "./spell";
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
import { TechniqueList } from "./technique";
import { Group } from "./misc/group";

export abstract class Sheet {
    hooks: Hooks = new Hooks()
    serializer = Serializer

    #currentScope
    #elements: Set<CharacterElement<Featurable>> = new Set();

    constructor(defaultScope: string = "GCSJSON") {
        this.#currentScope = defaultScope;
        this.hooks.callAll("init", this);
    }

    static registerSerializer(serializer: Serializer) {
        registerSerializer(serializer);
    }

    void() {
        this.hooks.callAll("before void sheet", this);
        this.#elements.clear();
        return this
    }

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
        this.hooks.callAll(`before remove element ${element.uuid}`, element)
        this.#elements.delete(element);
        this.hooks.callAll(`removed element ${element.uuid}`, this);
    }

    getGroupNamed(name: string) {
        let result;
        this.#elements.forEach(element => {
            if (element instanceof Group && element.name === name) result = element
        });
        return result || null
    }

    getElementById(type: string, id: string) {
        let result;
        this.#elements.forEach(element => {
            if (element[type] === id) result = element;
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
    techniqueList: TechniqueList
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
        this.techniqueList = new TechniqueList(this);
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
        return this.attributeList.getAttribute(attribute)
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

    encumbranceLevel({ forSkillEncumbrance = false } = {}) {
        const basicLift = this.basicLift();
        const carriedWeight = forSkillEncumbrance ? this.equipmentList.forSkillEncumbrancePenalty() : this.equipmentList.totalWeight({ carriedOnly: true });
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

    dodgeScore() { return Math.floor(this.getAttribute(Signature.Speed).calculateLevel() + 3) }

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
        this.hooks.callAll("before unload", this);
        this.void();
        this.getSerializer(scope).load(this, data);
        this.hooks.callAll("after load", this);
        return this
    }

    save(scope: string, target: any) {
        this.hooks.callAll("before save", this);
        this.getSerializer(scope).save(this, target);
        this.hooks.callAll("after save", this);
        return this
    }

    void() {
        super.void();
        this.featureList.empty();
        this.traitList.empty();
        this.skillList.empty();
        this.techniqueList.empty();
        this.equipmentList.empty();
        this.otherEquipmentList.empty();
        this.spellList.empty();
        return this
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