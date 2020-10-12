import { ListItem } from "./misc/list";
import { Attribute, AttributeList } from "./attribute";
import { SkillList } from "./skill/skill";
import { Trait, TraitList } from "./trait/trait";
import { Equipment, EquipmentList } from "./equipment/equipment";
import { FeatureList } from "./misc/feature";
import { Profile } from "./profile";
import { SpellList } from "./spell";
import { Serializer, registerSerializer } from "../externals/serializer";
import { CharacterElement } from "./misc/element";
import { LocationList } from "./locations";
import { Hooks } from "../hooks/hooks";
import { State } from "state/state";
import { getThrust, getSwing } from "../damage/damage";
import { TechniqueList } from "./technique";
import defaultConfig from "./config.json";
import JsonQuery from "json-query";
import { Plugin } from "../externals/plugin";
import { Observable } from "./general/observable";
import { isTemplateExpression } from "typescript";



export abstract class Sheet extends Observable {
    Hooks: Hooks = new Hooks()
    State: State = new State()
    serializer = Serializer

    defaultConfig: any
    config: any

    plugins: Map<string, Plugin>

    #currentScope = "GCSJSON"
    #elements: Set<CharacterElement> = new Set();

    constructor({
        config,
        plugins = []
    }:
        {
            config: any,
            plugins: Plugin[]
        }
        , keys = []) {
        super([...keys]);
        this.State.subscribe(state => {
            this.dispatch();
        });
        this.defaultConfig = defaultConfig;
        this.config = config || defaultConfig;

        plugins.forEach(plugin => this.registerPlugin(plugin.scope, plugin));

        this.Hooks.callAll("init", this);
    }

    registerPlugin(scope: string, plugin: Plugin) {
        this.plugins.set(scope, plugin.init(this));
    }

    static registerSerializer(serializer: Serializer) {
        registerSerializer(serializer);
    }

    void() {
        this.Hooks.callAll("before void sheet", this);
        this.#elements.clear();
        this.Hooks.callAll("after void sheet", this);
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

    registerElement(element: CharacterElement) {
        this.#elements.add(element);
        this.Hooks.callAll("element_added", element);
        this.dispatch();
    }

    removeElement(element: CharacterElement) {
        this.Hooks.callAll(`before remove element ${element.uuid}`, element)
        this.#elements.delete(element);
        this.Hooks.callAll(`removed element ${element.uuid}`, this);
        this.dispatch();
    }

    getElement(id: string, type = "uuid") {
        let result;
        this.#elements.forEach(element => {
            if (element[type] === id) result = element;
        })
        return result || null
    }

    private defaultQueryLocals() {
        return {

        }
    }

    query(
        query: string,
        locals: { [key: string]: (this: { data: Sheet }, input: any, ...args) => any } = {}
    ) {
        return JsonQuery(query, {
            data: this,
            locals: Object.assign(this.defaultQueryLocals(), locals)
        })
    }

    reconfigure(config: any) {
        this.config = config;
        this.Hooks.callAll("reconfigure", this);
    }
}

export class SheetData<T> {
    data: T
    constructor() {

    }
}

export class Character extends Sheet {
    static keys = ["totalPoints", "missingHP", "missingFP"]

    gCalcID: string

    totalPoints: number = 150

    techLevel: string = "3";
    sizeModifier: number = 0;

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

    constructor(config?: any) {
        super({ config, plugins: [] }, [...Character.keys]);

        this.profile = new Profile();

        this.equipmentList = new EquipmentList().attachCharacter(this);

        this.skillList = new SkillList().attachCharacter(this);
        this.techniqueList = new TechniqueList().attachCharacter(this);
        this.traitList = new TraitList().attachCharacter(this);
        this.spellList = new SpellList().attachCharacter(this);

        this.featureList = new FeatureList(this)
        this.locationList = new LocationList(this)
        this.attributeList = new AttributeList(this);
    }

    status() {
        const hp = this.getAttribute("HP");
        const fp = this.getAttribute("FP");
        return {
            reeling: (hp.calculateLevel() / 3) > hp.currentValue,
            exhausted: (fp.calculateLevel() / 3) > fp.currentValue
        }
    }

    getSwingDamage() {
        const strikingStrength = this.getAttribute("SS").calculateLevel();
        return getSwing(strikingStrength)
    }

    getThrustDamage() {
        const strikingStrength = this.getAttribute("SS").calculateLevel();
        return getThrust(strikingStrength)
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

    getAttribute(attribute: string) {
        return this.attributeList.getAttribute(attribute)
    }

    pointTotals() {
        function sumActiveAdvantages(traits: Trait[]) {
            return traits.reduce((total, trait) => {
                if (trait.isActive() && !trait.isContained()) total += trait.adjustedPoints();
                return total
            }, 0)
        }

        const totalPoints = this.totalPoints;
        const attributePoints = this.totalAttributesCost();

        const traits = this.traitList.split();
        const racialPoints = sumActiveAdvantages(traits.racial);
        const advantages = sumActiveAdvantages(traits.advantages);
        const perks = sumActiveAdvantages(traits.perks);
        const disadvantages = sumActiveAdvantages(traits.disadvantages);
        const quirks = sumActiveAdvantages(traits.quirks);

        const skills = this.skillList.sumPoints();
        const techniques = this.techniqueList.sumPoints();
        const spells = this.spellList.sumPoints();

        return {
            racialPoints,
            attributePoints,
            advantages: advantages + perks,
            disadvantages,
            quirks,

            skills: skills + techniques,
            spells,
            spent: racialPoints + attributePoints + advantages + disadvantages + quirks + skills + spells,
            total: totalPoints,
            get unspent() { return this.total - this.spent }
        }
    }

    allItems(): Equipment[] {
        return [].concat.apply([],
            [
                this.equipmentList.iter(),
                this.otherEquipmentList.iter()
            ])
    }

    meleeWeapons() {
        return [...this.featureList.weapons.values()].filter(item => item.getType() === "melee_weapon")
    }
    rangedWeapons() {
        return [...this.featureList.weapons.values()].filter((item) => item.getType() === "ranged_weapon")
    }

    basicLift() {
        const LS = this.getAttribute("LS").calculateLevel();
        return Math.round(LS * LS / 5)
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

    load(data: any, scope: string, ...args) {
        this.Hooks.callAll("before unload", this);
        this.void();
        this.getSerializer(scope).load(this, data, ...args);
        this.Hooks.callAll("after load", this);
        return this
    }

    save(scope: string, target: any, ...args) {
        this.Hooks.callAll("before save", this);
        this.getSerializer(scope).save(this, target, ...args);
        this.Hooks.callAll("after save", this);
        return this
    }

    void() {
        try {
            super.void();
            this.featureList.empty();
            this.traitList.empty();
            this.skillList.empty();
            this.techniqueList.empty();
            this.equipmentList.empty();
            this.spellList.empty();
            return this
        } catch (err) {
            console.log("Failed the void sheet", err);
        }
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