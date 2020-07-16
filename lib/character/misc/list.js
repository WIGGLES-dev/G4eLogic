"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _childIDs, _containedByID, _contents;
Object.defineProperty(exports, "__esModule", { value: true });
exports.List = exports.ListItem = void 0;
const element_1 = require("./element");
const json_utils_1 = require("../../utils/json_utils");
class ListItem extends element_1.CharacterElement {
    constructor(list) {
        super();
        _childIDs.set(this, void 0);
        _containedByID.set(this, void 0);
        this.list = list;
        this.features = new Set();
        this.children = new Set();
        this.canContainChildren = false;
        this.open = true;
    }
    isContainer() { return this.canContainChildren; }
    isContainerOpen() { return this.canContainChildren && this.open ? true : false; }
    isVisible() {
        if (this.containedBy.isContainerOpen()) {
            return false;
        }
        else {
            return true;
        }
    }
    previousVisibleSibling() { }
    nextVisibleSibling() { }
    toggle() { if (this.isContainer())
        this.open = !this.open; }
    openContainer() { if (this.isContainer())
        this.open = true; }
    closeContainer() { if (this.isContainer())
        this.open = false; }
    depth() { }
    index() { }
    iterChildren() { return Array.from(this.children); }
    addChild(child) {
        if (this.isContainer()) {
            if (child) {
                child.containedBy.children.delete(child);
                child.containedBy = this.findSelf();
            }
            else {
                child = this.list.addListItem();
                child.containedBy = this.findSelf();
            }
        }
        return child;
    }
    removeChild(child) {
        if (typeof child === "string") {
            child = this.list.getByUUID(child);
        }
        child.containedBy.children.delete(child);
        this.list.removeListItem(child);
    }
    getRecursiveChildren() {
        if (this.canContainChildren) {
        }
        else {
        }
    }
    findSelf() {
        return this.list.getByUUID(this.uuid);
    }
    toJSON() {
        return {};
    }
    loadJSON(object) {
        var _a, _b;
        object = json_utils_1.objectify(object);
        super.loadJSON(object);
        this.levels = (_a = object === null || object === void 0 ? void 0 : object.levels) !== null && _a !== void 0 ? _a : false;
        this.canHaveLevels = this.levels ? true : false;
        this.open = (_b = object.open) !== null && _b !== void 0 ? _b : true;
    }
}
exports.ListItem = ListItem;
_childIDs = new WeakMap(), _containedByID = new WeakMap();
class List {
    constructor(character) {
        _contents.set(this, void 0);
        this.character = character;
        __classPrivateFieldSet(this, _contents, new Map());
        this.contents = new Set();
    }
    generate() {
        this.contents.clear();
        this.iter().reduce((prev, cur) => {
            if (!cur.containedBy)
                prev.add(cur);
            return prev;
        }, this.contents);
    }
    addListItem(item) {
        let listItem;
        if (item) {
            __classPrivateFieldGet(this, _contents).set(item.uuid, item);
            listItem = item;
        }
        else {
            listItem = new this.class(this);
            __classPrivateFieldGet(this, _contents).set(listItem.uuid, listItem);
        }
        this.generate();
        return listItem;
    }
    removeListItem(item) {
        __classPrivateFieldGet(this, _contents).delete(item.uuid);
        this.generate();
    }
    getByIndex(index) {
        return Array.from(this.contents.values())[index];
    }
    getByUUID(uuid) {
        return __classPrivateFieldGet(this, _contents).get(uuid);
    }
    iter() {
        return Array.from(__classPrivateFieldGet(this, _contents).values());
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
    loadJSON(object) {
        object = json_utils_1.objectify(object);
        if (object) {
            object.forEach((skill) => {
                const item = new this.class(this);
                __classPrivateFieldGet(this, _contents).set(item.uuid, item);
                item.loadJSON(skill);
            });
            this.generate();
        }
        return this;
    }
}
exports.List = List;
_contents = new WeakMap();
//# sourceMappingURL=list.js.map