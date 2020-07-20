import { json } from "@utils/json_utils";
declare enum DefaultType {
    skill = "Skill"
}
export declare abstract class DefaultList {
}
export declare abstract class Default<T> {
    tag: string;
    type: DefaultType;
    modifier: number;
    name?: string;
    specialization?: string;
    owner: T;
    constructor(owner: T);
    toJSON(): void;
    loadJSON(object: json): this;
}
export {};
