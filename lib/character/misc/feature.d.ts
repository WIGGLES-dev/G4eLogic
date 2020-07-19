import { CharacterElement } from "./element";
import { Featurable } from "../character";
import { json } from "utils/json_utils";
import { FeatureType } from "gcs";
import { SkillLike } from "@character/skill";
import { Weapon } from "@character/weapon";
import { StringCompare } from "utils/string_utils";
export declare class FeatureList {
    features: Map<string, Feature<Featurable>>;
    weapons: Map<string, Weapon<Featurable>>;
    constructor();
    registerFeature(feature: Feature<Featurable>): void;
    removeFeature(uuid: string): void;
    getFeaturesByUUID(id: string): Feature<Featurable>[];
    iter(): Feature<Featurable>[];
    getFeaturesByType(type: FeatureType): Feature<Featurable>[];
}
export declare abstract class Feature<T extends Featurable> extends CharacterElement<T> {
    amount: number;
    leveled: boolean;
    limitation: false | string;
    owner: T;
    type: FeatureType;
    registered: boolean;
    constructor(owner: T, type: FeatureType);
    ownerIsActive(): boolean;
    getBonus(): number;
    unregister(): void;
    ownerOwnedBy(owner: T): Boolean;
    toJSON(): void;
    loadJSON(object: string | json): void;
    static loadFeature<T extends Featurable>(owner: T, featureType: FeatureType): Feature<T>;
}
export declare class SkillBonus<T extends Featurable> extends Feature<T> {
    selectionType: string;
    nameCompareType: StringCompare;
    name: string;
    specializationCompareType: StringCompare;
    specialization: string;
    category: string;
    categoryCompareType: StringCompare;
    constructor(owner: T);
    isApplicableTo(skill: SkillLike<any>): boolean;
    toJSON(): {};
    loadJSON(json: string | json): this;
}
