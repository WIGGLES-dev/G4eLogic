import {
    generateRowID,
    generateUUID
} from "@utils/2R20";
import { objectify, json } from "@utils/json_utils";
import { Character } from "@character/character";
import { Featurable } from "@gcs/gcs";
import { Collection } from "./collection";
import { watch, rootWatcher } from "@character/general/decororators/dynaprops";

// @watch("reference", "userDescription", "notes", "categories")
// @rootWatcher
export abstract class CharacterElement<T extends CharacterElement<T>> {
    static keys = ["reference", "userDescription", "notes", "categories"]
    subscriptions: Set<(store: any) => void> = new Set()

    data: any

    uuid: string = generateUUID().toString()
    r20rowID: string = generateRowID()
    foundryID: string

    reference: string
    userDescription: string
    notes: string
    categories: Collection<string, string>

    character: Character

    constructor(character: Character, keys: string[]) {
        this.createDataAccessors([...keys, ...CharacterElement.keys]);
        this.data = this.proxy();

        this.character = character;
        this.character.registerElement(this);

        this.reference = "";
        this.userDescription = "";
        this.notes = "";
        this.categories = new Collection();
    }
    /**
     * Creates a proxy object that dispatches change events whenever its fields are altered. Changes are only dispatched
     * on assignment, however you can subscribe to collections individually
     */
    private proxy() {
        const _this = this;
        return new Proxy({}, {
            get(target, prop, receiver) {
                if (target[prop] instanceof Collection) {
                    return target[prop].iter()
                }
                return target[prop]
            },
            set(target, prop, value, receiver) {
                if (target[prop] === undefined) {
                    target[prop] = value
                    return true
                }

                if (target[prop] instanceof Collection) {
                    
                } else if (target[prop] === value) {

                } else if (target[prop] !== value) {
                    target[prop] = value
                    _this.dispatch();
                }

                return true
            }
        })
    }
    /**
     * Use reflection to forward data accessors to the internal proxy.
     * @keys A list of keys to forward
     */
    private createDataAccessors(keys: string[]) {
        const props = keys.reduce((prev, cur) => {
            if (!prev[cur]) {
                prev[cur] = {
                    set(val) {
                        try {
                            this.data[cur] = val
                        } catch (err) {

                        }
                    },
                    get() {
                        try {
                            return this.data[cur]
                        } catch (err) {
                            try {
                                return this[cur]
                            } catch (err) {
                                return undefined
                            }
                        }
                    }
                }
            }
            return prev
        }, {});
        Object.defineProperties(this, props)
    }

    getClass() { return this.constructor }

    delete() {
        this.character.removeElement(this);
    }

    getSerializer() { return this.character.serializer }

    dispatch() {
        this.subscriptions.forEach(subscription => {
            subscription(this);
        });
    }

    unsubscribe(subscribtion: (store: any) => void) {
        this.subscriptions.delete(subscribtion)
    }

    subscribe(subscription: (store: any) => void) {
        this.subscriptions.add(subscription);
        subscription(this);
        return () => this.unsubscribe(subscription)
    }

    update(updater: (store: any) => any) {

    }
}