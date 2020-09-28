import { Character, Featurable } from "../character";
import { CharacterElement } from "./element";
import { Feature } from "./feature";
import { Weapon, MeleeWeapon, RangedWeapon } from "../weapon";
import { Collection } from "./collection";
import { AttributeBonus } from "index";

export abstract class List<T extends ListItem<any>> {
    name: string
    #contents: Map<string, T> = new Map()
    contents: Collection<T> = new Collection()
    character: Character

    constructor(character: Character, name: string) {
        this.character = character;
        this.name = name
        let x = this.contents.subscribe(list => {
            this.generate();
        });
    }

    get size() { return this.#contents.size }
    get length() { return this.#contents.size }
    get [Symbol.iterator]() { return this.#contents[Symbol.iterator] }

    abstract populator(data: any): T

    generate() {
        this.contents.arr = this.iter().filter(item => !item.containedBy);
        this.character.Hooks.callAll(`generate ${this.name} list`, this);
    }

    addListItem(item?: T | ListItem<any>, data: any = {}): T {
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
    getByUUID(uuid: string) { return this.#contents.get(uuid); }

    iter() { return [...this.#contents.values()] }
    allContainers() { return this.iter().filter(item => item.isContainer()) }

    keys() { return [...this.#contents.keys()] }
    iterTop() {
        this.generate();
        return this.contents.arr
    }

    save(...args) { return this.character.getSerializer().saveList(this, ...args); }
    load(...args) {
        this.character.getSerializer().loadList(this, ...args);
        this.generate();
        return this
    }

    empty() {
        this.#contents.clear();
        this.generate();
    }
}

export abstract class ListItem<T extends Featurable> extends CharacterElement<T> {
    static keys = ["isOpen", "canContainChildren"]

    abstract version: number
    abstract tag: string

    abstract name: string

    list: List<T>

    canContainChildren: boolean = false
    isOpen = true
    listIndex: number

    children: Collection<ListItem<T>> = new Collection()

    isContained: boolean
    containedBy: T

    features: Collection<Feature<T>> = new Collection();
    weapons: Collection<Weapon<T>> = new Collection();

    constructor(list: List<T>, keys: string[]) {
        super(list.character, [...keys, ...ListItem.keys]);
        this.list = list;
        list.addListItem(this);
        this.listIndex = this.list.size
        this.children.subscribe((children) => {
            this.list.generate();
        });
    }

    /**
     * Abstract method that all list items must impliment in order for features to
     * determine whether or not to apply their bonus based on whatever information they
     * might have available
     */
    abstract isActive(): boolean

    addFeature() {
        let feature = Feature.loadFeature(this.findSelf());
        this.dispatch();
        return feature
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

    getCharacter(): Character { return this.list.character }
    isContainer() { return this.canContainChildren }

    setContainedBy(parent: T) {
        if (!parent.isContainer()) return
        if (this.containedBy) {
            this.containedBy.children.delete(this)
        }
        parent.children.add(this);
        this.containedBy = parent;
        this.list.generate();
    }

    addChild(child?: T) {
        if (!this.isContainer()) return null
        if (!(child instanceof ListItem)) {
            child = this.list.addListItem();
        }
        child.containedBy = this;
        return child
    }

    moveTo(i: number) {
        const list = this.list.iter();
        const targetListItem = list[i];

        let thisIndex = this.listIndex;
        let isInPlace = list[thisIndex] === this.findSelf();
        if (!isInPlace) { }

        if (!targetListItem) return

        if (i > list.length) return
        list.splice(i, 0, list.splice(this.listIndex, 1)[0])
        list.forEach((item, i) => {
            item.listIndex = i;
        });
    }

    /* -------------------------------------------- */

    /**
     * Recursive helper to get the depth of this item;
     * @param depth recursive depth tracker
     */
    private getDepth(depth = 0) {
        return this.containedBy ? this.containedBy.getDepth(depth + 1) : depth;
    }

    /**
     * Get the depth of the deepest item relative to the root owner
     */
    getRootDepth() {
        this.getRootOwner().getItemDepth()
    }
    /**
     * Get the depth of this item relative to the root owner
     */
    getItemDepth() {
        return this.getDepth();
    }
    /**
     * Get how many levels of containment until the bottommost container is reached
     */
    getDepthToBottom() {
        return ([...this.getRecursiveChildren()].pop() || this.findSelf()).getDepth() - this.getItemDepth()
    }
    /**
     * Get how many levels of containment until the topmost container is reached
     */
    getDepthToTop() {
        return this.getRootOwner().getDepth() - this.getItemDepth();
    }

    /* -------------------------------------------- */

    getSiblings() {
        if (this.containedBy) return new Set(this.containedBy.children).delete(this);
    }
    getNextSibling() { }
    getPreviousSibling() { }

    /* -------------------------------------------- */

    getRecursiveChildren(collection: Set<T> = new Set()): Set<T> {
        if (!this.canContainChildren) return collection
        this.children.forEach(child => {
            collection.add(child.findSelf());
            if (child.children.size > 0) child.getRecursiveChildren(collection);
        });
        return collection as Set<T>
    }

    /* -------------------------------------------- */

    getRootOwner() {
        return Array.from(this.getRecursiveOwners()).pop() || this.findSelf()
    }
    getRecursiveOwners(collection: Set<T> = new Set()): Set<T> {
        if (!this.containedBy) return collection
        if (this.containedBy.containedBy) {
            collection.add(this.containedBy.findSelf());
            this.containedBy.getRecursiveOwners(collection)
        }
        return collection as Set<T>
    }

    /* -------------------------------------------- */

    iterChildren() { return [...this.children] }
    findSelf(): T { return this.list.getByUUID(this.uuid) }
    delete(): any {
        this.containedBy?.children.delete(this);
        this.children.forEach(child => {
            child.delete();
        });
        this.list.removeListItem(this.findSelf());
        super.delete();
        this.list.generate();
        return this.list
    }
    private loadChildren<U>(children: U[], parent: T, ...args) {
        children.forEach(child => {
            const subElement = parent.list.addListItem();
            subElement.containedBy = parent;
            parent.children.add(subElement);
            subElement.load(child, ...args);
        });
    }
    load<U>(data, ...args): T {
        const loader = this.getSerializer().transform(this.constructor, "load");
        const children: U[] = loader(this.findSelf(), data, ...args);
        if (children && children.length > 0) {
            this.setValue({
                canContainChildren: true
            }, { update: false });
            this.loadChildren(children, this.findSelf(), ...args);
        }
        return this.findSelf()
    }
    save(data, ...args) { return this.getSerializer().transform(this.constructor, "save")(this, data, ...args) }
}
