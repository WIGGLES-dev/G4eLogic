import { json } from "@utils/json_utils";
export declare class Profile {
    tag: string;
    sizeModifier: string;
    techLevel: string;
    birthday: string;
    name: string;
    eyes: string;
    skin: string;
    hair: string;
    handedness: string;
    weight: string;
    height: string;
    gender: string;
    race: string;
    bodyType: string;
    age: string;
    portrait: string;
    constructor();
    save(): any;
    load(object: json): this;
}
