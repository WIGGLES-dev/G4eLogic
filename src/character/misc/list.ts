import { Character } from "../character";
import { CharacterElement } from "./element";
import { Weapon, MeleeWeapon, RangedWeapon } from "../weapon";
import { Feature } from "@character/features/feature";
import { Observable } from "@character/general/observable";

export abstract class List<T extends ListItem = ListItem> extends Observable {
    name: string
    collection: Set<T>
    character: Character

    constructor(name: string, collection: Set<T> = new Set) {
        super();
        this.name = name;
        this.collection = collection
    }

    attachCharacter(character: Character) {
        this.character = character
        this.iter().forEach(item => item.character = character)
        return this
    }
    getCharacter() { return this.character }

    get size() { return this.collection.size }
    get length() { return this.collection.size }
    get [Symbol.iterator]() { return this.collection[Symbol.iterator] }

    get contents() {
        return {
            arr: this.rootItems().sort((a, b) => a.listWeight - b.listWeight),
        }
    }

    abstract populator(data?: any): T
    callHook() { this.getCharacter().Hooks.callAll(`generate ${this.name} list`, this) }

    has(item: T) { return this.collection.has(item) }

    addListItem(item?: T, data: any = {}): T {
        let listItem: T;
        if (item) {
            this.collection.add(item as T);
            listItem = item;
        } else {
            listItem = this.populator(data);
        }
        return listItem
    }

    iter() { return [...this.collection].sort((a, b) => a.listWeight - b.listWeight) }
    allContainers() { return this.iter().filter(item => item.isContainer()) }
    rootItems() { return this.iter().filter(item => !item.containedBy) }

    dispatch() {
        this.character?.dispatch();
        super.dispatch();
    }

    save(...args) { return this.character.getSerializer().saveList(this, ...args); }
    load(...args) {
        this.character.getSerializer().loadList(this, ...args);
        return this
    }

    empty() { this.collection.clear(); }
}

export abstract class ListItem extends CharacterElement {
    static keys = ["isOpen", "canContainChildren", "listWeight", "name"]

    abstract hasLevels: boolean

    name: string = ""
    list: List<this>

    canContainChildren: boolean = false
    listWeight: number
    isOpen = true

    containedBy: this

    features: Set<Feature<this>> = new Set();
    weapons: Set<Weapon<this>> = new Set();

    constructor(list?: List<any>, keys: string[] = []) {
        super(list?.character, [...keys, ...ListItem.keys]);
        if (!list) return this
        this.list = list;
        this.listWeight = this.list.size;
        list.addListItem(this);
    }

    get children(): Set<this> { return new Set(this.getList().iter().filter(item => item.containedBy === this)) }

    /**
     * Abstract method that all list items must impliment in order for features to
     * determine whether or not to apply their bonus based on whatever information they
     * might have available.
     */
    abstract isActive(): boolean
    /**
     * Abstract method that all list items must impliment in order for features to determine their
     * leveled effects.
     */
    abstract getLevel(): number

    addFeature() {
        const feature = new Feature(this);
        this.dispatch();
        return feature
    }
    addWeapon(type: string = "melee_weapon") {
        let weapon: Weapon<this>;
        switch (type) {
            case "ranged_weapon":
                weapon = new RangedWeapon(this);
                break
            default:
                weapon = new MeleeWeapon(this);
                break
        }
        this.dispatch();
        return weapon || null
    }

    getList() { return this.list }

    isContainer() { return this.canContainChildren === true }
    isContained() { return this.containedBy }
    setContainedBy(target?: this) {
        if (!target) {
            this.containedBy = null;
            return
        }
        if (target === this) return
        if (target.getRecursiveOwners().has(this)) return
        if (target.getRecursiveChildren().has(this)) return
        this.containedBy = target;
    }
    addAfter(target: this) {
        if (target === this) return
        const tContainer = target.containedBy;

        if (!this.getList().has(target)) return;
        this.setContainedBy(tContainer);

        resolveWeights(this.getList().iter(), this, target.listWeight);

        this.getList().getCharacter().dispatch();
    }

