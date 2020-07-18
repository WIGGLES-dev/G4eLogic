"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringCompare = exports.StringCompare = void 0;
var StringCompare;
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
})(StringCompare = exports.StringCompare || (exports.StringCompare = {}));
function iterableCompare(compare, compareTo) {
}
function stringCompare(compare, compareTo, type) {
    compare = compare.toLowerCase();
    compareTo = compareTo.toString().toLowerCase();
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
    }
}
exports.stringCompare = stringCompare;
//# sourceMappingURL=string_utils.js.map