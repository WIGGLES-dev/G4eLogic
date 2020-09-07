import { Character, Featurable } from "../character";
import { CharacterElement } from "./element";
import { Feature } from "./feature";
import { Weapon, MeleeWeapon, RangedWeapon } from "../weapon";
import { objectify, json, isArray } from "@utils/json_utils";
import * as gcs from "@gcs/gcs";
import { Constructor } from "@character/serialization/serializer";
import { Collection } from "./collection";

export abstract class ListItem<T extends Featurable> extends CharacterElement<T> {
    static keys = []

    abstract version: number
    abstract tag: string

    abstract name: string

    list: List<T>

    canContainChildren: boolean = false

    children: Set<ListItem<T>> = new Set()
    #childIDs: Set<string>

    isContained: boolean
    containedBy: T
    #containedByID: string

    features: Set<Feature<T>> = new Set();
    weapons: Set<Weapon<T>> = new Set();

    constructor(list: List<T>, keys: string[]) {
        super(list.character, [...keys, ...ListItem.keys]);
        this.list = list;
        list.addListItem(this);
    }
    /**
     * Abstract method that all list items must impliment in order for features to
     * determine whether or not to apply their bonus based on whatever information they
     * might have available
     */
    abstract isActive(): boolean
    addFeature() { }
    addWeapon(type: string = "melee_weapon") {
        let weapon: Weapon<T>;
        switch (type) {
            case "melee_weapon":
                weapon = new MeleeWeapon(this.findSelf());
                break
            case "ranged_weapon":
                weapon = new RangedWeapon(this.findSelf());
                break
            default:
        }
        return weapon || null
    }
    getCharacter(): Character { return this.list.character }
    isContainer() { return this.canContainChildren }
    iterChildren() { return Array.from(this.children) }
    addChild(child?: T) {
        if (this.isContainer()) {
            if (child) {
                child.containedBy.children.delete(child);
                child.containedBy = this.findSelf();
            } else {
                child = this.list.addListItem();
                child.containedBy = this.findSelf();
            }
        }
        return child
    }
    removeChild(child: string | T) {
        if (typeof child === "string") {
            child = this.list.getByUUID(child);
        }
        if (child.containedBy === this) {
            this.children.delete(child);
        } else {
            child.containedBy.children.delete(child);
        }
        child.delete();
    }
    getRecursiveChildren(collection = new Set()) {
        if (!this.canContainChildren) return collection
        this.children.forEach(child => {
            collection.add(child);
            if (child.children.size > 0) child.getRecursiveChildren(collection);
        });
        return collection
    }
    getRecursiveOwners(collection = new Set()) {
        if (!this.containedBy) return collection
        if (this.containedBy.containedBy) {
            collection.add(this.containedBy);
            this.containedBy.getRecursiveOwners(collection)
        }
        return collection
    }
    findSelf(): T { return this.list.getByUUID(this.uuid) }
    delete() {
        this.children.forEach(child => {
            child.delete();
            this.children.delete(child);
        });
        this.containedBy.removeChild(this);
        this.list.removeListItem(this.findSelf());
        super.delete();
    }
    private loadChildren<U>(children: U[], parent: T, loader: (subject: T, data: U) => U[]) {
        if (children.length > 0) this.canContainChildren = true;
        children.forEach(child => {
            const subElement = parent.list.addListItem();
            const children = loader(subElement, child);
            subElement.containedBy = parent;
            parent.children.add(subElement);
            subElement.loadChildren(isArray(children), subElement, loader);
        });
    }
    load<U>(data): T {
        const loader = this.getSerializer().transformers.get(this.constructor as Constructor).load;
        const children: U[] = loader(this.findSelf(), data);
        if (children && children.length > 0) {
            this.canContainChildren = true;
            this.loadChildren(children, this.findSelf(), loader)
        }
        return this.findSelf()
    }
    save() { return this.getSerializer().transformers.get(this.constructor as Constructor).save(this) }
}

export abstract class List<T extends Featurable> {
    #contents: Collection<string, T> = new Collection()
    contents: Set<T> = new Set()
    character: Character
    constructor(character: Character) {
        this.character = character;
    }

    get length() { return this.#contents.size }
    get [Symbol.iterator]() { return this.#contents[Symbol.iterator] }

    abstract populator(data: any): T

    generate() {
        this.contents.clear();
        this.iter().reduce((prev, cur) => {
            if (!cur.containedBy) prev.add(cur);
            return prev
        }, this.contents);
    }

    addListItem(item?: T | ListItem<T>, data: any = {}): T {
        let listItem: T;
        if (item) {
            this.#contents.set(item.uuid, item as T);
            listItem = item.findSelf();
        } else {
            listItem = this.populator(data);
        }
        this.generate();
        return listItem
    }

    removeListItem(item: T) {
        this.#contents.delete(item.uuid);
        this.generate();
    }

    getByIndex(index: number) { return Array.from(this.contents.values())[index] }
    getByUUID(uuid: string) { return this.#contents.get(uuid); }
    getSize() { return this.#contents.size }
    iter() {
        const contents = this.#contents.iter();
        return contents
    }
    iterTop() {
        this.generate();
        return Array.from(this.contents);
    }
    keys() { return Array.from(this.contents.keys()); }
    save() { return this.character.getSerializer().saveList(this); }
    load(data: string | json) {
        this.character.getSerializer().loadList(this, data as any[]);
        this.generate();
        return this
    }
    empty() {
        this.#contents.clear();
        this.generate();
    }
}
