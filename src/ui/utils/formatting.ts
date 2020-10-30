export function string(string, { beforeStart = "", afterEnd = "", fallback = "", toFixed = 3 } = {}) {
    let output = string;
    try {
        if (string === null) return fallback
        if (string === undefined) return fallback
        if (+string > Number.NEGATIVE_INFINITY && toFixed > -1) output = +string?.toFixed(toFixed)
    } catch (err) {
        output = fallback;
    }
    return beforeStart + output + afterEnd
}