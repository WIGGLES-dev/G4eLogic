import { CharacterElement } from "./element";
import { Featurable, Character } from "../character";
import { FeatureType } from "@gcs/gcs";
import { SkillLike } from "@character/skill/skill";
import { Weapon } from "@character/weapon";
import { StringCompare } from "@utils/string_utils";
import { Collection } from "./collection";
export declare class FeatureList {
    character: Character;
    features: Collection<string, Feature<Featurable>>;
    weapons: Collection<string, Weapon<Featurable>>;
    constructor(character: Character);
    registerFeature(feature: Feature<Featurable>): void;
    removeFeature(uuid: string): void;
    registerWeapon(weapon: Weapon<Featurable>): void;
    removeWeapon(uuid: string): void;
    getFeaturesByUUID(id: string): Feature<Featurable>[];
    getFeaturesByType<T extends FeatureType>(type: T): Feature<Featurable>[];
    empty(): void;
}
export declare abstract class Feature<T extends Featurable> extends CharacterElement<T> {
    static keys: string[];
    tag: string;
    amount: number;
    leveled: boolean;
    limitation: false | string;
    type: FeatureType;
    owner: T;
    registered: boolean;
    constructor(owner: T, keys: string[]);
    getType(): string;
    ownerIsActive(): boolean;
    getBonus(): number;
    unregister(): void;
    save(): any;
    load(data: any): any;
    static loadFeature<T extends Featurable>(owner: T, featureType: FeatureType): Feature<T>;
}
declare enum SkillBonusSelectionType {
}
export declare class SkillBonus<T extends Featurable> extends Feature<T> {
    static keys: any[];
    static type: FeatureType;
    selectionType: SkillBonusSelectionType;
    nameCompareType: StringCompare;
    name: string;
    specializationCompareType: StringCompare;
    specialization: string;
    category: string;
    categoryCompareType: StringCompare;
    constructor(owner: T, keys?: string[]);
    isApplicableTo(skill: SkillLike<any>): boolean;
}
export declare class DRBonus<T extends Featurable> extends Feature<T> {
    static keys: string[];
    static type: FeatureType;
    location: string;
    constructor(owner: T, keys?: string[]);
}
export {};
