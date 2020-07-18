export enum StringCompare {
    isAnything = "is anything",
    is = "is",
    isNot = "is not",
    contains = "contains",
    doesNotContain = "does not contain",
    startsWith = "starts with",
    doesNotStartWith = "does not start with",
    endsWith = "ends with",
    doesNotEndWith = "does not end with",
}

function iterableCompare(compare: string, compareTo: string | string[] | Set<string>) {

}

export function stringCompare(compare: string, compareTo: string | string[] | Set<string>, type: StringCompare): boolean {
    compare = compare.toLowerCase();
    compareTo = compareTo.toString().toLowerCase();
    switch (type) {
        case StringCompare.isAnything: return true
        case StringCompare.is: return compare === compareTo
        case StringCompare.isNot: return compare !== compareTo
        case StringCompare.contains: return compare.includes(compareTo)
        case StringCompare.doesNotContain: return compare.includes(compareTo)
        case StringCompare.startsWith: return compare.startsWith(compareTo)
        case StringCompare.doesNotStartWith: return compare.startsWith(compareTo)
        case StringCompare.endsWith: return compare.startsWith(compareTo)
        case StringCompare.doesNotEndWith: return compare.endsWith(compareTo)
    }
}