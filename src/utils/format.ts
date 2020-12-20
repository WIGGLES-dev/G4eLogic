export enum CaseConvention {
    PascalCase = "PascalCase",
    snake_case = "snake_case",
    camelCase = "camelCase"
}
export class Formatter {
    strings: string[]

    static checkCharType(char: string) {

    }
    static getCaseConvention(key: string): CaseConvention {
        const includesSpaces = key.includes(" ");
        const includesUnderscore = key.includes("_");
        if (includesSpaces) return
        if (includesUnderscore) return CaseConvention.snake_case
    }

    constructor() {

    }

    startString() {

    }

    after() { }
    before() { }

    output(): string {
        return ""
    }
}