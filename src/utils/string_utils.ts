export enum StringCompare {
    isAnything = "is_anything",
    is = "is",
    isNot = "is_not",
    contains = "contains",
    doesNotContain = "does_not_contain",
    startsWith = "starts_with",
    doesNotStartWith = "does_not_start_with",
    endsWith = "ends_with",
    doesNotEndWith = "does_not_end_with",
}

function iterableCompare(compare: string, compareTo: string | string[] | Set<string>) {

}

export function stringCompare(defaultQuery: string, skillQuery: string | string[] | Set<string>, type: StringCompare): boolean {
    defaultQuery = defaultQuery?.toLowerCase();
    skillQuery = skillQuery?.toString()?.toLowerCase();

    //if (defaultQuery === "fast-draw") console.log(skillQuery, type, defaultQuery);

    switch (type) {
        case StringCompare.isAnything: return true
        case StringCompare.is: return skillQuery === defaultQuery
        case StringCompare.isNot: return skillQuery !== defaultQuery
        case StringCompare.contains: return skillQuery.includes(defaultQuery)
        case StringCompare.doesNotContain: return !skillQuery.includes(defaultQuery)
        case StringCompare.startsWith: return skillQuery.startsWith(defaultQuery)
        case StringCompare.doesNotStartWith: return !skillQuery.startsWith(defaultQuery)
        case StringCompare.endsWith: return skillQuery.endsWith(defaultQuery)
        case StringCompare.doesNotEndWith: return !skillQuery.endsWith(defaultQuery)
        default: return false
    }
}

export function insensitiveStringCompare(string1: string, string2: string): boolean {
    return string1.toLowerCase() === string2.toLowerCase()
}