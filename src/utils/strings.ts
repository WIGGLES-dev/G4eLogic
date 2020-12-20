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
export function stringCompare(a: string, b: string, type: StringCompare): boolean {
    try {
        switch (type) {
            case StringCompare.IsAnything: return true
            case StringCompare.Is: return a === b
            case StringCompare.IsNot: return a !== b
            case StringCompare.Contains: return a.includes(b)
            case StringCompare.DoesNotContain: return !a.includes(b)
            case StringCompare.StartsWith: return a.startsWith(b)
            case StringCompare.DoesNotStartWith: return !a.startsWith(b)
            case StringCompare.EndsWith: return a.endsWith(b)
            case StringCompare.DoesNotEndWith: return !a.endsWith(b)
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

export function string(string, { beforeStart = "", afterEnd = "", fallback = "", toFixed = 3 } = {}) {
    let output = string;
    try {
        if (string === null) return fallback
        if (string === undefined) return fallback
        if (typeof string === "number" && +string > Number.NEGATIVE_INFINITY && toFixed > -1) output = +string?.toFixed(toFixed)
    } catch (err) {
        output = fallback;
    }
    return beforeStart + output + afterEnd
}