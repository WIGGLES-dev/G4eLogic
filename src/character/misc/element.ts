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

    disabled: boolean
    reference: string
    userDescription: string
    notes: string
    #categories: Set<string> = new Set()

    character: Character

    constructor(character?: Character, keys: string[] = []) {
        super([...keys, ...CharacterElement.keys]);
        this.character = character;

        this.disabled = false;
        this.reference = "";
        this.userDescription = "";
        this.notes = "";

        this.register();
    }

    get categories() { return this.#categories }
    set categories(value: Set<string>) {
        this.#categories = Array.isArray(value) ? new Set(value) : value;
    }

    addToCharacter(character: Character) {
        this.character = character;
    }

    get id() { return this.uuid }

    disable() { this.disabled = true; }
    enable() { this.disabled = false; }

    delete(): any {
        this.character.removeElement(this);
    }

    getSerializer(scope?: string) { return this.character.getSerializer(scope) }

    register() {
        this.character.registerElement(this);
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
}

export abstract class OwnedElement<T extends CharacterElement = CharacterElement> extends CharacterElement {
    owner: T

    constructor(owner: T, keys = []) {
        super(owner.character, keys);
        this.owner = owner;
    }

    dispatch() {
        this.owner.dispatch();
        super.dispatch();
    }
}