import { Character } from "../character";
import { CharacterElement } from "./element";
import { Feature } from "./feature";
import { Weapon, MeleeWeapon, RangedWeapon } from "../weapon";
import { Collection } from "./collection";
import { AttributeBonus } from "index";

export abstract class List<T extends ListItem> {
    name: string
    collection: Collection<T> = new Collection()
    character: Character

    constructor(name: string) {
        this.name = name;
    }

    attachCharacter(character: Character) { this.character = character; return this }
    getCharacter() {
        try {
            return this.character
        } catch (err) {
            console.log("this list has no character");
        }
    }

    get size() { return this.collection.size }
    get length() { return this.collection.size }
    get [Symbol.iterator]() { return this.collection[Symbol.iterator] }

    get contents() {
        return {
            arr: this.rootItems().arr,
        }
    }

    abstract populator(data?: any): T

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
    removeListItem(item: T) {
        this.collection.delete(item);
    }

    moveListItem(from: number, to: number) {
        this.collection.move(from, to);
        this.iter().forEach(item => item.dispatch());
        this.callHook();
    }

    callHook() { this.getCharacter().Hooks.callAll(`generate ${this.name} list`, this) }

    iter() { return this.collection.arr.sort((a, b) => a.listIndex - b.listIndex) }

    allContainers() { return this.iter().filter(item => item.isContainer()) }
    rootItems() {
        return new Collection(this.iter().filter(item => !item.containedBy))
    }

    save(...args) { return this.character.getSerializer().saveList(this, ...args); }
    load(...args) {
        this.character.getSerializer().loadList(this, ...args);
        return this
    }

    empty() {
        this.collection.clear();
    }
}

export interface Featurable extends ListItem {
    hasLevels: boolean
    getLevel: () => number
}

export abstract class ListItem extends CharacterElement implements Featurable {
    static keys = ["isOpen", "canContainChildren"]

    abstract version: number
    abstract tag: string

    abstract hasLevels: boolean
    abstract name: string

    list: List<this>

    canContainChildren: boolean = false
    isOpen = true

    containedBy: this

    features: Collection<Feature<this>> = new Collection();
    weapons: Collection<Weapon<this>> = new Collection();

    constructor(list: List<any>, keys: string[]) {
        super(list.character, [...keys, ...ListItem.keys]);
        this.list = list;
        list.addListItem(this);
    }

    get children(): Collection<this> {
        let children = this.getList().iter().filter(item => item.containedBy === this);
        return new Collection(children);
    }
    get listIndex() { return this.getList().collection.indexOf(this) }

    /**
     * Abstract method that all list items must impliment in order for features to
     * determine whether or not to apply their bonus based on whatever information they
     * might have available
     */
    abstract isActive(): boolean


    abstract getLevel(): number

    addFeature() {
        let feature = Feature.loadFeature(this);
        this.dispatch();
        return feature
    }
    addWeapon(type: string = "melee_weapon") {
        let weapon: Weapon<this>;
        switch (type) {
            case "melee_weapon":
                weapon = new MeleeWeapon(this);
                break
            case "ranged_weapon":
                weapon = new RangedWeapon(this);
                break
            default:
        }
        this.dispatch();
        return weapon || null
    }


    getList() { return this.list }
    getCharacter(): Character { return this.getList().getCharacter() }

    isContainer() { return this.canContainChildren }
    isContained() { return this.containedBy }

    setContainedBy(target?: this) {
        if (!target) {
            //this.containedBy?.children.delete(this);
            this.containedBy = null;
            return
        }

        if (target === this) return
        if (target.getRecursiveOwners().has(this)) return
        if (target.getRecursiveChildren().has(this)) return

        if (this.isContained()) {
            //this.containedBy.children.delete(this);
        }
        //target.children.add(this);
        this.containedBy = target;
    }
    addAfter(target: this) {
        if (target === this) return

        const tContainer = target.containedBy;

        if (!this.getList().has(target)) return;

        this.setContainedBy(tContainer);

        let from = this.listIndex;
        let to = target.listIndex;

        this.getList().moveListItem(from, to);

        this.getList().getCharacter().dispatch();
    }

    addChild(child?: this) {
        if (!this.isContainer()) return null
        if (!(child instanceof ListItem)) {
            child = this.list.addListItem();
        }
        child.containedBy = this;
        return child
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
        return ([...this.getRecursiveChildren()].pop() || this).getDepth() - this.getItemDepth()
    }
    /**
     * Get how many levels of containment until the topmost container is reached
     */
    getDepthToTop() {
        return this.getRootOwner().getDepth() - this.getItemDepth();
    }

    /* -------------------------------------------- */

    getSiblings() {
        return this.containedBy?.children.delete(this) ?? this.getList().rootItems();
    }
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

    delete(): any {
        this.containedBy?.children.delete(this);
        this.children.forEach(child => {
            child.delete();
        });
        this.list.removeListItem(this);
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
    save(data, ...args) { return this.getSerializer().transform(this.constructor, "save")(this, data, ...args) }
}

interface derivedListOptions {
    splitters: {
        [key: string]: () => any
    }
}
export function createDerivedList(list: List<any>, options: derivedListOptions) {
    const itemInList = list.iter();
    Object.entries(options.splitters).map(([splitter, callback]) => {

    });
}