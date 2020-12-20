import { apply, nodes, parent, parse, paths, query, stringify, value } from "jsonpath";
import deepMerge from "deepmerge";

export class Query<T> {
    readonly src: T
    readonly root
    scope
    lastPath: string

    constructor(root: T) {
        this.src = deepMerge<T>({}, root);
        this.root = root;
        this.scope = root;
    }

    private get _target() { return this.scope }
    private _setLastPath(path: string) { this.lastPath = path }

    apply() { }
    nodes() { }
    parent(path?: string) { return parent(this.root, path || this.lastPath) }
    value<T>(path: string, newValue) {
        this._setLastPath(path);
        this.scope = value<T>(this._target, path, newValue);
        return this.scope
    }
    query(path: string, count?: number) { return query(this.scope, path, count) }
}