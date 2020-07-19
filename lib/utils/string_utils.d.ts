export declare enum StringCompare {
    isAnything = "is anything",
    is = "is",
    isNot = "is not",
    contains = "contains",
    doesNotContain = "does not contain",
    startsWith = "starts with",
    doesNotStartWith = "does not start with",
    endsWith = "ends with",
    doesNotEndWith = "does not end with"
}
export declare function stringCompare(compare: string, compareTo: string | string[] | Set<string>, type: StringCompare): boolean;
