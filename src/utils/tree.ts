import { paths } from "jsonpath";
import { arrayMove } from "./object";
import { getPath, getValuesFromPath, SearchObj, Path, getValueAtPath, updateValueAtPath, deleteValueAtPath } from "./path";
import { v4 } from "uuid";
type TreeObject = Record<string, any>
export interface TreeHash<T extends TreeObject> {
    src: any
    srcId: string
    nodes: T[]
    hashMap: Record<string, T>
    pathMap: Record<string, Path>
    depthMap: Record<string, number>
    ancestorMap: Record<string, string[]>
    ids: string[]
}
export class Tree<T extends TreeObject> {
    readonly hashPath: Path
    readonly idPath: Path
    src: TreeObject
    nodes: T[]
    hashMap: Record<string, T>
    pathMap: Record<string, Path>
    depthMap: Record<string, number>
    ancestorMap: Record<string, string[]>
    ids: string[]
    constructor(tree: any, hashPath: Path, idPath: Path) {
        const { src, nodes, hashMap, pathMap, depthMap, ancestorMap, ids } = Tree.hash<T>(tree, hashPath, idPath);
        this.src = src;
        this.hashPath = hashPath;
        this.idPath = idPath;
        this.nodes = nodes;
        this.hashMap = hashMap;
        this.pathMap = pathMap;
        this.depthMap = depthMap;
        this.ancestorMap = ancestorMap;
        this.ids = ids;
    }
    hash(data: TreeObject) {
        return Tree.hash<any>(data, this.hashPath, this.idPath);
    }
    changes(data: TreeObject) {
        return this._deDupe(this.hash(data));
    }
    private _objectInTree(obj) {
        if (typeof obj === "object") {
            return this.nodes.includes(obj);
        } else {
            return false
        }
    }
    private _childrenOfNode(id: string) {
        const ancestors = this.ancestorMap[id];
        return this.ids.filter(id => !ancestors.includes(id));
    }
    private _hasNode(id: string) {
        return this.ids.includes(id);
    }
    private _updateNode() {

    }
    private _applyMods() {

    }
    private _insertData(nodeId: string, data: TreeObject, into = false) {
        const hash = this.hash(data);
        const node = this.hashMap[nodeId];
        const parent = this.hashMap[node.parentId];
        const targetNode = into ? node : parent;
        if (targetNode) {
            updateValueAtPath(targetNode, this.hashPath.concat(this.hashPath), value => {
                if (value instanceof Array) {
                    value.push(hash.src);
                } else if (typeof value === "object") {
                    value[hash.srcId] = hash.src;
                }
                return value
            });
        }
        this._joinHash(hash);
    }
    private _joinHash(hash: TreeHash<T>) {
        this.nodes.push(...hash.nodes);
        this.ids.push(...hash.ids);
        Object.assign(this.hashMap, hash.hashMap);
        Object.assign(this.pathMap, hash.pathMap);
        Object.assign(this.depthMap, hash.depthMap);
        Object.assign(this.ancestorMap, hash.ancestorMap);
    }
    private _removeNodes(...ids: string[]) {
        for (const id of ids) {
            const childrenIds = this._childrenOfNode(id);
            for (const childId of childrenIds) {
                deleteValueAtPath(this.src, this.pathMap[childId]);
                delete this.hashMap[childId];
                delete this.pathMap[childId];
                delete this.depthMap[childId];
                delete this.ancestorMap[childId];
            }
            this.nodes = this.nodes.filter(node => node && "id" in node && !childrenIds.includes(node.id));
            this.ids = this.ids.filter(id => id && !childrenIds.includes(id));
        }
    }
    private _deDupe(hash: TreeHash<T>) {
        for (const node of hash.nodes) {
            const id = getValueAtPath(node, this.idPath);
            if (hash.ids.includes(id)) {
                updateValueAtPath(node, this.idPath, v4());
            }
        }
        return hash;
    }
    update(id: string) {

    }
    append(id: string, data: TreeObject) {
        this._insertData(id, data);
    }
    appendChild(id: string, data: TreeObject) {
        this._insertData(id, data, true);
    }
    remove(id: string) {

    }
    static move(hash: TreeHash<any>, fromId: string, toId: string, options = {} as any) {
        const { lift, nest } = options;
        const fromPath = hash.pathMap[fromId];
        const toPath = hash.pathMap[toId].slice(0, lift > 0 ? lift * -1 : lift).concat(nest);
        const fromValues = getValuesFromPath(hash.src, fromPath);
        const toValues = getValuesFromPath(hash.src, toPath);
        const [fromParent, fromValue] = fromValues.slice(-2);
        const [toParent, toValue] = toValues.slice(-2);
        const [fromKey] = fromPath.slice(-1);
        const [toKey] = toPath.slice(-1);
        if (toValue instanceof Array) {
            if (fromParent instanceof Array) {
                fromParent.splice(+fromKey, 1)
            } else {
                delete fromParent[fromKey];
            }
            toValue.unshift(fromValue);
        } else if (toParent instanceof Array) {
            if (fromParent === toParent) {
                arrayMove(toParent, +fromKey, +toKey);
            } else {
                if (fromParent instanceof Array) {
                    fromParent.splice(+fromKey, 1);
                } else {
                    delete fromParent[fromKey];
                }
                toParent.splice(+toKey, 0, fromValue);
            }
        } else {
            toParent[toKey] = fromValue;
            delete fromParent[fromKey];
        }
        return hash.src
    }
    static eject(hash: TreeHash<any>, id: string) {

    }
    static contruct<T>(hash: TreeHash<T>): TreeObject {
        return {}
    }
    static testNode(value, filter = {}) {
        let passing = true;
        for (const [key, test] of Object.entries(filter)) {
            if (passing === false) break;
            const target = getValueAtPath(value, key.split("."));
            if (typeof test === "function") {
                return test(target);
            } else if (typeof test === "string") {
                switch (test[0]) {
                    case "<": passing = target >= +test.slice(1)
                    case ">": passing = target >= +test.slice(1)
                    case "<=": passing = target >= +test.slice(2)
                    case ">=": passing = target >= +test.slice(2)
                    case "==": passing = target == test.slice(2)
                    case "===": passing = target === test.slice(3)
                    default: passing = target === test;
                }
            }
        }
        return passing
    }
    static hash<T>(src: TreeObject, hashPath: Path, idPath: Path, filter?) {
        const srcId = getValueAtPath(src, idPath);
        const nodes: T[] = [];
        const hashMap: Record<string, T> = {};
        const pathMap: Record<string, Path> = {};
        const depthMap: Record<string, number> = {};
        const indentMap: Record<string, number> = {};
        const ancestorMap: Record<string, string[]> = {};
        const ids: string[] = [];
        function hashNext(node, depth = 0, indent = depth, ancestors = [], path = [] as Path) {
            const id = getValueAtPath(node, idPath);
            const passing = Tree.testNode(node, filter);
            if (id == null) {
                updateValueAtPath(node, idPath, v4());
            }
            const children = getValueAtPath(node, hashPath);
            const _depth = depth + 1;
            const _indent = passing ? indent + 1 : indent;
            const _ancestors = [...ancestors, id];
            if (children instanceof Array) {
                let i = 0;
                for (const child of children) {
                    const _path = [...path, ...hashPath, i++];
                    hashNext(child, _depth, _indent, _ancestors, _path);
                }
            } else {
                for (const [key, child] of Object.entries(children || {})) {
                    const _path = [...path, ...hashPath, key];
                    hashNext(child, _depth, _indent, _ancestors, _path);
                }
            }
            nodes.push(node);
            hashMap[id] = node;
            pathMap[id] = path;
            depthMap[id] = depth;
            ancestorMap[id] = ancestors;
            ids.push(id);
        }
        hashNext(src);
        return { src, srcId, nodes, hashMap, pathMap, depthMap, indentMap, ancestorMap, ids }
    }
}
export function move(src: object, from: SearchObj, to: SearchObj, { lift = undefined, nest = [] } = {}) {
    const object = JSON.parse(JSON.stringify(src))
    const fromPath = getPath(object, from);
    const toPath = getPath(object, to).slice(0, lift > 0 ? lift * -1 : lift).concat(nest);
    const fromValues = getValuesFromPath(object, fromPath);
    const toValues = getValuesFromPath(object, toPath);
    const [fromParent, fromValue] = fromValues.slice(-2);
    const [toParent, toValue] = toValues.slice(-2);
    const [fromKey] = fromPath.slice(-1);
    const [toKey] = toPath.slice(-1);
    if (toValue instanceof Array) {
        if (fromParent instanceof Array) {
            fromParent.splice(+fromKey, 1)
        } else {
            delete fromParent[fromKey];
        }
        toValue.unshift(fromValue);
    } else if (toParent instanceof Array) {
        if (fromParent === toParent) {
            arrayMove(toParent, +fromKey, +toKey);
        } else {
            if (fromParent instanceof Array) {
                fromParent.splice(+fromKey, 1);
            } else {
                delete fromParent[fromKey]
            }
            toParent.splice(+toKey, 0, fromValue);
        }
    } else {
        toParent[toKey] = fromValue;
        delete fromParent[fromKey]
    }
    return object
}