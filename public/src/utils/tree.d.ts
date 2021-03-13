export declare class Tree<T> {
    root: T;
    constructor(root: T);
    flat(): any[];
}
interface FlattenParams {
    branch: (node: Record<string, any>) => Record<string, any>[];
}
export declare function treeFlatten(root: any, params?: FlattenParams): any[];
declare type AssembleFunction = (node: Record<string, any>, nodes: Record<string, any>[], root: Record<string, any>) => void;
interface ExpandParams {
    root: Record<string, any>;
    assemble: AssembleFunction;
}
export declare function treeExpand(nodes: any, params?: ExpandParams): Record<string, any>;
export {};
