import {
    generateUUID
} from "@utils/uuid";
import { Character } from "@character/character";
import { Collection } from "./collection";
import { watch } from "@character/general/propwatcher";
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
    categories: Collection<string>

    character: Character

    constructor(character?: Character, keys: string[] = []) {
        super([...keys, ...CharacterElement.keys]);
        this.character = character;

        this.disabled = false;
        this.reference = "";
        this.userDescription = "";
        this.notes = "";
        this.categories = new Collection();

        this.register();
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

export abstract class OwnedElement<T extends CharacterElement> extends CharacterElement {
    owner: T

    constructor(character: Character, owner: T, keys = []) {
        super(character, keys);
        this.owner = owner;
    }
}