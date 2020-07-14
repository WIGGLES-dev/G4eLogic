import { Character } from "../character";
import { CharacterElement } from "./element";
import { Feature } from "./feature";
import { Weapon } from "../weapon";
import { objectify, json } from "../../utils/json_utils";

export abstract class ListItem<T extends ListItem<T>> extends CharacterElement<T> {
    abstract tag: string

    list: List<T>

    canContainChildren: boolean
    open: boolean

    children: Set<T>
    #childIDs: Set<string>

    isContained: boolean
    containedBy: T
    #containedByID: string

    features: Set<Feature<T>>
    weapons: Set<Weapon<T>>

    constructor(list: List<T>) {
        super();
        this.list = list;
        this.features = new Set();
        this.children = new Set();
        this.canContainChildren = false;
        this.open = true;
    }

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

    toJSON(): Object {
        return {}
    }
    loadJSON(object: string | json) {
        object = objectify(object);
        super.loadJSON(object);
        this.open = object.open ?? true;
    }
}

export abstract class List<T extends ListItem<T>> {
    #contents: Map<string, T>
    contents: Set<T>

    abstract class: new (list: List<T>) => T

    character: Character

    constructor(character: Character) {
        this.character = character;
        this.#contents = new Map();
        this.contents = new Set();
    }

    generate() {
        this.contents.clear();
        this.iter().reduce((prev, cur) => {
            if (!cur.containedBy) prev.add(cur);
            return prev
        }, this.contents);
    }

    addListItem(item?: T): T {
        let listItem: T;
        if (item) {
            this.#contents.set(item.uuid, item);
            listItem = item;
        } else {
            listItem = new this.class(this);
            this.#contents.set(listItem.uuid, listItem);
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
    toJSON() {

    }
    loadJSON(object: string | json) {
        object = objectify(object);
        if (object) {
            object.forEach((skill: json) => {
                const item = new this.class(this);
                console.log(item);
                this.#contents.set(item.uuid, item);
                item.loadJSON(skill);
            });
            this.generate();
        }
        return this
    }
}
