import { Character, Featurable } from "../character";
import { CharacterElement } from "./element";
import { Feature } from "./feature";
import { Weapon, MeleeWeapon, RangedWeapon } from "../weapon";
import { objectify, json, isArray } from "@utils/json_utils";
import * as gcs from "@gcs/gcs";
import { Constructor } from "@character/serialization/serializer";
import { Collection } from "./collection";

export abstract class ListItem<T extends Featurable> extends CharacterElement<T> implements gcs.ListItem<T> {
    static keys = []

    abstract version: number
    abstract tag: string

    abstract name: string

    list: List<T>

    canContainChildren: boolean
    open: boolean = true

    children: Set<ListItem<T>> = new Set()
    #childIDs: Set<string>

    isContained: boolean
    containedBy: T
    #containedByID: string

    features: Set<Feature<T>> = new Set();
    weapons: Set<Weapon<T>> = new Set();

    listIndex: number

    constructor(list: List<T>, keys: string[]) {
        super(list.character, [...keys, ...ListItem.keys]);
        this.list = list;
        list.addListItem(this);
        this.canContainChildren = false;
        this.listIndex = this.list.iter().length + 1;
    }

    abstract isActive(): boolean

    addFeature() {

    }

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

    getListDepth(): number {
        let x = 0;
        let listItem = this.findSelf();
        while (listItem = listItem.containedBy) {
            x++
        }
        return x
    }

    getCharacter(): Character { return this.list.character }

    isContainer() { return this.canContainChildren }
    isContainerOpen() { return this.canContainChildren && this.open ? true : false }
    isVisible() {
        if (this.containedBy.isContainerOpen()) {
            return false
        } else {
            return true
        }
    }
    previousVisibleSibling() { }
    nextVisibleSibling() { }
    toggle() { if (this.isContainer()) this.open = !this.open; }
    openContainer() { if (this.isContainer()) this.open = true; }
    closeContainer() { if (this.isContainer()) this.open = false; }
    depth() { }
    index() { }
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
        child.containedBy.children.delete(child);
        this.list.removeListItem(child);
    }

    getRecursiveChildren() {
        if (this.canContainChildren) {

        } else {

        }
    }
    findSelf(): T {
        return this.list.getByUUID(this.uuid);
    }
    private loadChildren<U>(children: U[], parent: T, loader: (subject: T, data: U) => U[]) {
        children.forEach(child => {
            const subElement = parent.list.addListItem();
            const children = loader(subElement, child);
            subElement.containedBy = parent;
            parent.children.add(subElement);
            subElement.loadChildren(isArray(children), subElement, loader)
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
    save() {
        return this.getSerializer().transformers.get(this.constructor as Constructor).save(this);
    }
}

export abstract class List<T extends Featurable> {
    #contents: Collection<string, T>
    contents: Set<T>

    loader: (list: List<any>, data: any) => List<any>
    serializer: (list: List<T>) => any

    character: Character

    constructor(character: Character) {
        this.character = character;
        this.#contents = new Collection();
        this.contents = new Set();
        this.loader = character.serializer.loadList;
        this.serializer = character.serializer.saveList;
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

    getByIndex(index: number) {
        return Array.from(this.contents.values())[index]
    }
    getByUUID(uuid: string) {
        return this.#contents.get(uuid);
    }
    getSize() {
        return this.#contents.size
    }
    iter() {
        const contents = this.#contents.iter();
        return contents.sort((a, b) => a.listIndex - b.listIndex)
    }
    iterTop() {
        this.generate();
        return Array.from(this.contents);
    }
    keys() {
        return Array.from(this.contents.keys());
    }
    save() {
        return this.serializer(this)
    }
    load(data: string | json) {
        return this.character.serializer.loadList(this, data as any[])
    }
    empty() {
        this.#contents.clear();
        this.generate();
    }
}
