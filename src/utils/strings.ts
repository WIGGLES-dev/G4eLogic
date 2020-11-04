export enum StringCompare {
    IsAnything = "is anything",
    Is = "is",
    IsNot = "is not",
    Contains = "contains",
    DoesNotContain = "does not contain",
    StartsWith = "starts with",
    DoesNotStartWith = "does not start with",
    EndsWith = "ends with",
    DoesNotEndWith = "does not end with",
}
export function stringCompare(defaultQuery: string, skillQuery: string, type: StringCompare): boolean {
    defaultQuery = defaultQuery?.toLowerCase() ?? null;
    skillQuery = skillQuery?.toLowerCase() ?? null;
    try {
        switch (type) {
            case StringCompare.IsAnything: return true
            case StringCompare.Is: return skillQuery === defaultQuery
            case StringCompare.IsNot: return skillQuery !== defaultQuery
            case StringCompare.Contains: return skillQuery.includes(defaultQuery)
            case StringCompare.DoesNotContain: return !skillQuery.includes(defaultQuery)
            case StringCompare.StartsWith: return skillQuery.startsWith(defaultQuery)
            case StringCompare.DoesNotStartWith: return !skillQuery.startsWith(defaultQuery)
            case StringCompare.EndsWith: return skillQuery.endsWith(defaultQuery)
            case StringCompare.DoesNotEndWith: return !skillQuery.endsWith(defaultQuery)
            default: return false
        }
    } catch (err) {
        return false
    }
}

export function insensitiveStringCompare(string1: string, string2: string): boolean {
    return string1.toLowerCase() === string2.toLowerCase()
}

export function capitalize(string) {
    return string.split(" ").map(word => {
        return word[0].toUpperCase() + word.slice(1);
    }).join(' ');
}

export function strEncodeUTF16(str: string) {
    return [...str].reduce((prev, cur) => prev + cur.charCodeAt(0), 0);
}