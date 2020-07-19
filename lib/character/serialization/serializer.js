export class Serializer {
    constructor() {
    }
}
Serializer.dataTypes = new Set();
export function registerDataType(type) {
    Serializer.dataTypes.add(type);
    return this;
}
//# sourceMappingURL=serializer.js.map