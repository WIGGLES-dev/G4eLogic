export var StringCompare;
(function (StringCompare) {
    StringCompare["isAnything"] = "is_anything";
    StringCompare["is"] = "is";
    StringCompare["isNot"] = "is_not";
    StringCompare["contains"] = "contains";
    StringCompare["doesNotContain"] = "does_not_contain";
    StringCompare["startsWith"] = "starts_with";
    StringCompare["doesNotStartWith"] = "does_not_start_with";
    StringCompare["endsWith"] = "ends_with";
    StringCompare["doesNotEndWith"] = "does_not_end_with";
})(StringCompare || (StringCompare = {}));
function iterableCompare(compare, compareTo) {
}
export function stringCompare(defaultQuery, skillQuery, type) {
    var _a;
    defaultQuery = defaultQuery === null || defaultQuery === void 0 ? void 0 : defaultQuery.toLowerCase();
    skillQuery = (_a = skillQuery === null || skillQuery === void 0 ? void 0 : skillQuery.toString()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    switch (type) {
        case StringCompare.isAnything: return true;
        case StringCompare.is: return skillQuery === defaultQuery;
        case StringCompare.isNot: return skillQuery !== defaultQuery;
        case StringCompare.contains: return skillQuery.includes(defaultQuery);
        case StringCompare.doesNotContain: return !skillQuery.includes(defaultQuery);
        case StringCompare.startsWith: return skillQuery.startsWith(defaultQuery);
        case StringCompare.doesNotStartWith: return !skillQuery.startsWith(defaultQuery);
        case StringCompare.endsWith: return skillQuery.endsWith(defaultQuery);
        case StringCompare.doesNotEndWith: return !skillQuery.endsWith(defaultQuery);
        default: return false;
    }
}
//# sourceMappingURL=string_utils.js.map