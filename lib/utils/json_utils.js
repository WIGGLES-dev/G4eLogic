"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isArray = exports.objectify = void 0;
function objectify(object, reviver) {
    if (typeof object === "string")
        object = JSON.parse(object, reviver);
    return object;
}
exports.objectify = objectify;
function isArray(potentialArray) {
    return Array.isArray(potentialArray) ? potentialArray : [];
}
exports.isArray = isArray;
//# sourceMappingURL=json_utils.js.map