export declare enum StringCompare {
    isAnything = "is_anything",
    is = "is",
    isNot = "is_not",
    contains = "contains",
    doesNotContain = "does_not_contain",
    startsWith = "starts_with",
    doesNotStartWith = "does_not_start_with",
    endsWith = "ends_with",
    doesNotEndWith = "does_not_end_with"
}
export declare function stringCompare(defaultQuery: string, skillQuery: string | string[] | Set<string>, type: StringCompare): boolean;
