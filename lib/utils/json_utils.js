"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectify = void 0;
function objectify(object, reviver) {
    if (typeof object === "string")
        object = JSON.parse(object, reviver);
    return object;
}
exports.objectify = objectify;
//# sourceMappingURL=json_utils.js.map