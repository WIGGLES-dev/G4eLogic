import { isNumber } from "./object";
export type SearchObj = object | ((value: any) => boolean);
export type PathSegment = string | number;
export type Path = PathSegment[];
export function getPath(obj: object, value: SearchObj): Path {
  if (obj.constructor !== Object) {
    throw new TypeError(
      "getPath() can only operate on object with Object as constructor"
    );
  }
  const path = [] as string[];
  let found = false;
  function search(haystack) {
    for (let key of Object.keys(haystack || {})) {
      path.push(key);
      if (typeof value === "function") {
        if (value(haystack[key])) {
          found = true;
          break;
        }
      } else if (haystack[key] === value) {
        found = true;
        break;
      }
      if (typeof haystack[key] === "object") {
        search(haystack[key]);
        if (found) break;
      }
      path.pop();
    }
  }
  search(obj);
  return path;
}
export function parsePathstring(pathstring: string, split = ".") {
  pathstring.split(split).map((segment) => {
    if (isNumber(segment)) {
      return +segment;
    } else {
      segment;
    }
  });
}
export function getValue(object: object, key: PathSegment) {
  try {
    return object && object[key];
  } catch (err) {}
}
export function setValue(object: object, key: PathSegment, value: any) {
  try {
    if (object) {
      object[key] = value;
    }
  } catch (err) {}
}
export function getValueAtPath(object: object, path: Path) {
  return path.reduce(getValue, object);
}
export function getValuesFromPath(object: object, path: Path) {
  const values = [object];
  path.forEach((key, i) => {
    const v = getValueAtPath(object, path.slice(0, i + 1));
    values.push(v);
  });
  return values;
}
export function deleteValueAtPath(object: object, path: Path) {
  const [key] = path.slice(-1);
  const value = getValueAtPath(object, path.slice(0, -1));
  try {
    if (value instanceof Array) {
      value.splice(+key, 1);
    } else if (typeof value === "object" && key in value) {
      delete value[key];
    }
  } catch (err) {}
}
export function updateValueAtPath(
  object: object,
  path: Path,
  update: any | ((value: any) => any)
) {
  const [key] = path.slice(-1);
  let value = object;
  for (const segment of path.slice(0, -1)) {
    if (value && value[segment]) {
    } else if (value) {
      value[segment] = {};
    } else {
    }
    value = value[segment];
  }
  if (key) {
    const cv = value[key];
    const nv = typeof update === "function" ? update(cv) : update;
    value[key] = nv;
  }
}
