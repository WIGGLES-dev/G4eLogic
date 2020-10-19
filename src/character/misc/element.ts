import {
    generateUUID
} from "@utils/uuid";
import { Character } from "@character/character";
import { Observable } from "@character/general/observable";


// @watch("reference", "userDescription", "notes", "categories")
export abstract class CharacterElement extends Observable {
    static keys = ["reference", "userDescription", "notes", "disabled"]

    uuid: string = generateUUID().toString()
    foundryID: string

    disabled: boolean = false
    reference: string = ""
    userDescription: string = ""
    notes: string = ""
    #categories: Set<string> = new Set()

    character: Character

    constructor(character?: Character, keys: string[] = []) {
        super([...keys, ...CharacterElement.keys]);
        this.character = character;
        this.register();
    }

    addToCharacter(character: Character) {
        this.character = character;
    }

    get categories() { return this.#categories }
    set categories(categories) {
        if ([...categories].length < 1) return
        this.#categories = new Set([...categories]);
        this.dispatch();
    }
    get id() { return this.uuid }

    getCharacter() { return this.character }

    disable() { this.disabled = true; }
    enable() { this.disabled = false; }

    delete() {
        this.character.removeElement(this);
        this.dispatch();
    }

    getSerializer(scope?: string) { return this.character.getSerializer(scope) }

    register() {
        this.character.registerElement(this);
    }

    dispatch() {
        this.character?.dispatch();
        super.dispatch();
    }

    setState(oldV: any, newV: any, prop: string) {
        this.character.State.addState({
            undo: () => {
                this.setValue({
                    [prop]: oldV
                });
            },
            redo: () => {
                this.setValue({
                    [prop]: newV
                });
            }
        });
    }

    load(data: any, ...args) { return this.getSerializer().transform(this.constructor, "load")(this, data, ...args) }
    save(data: any, ...args) { return this.getSerializer().transform(this.constructor, "save")(this, data, ...args) }
}

export abstract class OwnedElement<T extends CharacterElement = CharacterElement> extends CharacterElement {
    owner: T

    constructor(owner: T, keys = []) {
        super(owner.character, keys);
        this.owner = owner;
        this.owner.dispatch();
    }
    getCharacter(): Character { return this.owner.getCharacter() }
    dispatch() {
        this.owner.dispatch();
        super.dispatch();
    }
}