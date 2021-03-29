import { db } from "@app/database";
import deepmerge from "deepmerge";
import { proxy } from "comlink";
import { merge } from "object-mapper";
import { getPath, getValueAtPath } from "@utils/object";
export interface Ident {
    rootId?: string
    id: string
    type: string
}
export interface MetaData {
    alternativeIds: Record<string, string>
    source: string
    progenitor?: string
    enabled: boolean
    flags: Record<string, any>
}
export type TypeCollection = Record<string, Data[]>
export interface Data extends Record<string, any>, Ident {
    version: number
    categories: string[]
    name: string
    children: TypeCollection
    features: any[]
    config?: Record<string, any>
    metadata: MetaData
}
export class Entity<V extends Data, R extends Data = V> {
    #value: V
    root: R
    constructor(value: V, root?: R) {
        this.#value = value;
        this.root = root || value as unknown as R;
    }
    get enabled() {
        return this?.getValue()?.metadata?.enabled
    }
    get id() {
        return this.getValue()?.id
    }
    get type() {
        return this?.getValue()?.type
    }
    get path() {
        return getPath(this.root, v => v.id === this.id)
    }
    get name() {
        return this.getValue()?.name
    }
    get parent() {
        const path = this.path;
        const length = path.length;
        const parentPath = path.slice(0, -3);
        const parentValue = getValueAtPath(this.root, parentPath);
        return new Entity(parentValue, this.root);
    }
    get parentId() {
        return this.parent.id
    }
    getType() {
        return this.type
    }
    getValue() {
        return this.#value
    }
    private static hashEmbedded<R extends Data = Data>(root: R, start: Data = root, maxDepth = Number.POSITIVE_INFINITY) {
        let currentDepth: number = 0;
        const embeds: Record<string, Entity<Data, R>> = {};
        function descend(data: Data) {
            const { children = {} } = data || {};
            for (const [type, data] of Object.entries(children)) {
                for (const child of data) {
                    embeds[child.id] = new Entity<Data, R>(child, root);
                    if (currentDepth++ < maxDepth) descend(child);
                }
            }
        }
        descend(start);
        return embeds;
    }
    getRootEmbeds() {
        return Entity.hashEmbedded(this.root);
    }
    getEmbeds(maxDepth?) {
        return Entity.hashEmbedded(this.root, this.getValue(), maxDepth);
    }
    getEmbedded(id: string, maxDepth?) {
        return Entity.hashEmbedded(this.root, this.getValue(), maxDepth)[id];
    }
    getChildren() {
        return Entity.hashEmbedded(this.root, this.getValue(), 1);
    }
    getFeatures() {
        const root = new Entity<R>(this.root);
        const embedded = root.getRootEmbeds();
        const activeEmbeds: Entity<Data, R>[] = Object.values(embedded).filter(entity => !!entity.enabled)
        const features = activeEmbeds.flatMap(entity => entity.getValue()?.features).filter(v => !!v);
        return features
    }
    async update(value) { }
    async set(value) {
        this.update(value);
    }
    subscribe() { }
    unsubscribe() { }
}