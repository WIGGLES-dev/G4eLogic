import { arrayMove } from "./object";
import {
  getPath,
  getValuesFromPath,
  SearchObj,
  Path,
  getValueAtPath,
  updateValueAtPath,
  deleteValueAtPath,
} from "./path";
import { v4 } from "uuid";
type TreeObject = Record<string, any>;
export interface TreeHash<T extends TreeObject> {
  src: any;
  srcId: string;
  nodes: T[];
  hashMap: Record<string, T>;
  pathMap: Record<string, Path>;
  depthMap: Record<string, number>;
  indentMap: Record<string, number>;
  indexMap: Record<string, number>;
  ancestorMap: Record<string, string[]>;
  ids: string[];
  filteredIds: string[];
}
export class Tree<T extends TreeObject> {
  constructor() { }
  static move(
    src: object,
    from: SearchObj,
    to: SearchObj,
    { lift = undefined, nest = [] } = {}
  ) {
    const object = JSON.parse(JSON.stringify(src));
    const fromPath = getPath(object, from);
    const toPath = getPath(object, to)
      .slice(0, lift > 0 ? lift * -1 : lift)
      .concat(nest);
    const fromValues = getValuesFromPath(object, fromPath);
    const toValues = getValuesFromPath(object, toPath);
    const [fromParent, fromValue] = fromValues.slice(-2);
    const [toParent, toValue] = toValues.slice(-2);
    const [fromKey] = fromPath.slice(-1);
    const [toKey] = toPath.slice(-1);
    if (toValue instanceof Array) {
      if (fromParent instanceof Array) {
        fromParent.splice(+fromKey, 1);
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
    return object;
  }
  static eject(hash: TreeHash<any>, id: string) { }
  static contruct<T>(hash: TreeHash<T>): TreeObject {
    return {};
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
          case "<":
            passing = target >= +test.slice(1);
            break;
          case ">":
            passing = target >= +test.slice(1);
            break;
          case "<=":
            passing = target >= +test.slice(2);
            break;
          case ">=":
            passing = target >= +test.slice(2);
            break;
          case "==":
            passing = target == test.slice(2);
            break;
          case "===":
            passing = target === test.slice(3);
            break;
          default:
            passing = target === test;
        }
      }
    }
    return passing;
  }
  static hash<T>(
    src: TreeObject,
    hashPath: Path,
    idPath: Path,
    filter?,
    maxDepth = Number.POSITIVE_INFINITY,
    rootId?
  ) {
    const srcId = getValueAtPath(src, idPath);
    const nodes: T[] = [];
    const hashMap: Record<string, T> = {};
    const pathMap: Record<string, Path> = {};
    const depthMap: Record<string, number> = {};
    const indentMap: Record<string, number> = {};
    const indexMap: Record<string, number> = {};
    const ancestorMap: Record<string, string[]> = {};
    const ids: string[] = [];
    const filteredIds: string[] = [];
    let rootDepth = 0;
    function hashNext(
      node,
      depth = 0,
      indent = depth,
      index = 0,
      ancestors = [],
      path = [] as Path
    ) {
      const id = getValueAtPath(node, idPath);
      if (id === rootId) rootDepth = depth;
      let passing = Tree.testNode(node, filter) && depth <= maxDepth;
      if (rootId) {
        passing =
          Tree.testNode(node, filter) &&
          depth - rootDepth <= maxDepth &&
          (ancestors.includes(rootId) || id === rootId);
      }
      if (id == null) {
        updateValueAtPath(node, idPath, v4());
      }
      nodes.push(node);
      hashMap[id] = node;
      pathMap[id] = path;
      depthMap[id] = depth;
      indentMap[id] = indent;
      indexMap[id] = index;
      ancestorMap[id] = ancestors;
      ids.push(id);
      if (passing) filteredIds.push(id);
      const children = getValueAtPath(node, hashPath);
      const _depth = depth + 1;
      const _indent = passing ? indent + 1 : indent;
      const _ancestors = [...ancestors, id];
      if (children instanceof Array) {
        children.map((child, i) => {
          const _path = [...path, ...hashPath, i];
          hashNext(child, _depth, _indent, i, _ancestors, _path);
        });
      } else {
        Object.entries(children || {}).map(([key, child], i) => {
          const _path = [...path, ...hashPath, key];
          hashNext(child, _depth, _indent, i, _ancestors, _path);
        });
      }
    }
    hashNext(src);
    return {
      src,
      srcId,
      nodes,
      hashMap,
      pathMap,
      depthMap,
      indentMap,
      indexMap,
      ancestorMap,
      ids,
      filteredIds,
    };
  }
}
