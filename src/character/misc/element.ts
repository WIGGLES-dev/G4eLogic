import {
    generateUUID
} from "@utils/2R20";
import { Character } from "@character/character";
import { Collection } from "./collection";
import { watch, rootWatcher } from "@character/general/decororators/dynaprops";
import { Observable } from "@character/general/observable";


// @watch("reference", "userDescription", "notes", "categories")
// @rootWatcher
export abstract class CharacterElement<T extends CharacterElement<T>> extends Observable {
    static keys = ["reference", "userDescription", "notes", "disabled"]

    uuid: string = generateUUID().toString()
    foundryID: string

    disabled: boolean
    reference: string
    userDescription: string
    notes: string
    categories: Collection<string>

    character: Character

    constructor(character: Character, keys: string[]) {
        super([...keys, ...CharacterElement.keys]);

        this.character = character;
        this.character.registerElement(this);

        this.disabled = false;
        this.reference = "";
        this.userDescription = "";
        this.notes = "";
        this.categories = new Collection();
    }

    get id() { return this.uuid }

    disable() { this.disabled = true; }
    enable() { this.disabled = false; }

    delete(): any {
        this.character.removeElement(this);
    }

    getSerializer(scope?: string) { return this.character.getSerializer(scope) }

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

export abstract class OwnedElement<T extends CharacterElement<any>> extends CharacterElement<T> {
    owner: T

    constructor(character: Character, owner: T, keys = []) {
        super(character, keys);
        this.owner = owner;
    }
}