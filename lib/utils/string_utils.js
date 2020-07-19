export var StringCompare;
(function (StringCompare) {
    StringCompare["isAnything"] = "is anything";
    StringCompare["is"] = "is";
    StringCompare["isNot"] = "is not";
    StringCompare["contains"] = "contains";
    StringCompare["doesNotContain"] = "does not contain";
    StringCompare["startsWith"] = "starts with";
    StringCompare["doesNotStartWith"] = "does not start with";
    StringCompare["endsWith"] = "ends with";
    StringCompare["doesNotEndWith"] = "does not end with";
})(StringCompare || (StringCompare = {}));
function iterableCompare(compare, compareTo) {
}
export function stringCompare(compare, compareTo, type) {
    var _a;
    compare = compare === null || compare === void 0 ? void 0 : compare.toLowerCase();
    compareTo = (_a = compareTo === null || compareTo === void 0 ? void 0 : compareTo.toString()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    switch (type) {
        case StringCompare.isAnything: return true;
        case StringCompare.is: return compare === compareTo;
        case StringCompare.isNot: return compare !== compareTo;
        case StringCompare.contains: return compare.includes(compareTo);
        case StringCompare.doesNotContain: return compare.includes(compareTo);
        case StringCompare.startsWith: return compare.startsWith(compareTo);
        case StringCompare.doesNotStartWith: return compare.startsWith(compareTo);
        case StringCompare.endsWith: return compare.startsWith(compareTo);
        case StringCompare.doesNotEndWith: return compare.endsWith(compareTo);
        default: return true;
    }
}
//# sourceMappingURL=string_utils.js.map