    /* -------------------------------------------- */

    /**
     * Recursive helper to get the depth of this item;
     * @param depth recursive depth tracker
     */
    private getDepth(depth = 0) { return this.containedBy ? this.containedBy.getDepth(depth + 1) : depth }

    /**
     * Get the depth of the deepest item relative to the root owner
     */
    getRootDepth() { this.getRootOwner().getItemDepth() }
    /**
     * Get the depth of this item relative to the root owner
     */
    getItemDepth() { return this.getDepth() }
    /**
     * Get how many levels of containment until the bottommost container is reached
     */
    getDepthToBottom() { return ([...this.getRecursiveChildren()].pop() || this).getDepth() - this.getItemDepth() }
    /**
     * Get how many levels of containment until the topmost container is reached
     */
    getDepthToTop() { return this.getRootOwner().getDepth() - this.getItemDepth() }

    /* -------------------------------------------- */

    getSiblings() { return this.containedBy?.children.delete(this) ?? this.getList().rootItems() }
    getNextSibling() { }
    getPreviousSibling() { }

    /* -------------------------------------------- */

    getRecursiveChildren(collection: Set<this> = new Set()) {
        if (!this.canContainChildren) return collection
        this.children.forEach(child => {
            collection.add(child);
            if (child.children.size > 0) child.getRecursiveChildren(collection);
        });
        return collection as Set<this>
    }

    /* -------------------------------------------- */

    getRootOwner() {
        return Array.from(this.getRecursiveOwners()).pop() || this
    }

    getRecursiveOwners(collection: Set<this> = new Set()) {
        if (!this.containedBy) return collection
        if (this.containedBy.containedBy) {
            collection.add(this.containedBy);
            this.containedBy.getRecursiveOwners(collection)
        }
        return collection.add(this.containedBy)
    }

    /* -------------------------------------------- */

    dispatch() {
        this.containedBy?.dispatch();
        super.dispatch();
    }

    delete(): any {
        this.children.forEach(child => child.delete());
        this.list.collection.delete(this);
        this.features.forEach(feature => feature.delete());
        this.weapons.forEach(weapon => weapon.delete());
        super.delete();
        return this.list
    }

    private loadChildren<U>(children: U[], parent: this, ...args) {
        children.forEach(child => {
            const subElement = parent.list.addListItem();
            subElement.containedBy = parent;
            //parent.children.add(subElement);
            subElement.load(child, ...args);
        });
    }
    load<U>(data, ...args) {
        const loader = this.getSerializer().transform(this.constructor, "load");
        const children: U[] = loader(this, data, ...args);
        if (children && children.length > 0) {
            this.setValue({
                canContainChildren: true
            }, { update: false });
            this.loadChildren(children, this, ...args);
        }
        return this
    }
}

/**
 * Reducing Algorithm to remove duplicates from derived lists. Any item that appears
 * in the list later on, based on the order of the keys. Things earlier in the lists will
 * be overridden by things later in the list. Be sure to account for that when using this function.
 * @param lists A series of lists to remove the duplicates from
 */
export function removeDuplicates(lists: { [key: string]: ListItem[] }) {
    const checked = new Set();
    return Object.entries(lists).reduce((prev, [key, list]) => {
        checked.add(key);
        const checkAgainst = Object.entries(lists).filter(([key1, list]) => {
            key !== key1 && !checked.has(key1)
        }).map(values => values[1]).map(list => list).flat();
        let newCollection = list.filter(item => !checkAgainst.includes(item));
        lists[key] = newCollection;
        return prev
    }, lists)
}

function resolveWeights(list: ListItem[], target?: ListItem, newWeight?: number) {
    if (!list.includes(target)) return list
    list = list.sort((a, b) => a.listWeight - b.listWeight);
    if (target && newWeight > -1) {
        list.splice(newWeight, 0, list.splice(target.listWeight, 1)[0]);
    }
    list.forEach((item, i) => item.listWeight = i);
}