interface PathNode {
    prop: string
    apply?: boolean
    thisArg?: any
    construct?: boolean
    argArray?: any[]
}
type Path = PathNode[]
const post = Symbol("post");
export function makeProxy<T extends object>(target: T, path: Path = []): T {
    const handler: ProxyHandler<T> = {
        get(_target, prop) {
            if (typeof prop === "symbol") {
                if (prop === post) {
                    return getPathValue(target, path);
                }
                return
            }
            if (_target[prop] === undefined) {

            };
            return makeProxy({}, [...path, { prop }])
        },
        set(_target, prop, value) {
            try {
                _target[prop] = value;
                return true
            } catch (err) {
                return false
            }
        },
        apply(_target, thisArg, argArray) {
            const prop = path[path.length - 1].prop;
            return makeProxy({}, [...path.slice(0, -1), { prop, apply: true, thisArg, argArray }])
        },
        construct(_target, argArray) {
            const prop = path[path.length - 1].prop;
            return makeProxy({}, [...path.slice(0, -1), { prop, construct: true, argArray }])
        },
    }
    return new Proxy({}, handler) as unknown as T
}
export function getNodeValue(target, node: PathNode) {
    const value = target[node.prop];
    if (node.apply === true) {
        return value.apply(node.thisArg, node.argArray)
    } else if (node.construct === true) {
        return new value(...node.argArray)
    } else {
        return value
    }
}
export function getPathValue(target, path: Path) {
    return path.reduce(getNodeValue, target);
}
export function expose() { }
export function wrap() { }