export function filterKeys<T>(object: Record<string, T>, predicate: (key: string, value: T, src: Record<string, T>) => boolean) {
    return Object.entries(object)
        .filter(([key, value]) => predicate(
            key, value, object)
        )
        .reduce((object, [key, value]) => (
            { ...object, [key]: value }
        ), {} as Record<string, T>)
}

export function flatFilter() { }