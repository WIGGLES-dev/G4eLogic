import { Character, Featurable } from "../character";
import { CharacterElement } from "./element";
import { Feature } from "./feature";
import { Weapon } from "../weapon";
import { objectify, json, isArray } from "@utils/json_utils";
import * as gcs from "@gcs/gcs";

export abstract class ListItem<T extends Featurable> extends CharacterElement<T> implements gcs.ListItem<T> {
    abstract version: number
    abstract tag: string
    
    abstract name: string

    list: List<T>

    canContainChildren: boolean
    open: boolean

    children: Set<ListItem<T>>
    #childIDs: Set<string>

    isContained: boolean
    containedBy: T
    #containedByID: string

    features: Set<Feature<T>>
    weapons: Set<Weapon<T>>

    listIndex: number

    constructor(list: List<T>) {
        super();
        this.list = list;
        this.features = new Set();
        this.children = new Set();
        this.canContainChildren = false;
        this.open = true;
        this.listIndex = this.list.iter().length;
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

    loadChildren<U>(children: U[], parent: T, loader: (data: U, listItem: T) => T) {
        children.forEach((child: any) => {
            const subElement = loader(child, parent.list.addListItem());
            subElement.containedBy = parent;
            parent.children.add(subElement);
            subElement.loadChildren(isArray(child?.children), subElement, loader)
        });
        return this
    }
    toJSON(): Object {
        return {}
    }
    loadJSON(json: string | json) {
        const data = objectify<gcs.ListItem<T>>(json);
        super.loadJSON(data);
        this.open = data.open ?? true;
    }
    load<U>(loader: (subject: T) => U[]): void {
        function applyChildLoader() {
            return (data: U, listItem: T): T => {
                loader(listItem)
                return listItem
            }
        }
        this.loadChildren(
            loader(this.findSelf()),
            this.findSelf(),
            applyChildLoader()
        )
    }
}

export abstract class List<T extends Featurable> {
    #contents: Map<string, T>
    contents: Set<T>

    abstract populator: new (list: List<T>) => T

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
            listItem = new this.populator(this);
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
        object = objectify<json>(object);
        if (object) {
            object.forEach((skill: json) => {
                const item = new this.populator(this);
                //console.log(item);
                this.#contents.set(item.uuid, item);
                item.loadJSON(skill);
            });
            this.generate();
        }
        return this
    }
}
