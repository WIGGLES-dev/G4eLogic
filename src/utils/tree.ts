export class Tree<T> {
    root: T
    constructor(root: T) {
        this.root = root;
    }
    flat() { return treeFlatten(this.root) }
}
interface FlattenParams {
    branch: (node: Record<string, any>) => Record<string, any>[]
}
export function treeFlatten(root, params?: FlattenParams) {
    const {
        branch = parent => Object.values(parent.children).flat().map(node => node["parent"] = parent.id)
    } = params
    const list = [];
    function descend(node) {
        branch(node).forEach(obj => {
            list.push(obj);
            descend(obj);
        })
    }
    descend(root);
    return list
}
type AssembleFunction = (node: Record<string, any>, nodes: Record<string, any>[], root: Record<string, any>) => void
interface ExpandParams {
    root: Record<string, any>
    assemble: AssembleFunction
}
export function treeExpand(nodes, params?: ExpandParams) {
    const {
        root = {},
        assemble = (node, nodes, root) => {
            const parent = nodes.find(({ id }) => id === node.parent) || root;
            const collection = parent.children[node.type] || [];
            if (!parent.children) parent.children = {};
            parent.children[node.type] = [...collection, node]
        }
    } = params;
    for (const node of nodes) {
        assemble(node, nodes, root);
    }
    return root
}