export enum CaseConvention {
    PascalCase = "PascalCase",
    snake_case = "snake_case",
    camelCase = "camelCase"
}
export class Formatter {
    sections: ((text: string) => string)[] = []

    static checkCharType(char: string) {

    }
    static fallback(string, fallback) {
        return typeof string === 'string' ? string : fallback
    }
    static getCaseConvention(key: string): CaseConvention {
        const includesSpaces = key.includes(" ");
        const includesUnderscore = key.includes("_");
        if (includesSpaces) return
        if (includesUnderscore) return CaseConvention.snake_case
    }

    constructor() {

    }

    add(segment: string, {
        fallback = '',
        before = '',
        after = '',
        capitalize = false
    }) {
        const section = (text) =>
            typeof segment === 'string' ?
                + Formatter.fallback(before, fallback)
                + Formatter.fallback(segment, fallback)
                + Formatter.fallback(after, fallback) : '';
        this.sections.push(section);
    }
    output(): string {
        return this.sections.reduce((text, section) => section(text), '')
    }
}