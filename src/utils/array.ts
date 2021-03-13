export function arrayMove<T>(arr: T[], from: number, to: number) {
    const elm = arr.splice(from, 1)[0];
    arr.splice(to, 0, elm)
    return arr
}
export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
}