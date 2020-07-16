export interface Queryable<T> {
    nameCompareType: string;
    specializationCompareType: string;
    categoryCompareType: string;
    isApplicableTo: (query: Queryable<T>) => boolean;
}
