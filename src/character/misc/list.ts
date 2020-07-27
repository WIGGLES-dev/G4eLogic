import { Character, Featurable } from "../character";
import { CharacterElement } from "./element";
import { Feature } from "./feature";
import { Weapon } from "../weapon";
import { objectify, json, isArray } from "@utils/json_utils";
import * as gcs from "@gcs/gcs";
import { Constructor } from "@character/serialization/serializer";

export abstract class ListItem<T extends Featurable> extends CharacterElement<T> implements gcs.ListItem<T> {
    abstract version: number
    abstract tag: string

    abstract name: string

    list: List<T>

    canContainChildren: boolean
    open: boolean = true

    children: Set<ListItem<T>>
    #childIDs: Set<string>

    isContained: boolean
    containedBy: T
    #containedByID: string

    features: Set<Feature<T>>
    weapons: Set<Weapon<T>>

    listIndex: number

    constructor(list: List<T>) {
        super(list.character);
        this.list = list;
        this.list.addListItem(this);
        this.features = new Set();
        this.children = new Set();
        this.canContainChildren = false;
        this.listIndex = this.list.iter().length - 1;
    }

    abstract isActive(): boolean

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
    #contents: Map<string, T>
    contents: Set<T>

    abstract populator: new (list: List<T>) => T

    loader: (list: List<any>, data: any) => List<any>
    serializer: (list: List<T>) => any

    character: Character

    constructor(character: Character) {
        this.character = character;
        this.#contents = new Map();
        this.contents = new Set();
        this.loader = character.serializer.loadList;
        this.serializer = character.serializer.saveList;
    }
    generate() {
        this.contents.clear();
        this.iter().reduce((prev, cur) => {
            if (!cur.containedBy) prev.add(cur);
            return prev
        }, this.contents);
    }

    addListItem(item?: T | ListItem<T>): T {
        let listItem: T;
        if (item) {
            this.#contents.set(item.uuid, item as T);
            listItem = item.findSelf();
        } else {
            listItem = new this.populator(this);
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
    iter() {
        return Array.from(this.#contents.values())
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
