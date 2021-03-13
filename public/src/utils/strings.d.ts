export declare enum StringCompare {
    IsAnything = "is anything",
    Is = "is",
    IsNot = "is not",
    Contains = "contains",
    DoesNotContain = "does not contain",
    StartsWith = "starts with",
    DoesNotStartWith = "does not start with",
    EndsWith = "ends with",
    DoesNotEndWith = "does not end with"
}
export declare function stringCompare(a: string, b: string, type: StringCompare): boolean;
export declare function insensitiveStringCompare(string1: string, string2: string): boolean;
export declare function capitalize(string: any): any;
export declare function strEncodeUTF16(str: string): number;
export declare function string(string: any, { beforeStart, afterEnd, fallback, toFixed }?: {
    beforeStart?: string;
    afterEnd?: string;
    fallback?: string;
    toFixed?: number;
}): string;
