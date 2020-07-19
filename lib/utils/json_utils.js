export function objectify(object, reviver) {
    if (typeof object === "string")
        object = JSON.parse(object, reviver);
    return object;
}
export function isArray(potentialArray) {
    return Array.isArray(potentialArray) ? potentialArray : [];
}
//# sourceMappingURL=json_utils.js.map