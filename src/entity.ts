import { db } from "@app/database";
import deepmerge from "deepmerge";
import { proxy } from "comlink";
import { merge } from "@utils/object-mapper";
import { getPath, getValueAtPath, path } from "@utils/object";
import { paths } from "jsonpath";
export interface Ident {
    rootId?: string
    id: string
    type: string
}
export interface MetaData {
    alternativeIds: Record<string, string>
    source: string
    progenitor?: string
    lastEdit: number
    createdOn: number
}
export interface Data extends Record<string, any>, Ident {
    version: number
    categories: string[]
    name: string
    enabled: boolean
    flags: Record<string, any>
    children: Data[]
    features: any[]
    config?: Record<string, any>
    __meta__: MetaData
}
export abstract class AbstractEntity {
    constructor() {

    }
}
export class Entity<R extends Data, E extends Data = R> {
    record: R
    embed: E
    path: (string | number)[]
    constructor(record: R | Entity<R, Data>, embed?: E, path: path = []) {
        this.record = record instanceof Entity ? record.record : record;
        this.embed = embed || record as unknown as E;
        this.path = path;
    }
    get entityMap() {
        return {} as any
    }
    get enabled() {
        return this?.getValue()?.enabled
    }
    get id() {
        return this.getValue()?.id
    }
    get type() {
        return this?.getValue()?.type
    }
    get name() {
        return this.getValue()?.name
    }
    get parentData() {
        return getValueAtPath(this.record, this.path.slice(0, -2))
    }
    get parentId() {
        return this.parentData?.id
    }
    getParentData() {
        return this.parentData
    }
    getType() {
        return this.type
    }
    getValue(): E {
        return this.embed
    }
    setValue() {

    }
    private static hashEmbedded<R extends Data>(
        root: R | Entity<R, Data>,
        start: Data = root instanceof Entity ? root.getValue() : root,
        entityMap = {},
        maxDepth = Number.POSITIVE_INFINITY
    ) {
        let currentDepth: number = 0;
        const embeds: Record<string, Entity<R, Data>> = {};
        function descend(data: Data, pathSegment = []) {
            const { children = [] } = data || {};
            children.forEach((child, i) => {
                const type = child.type;
                const constructor = entityMap[type] || Entity;
                embeds[child.id] = new constructor(root, child, [...pathSegment, "children", i]);
                if (currentDepth++ <= maxDepth) descend(child, [...pathSegment, "children", i]);
            })
        }
        descend(start);
        return embeds;
    }
    getRootEmbeds(): Record<string, Entity<R, Data>> {
        return Entity.hashEmbedded(this, this.record, this.entityMap);
    }
    getEmbeds(maxDepth?): Record<string, Entity<R, Data>> {
        return Entity.hashEmbedded(this, this.getValue(), this.entityMap, maxDepth);
    }
    getEmbedsOfType<T extends Entity<R, Data>>(type?: string, maxDepth?: number): Record<string, T> {
        const embeds = Entity.hashEmbedded(this, this.getValue(), this.entityMap, maxDepth)
        if (!type) return embeds as Record<string, T>;
        const entries = Object.entries(embeds).filter(([id, value]) => value.type === type)
        return Object.fromEntries(entries) as Record<string, T>;
    }
    getEmbedded<T extends Entity<R, Data>>(id: string): T {
        return this.getEmbeds()[id] as T;
    }
    getChildren(type?: string) {
        return this.getEmbedsOfType(type, 1);
    }
    async update(value) { }
    async set(value) {
        this.update(value);
    }
    subscribe() { }
    unsubscribe() { }
    process() {
        return {
            path: this.path,
            parentData: this.parentData,
            data: this.getValue(),
            id: this.id,
            type: this.type
        }
    }
    getProccessed(id: string) {
        const path = getPath(this.record, r => r && r.id && r.id === id);
        if (path) {
            const data = getValueAtPath(this.record, path);
            const constructor = this.entityMap[data.type] || Entity
            const entity = new constructor(this, data, path)
            return entity.process();
        }
    }
    static async fetch(recordId, embedId?) {

    }
}

export class EmbeddedEntity extends AbstractEntity {
    constructor(entity, embedHash) {
        super();
    }
}