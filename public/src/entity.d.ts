export interface Ident {
    rootId?: string;
    id: string;
    type: string;
}
export interface MetaData {
    alternativeIds: Record<string, string>;
    source: string;
    progenitor?: string;
    enabled: boolean;
    flags: Record<string, any>;
}
export declare type TypeCollection = Record<string, Data[]>;
export interface Data extends Record<string, any>, Ident {
    version: number;
    categories: string[];
    name: string;
    children: TypeCollection;
    features: any[];
    config?: Record<string, any>;
    metadata: MetaData;
}
export declare class Entity<V extends Data, R extends Data = V> {
    value: V;
    root: R;
    constructor(value: V, root?: R);
    get enabled(): boolean;
    get id(): string;
    get type(): string;
    getType(): string;
    getValue(): V;
    private static hashEmbedded;
    getRootEmbeds(): Record<string, Entity<Data, R>>;
    getEmbeds(): Record<string, Entity<Data, R>>;
    getEmbedded(id: string): Entity<Data, R>;
    getChildren(): Record<string, Entity<Data, R>>;
    getFeatures(): any;
    update(value: any): Promise<void>;
    set(value: any): Promise<void>;
    subscribe(): void;
    unsubscribe(): void;
    map(typeMap: any, nestfunc: any): void;
}
