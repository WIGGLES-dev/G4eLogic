"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDataType = exports.Serializer = void 0;
class Serializer {
    constructor() {
    }
}
exports.Serializer = Serializer;
Serializer.dataTypes = new Set();
function registerDataType(type) {
    Serializer.dataTypes.add(type);
    return this;
}
exports.registerDataType = registerDataType;
//# sourceMappingURL=serializer.js.map