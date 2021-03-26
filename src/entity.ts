import { db } from "@app/database";
import deepmerge from "deepmerge";
import { proxy } from "comlink";
import { merge } from "object-mapper";
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
    value: V
    root: R
    constructor(value: V, root?: R) {
        this.value = value;
        this.root = root || value as unknown as R;
    }
    get enabled() {
        return this?.value?.metadata?.enabled
    }
    get id() {
        return this.value?.id
    }
    get type() {
        return this?.value?.type
    }
    getType() {
        console.log("GETTING TYPE");
        return this.type
    }
    getValue() {
        console.log("GETTING VALUE");
        return this.value
    }
    private static hashEmbedded<R extends Data = Data>(root: R, start: Data = root, maxDepth = Number.POSITIVE_INFINITY) {
        let currentDepth: number = 0;
        const embeds: Record<string, Entity<Data, R>> = {};
        function descend(data: Data) {
            const { children = {} } = data || {};
            for (const [type, data] of Object.entries(children)) {
                for (const child of data) {
                    embeds[child.id] = new Entity<Data, R>(child, root);
                    if (currentDepth++ > maxDepth) descend(child);
                }
            }
        }
        descend(start);
        return embeds;
    }
    getRootEmbeds() {
        return Entity.hashEmbedded(this.root);
    }
    getEmbeds() {
        return Entity.hashEmbedded(this.root, this.value);
    }
    getEmbedded(id: string) {
        return Entity.hashEmbedded(this.root, this.value)[id];
    }
    getChildren() {
        return Entity.hashEmbedded(this.root, this.value, 1);
    }
    getFeatures() {
        const root = new Entity<R>(this.root);
        const embedded = root.getRootEmbeds();
        const activeEmbeds: Entity<Data, R>[] = Object.values(embedded).filter(entity => !!entity.enabled)
        const features = activeEmbeds.flatMap(entity => entity.value.features).filter(v => !!v);
        return features
    }
    async update(value) { }
    async set(value) {
        this.update(value);
    }
    subscribe() { }
    unsubscribe() { }
    map(typeMap, nestfunc) {
        const nodes = this.getEmbeds();
        const transformed = {};
        for (const [id, entity] of Object.entries(nodes)) {
            const map = typeMap[entity.type];
            if (!map) continue;
            transformed[id] = merge(entity.value, map);
        }
    }
}