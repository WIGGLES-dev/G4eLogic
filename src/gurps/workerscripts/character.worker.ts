import { AttributeLevel, Config, Data, Mask } from "@internal";
import * as Comlink from "comlink";
export interface CharacterData extends Data {
    // version: typeof Character["version"]
    // type: typeof Character["type"]
    config: Config
    pointTotal: number
    notes: string
    profile: ProfileData
    hitLocationDamage: Record<string, number>,
    attributeLevels: Record<string, AttributeLevel>
}
export interface ProfileData {
    birthPlace?: string
    birthday?: string
    status?: string
    wealth?: string
    income?: string
    expenses?: string
    base?: string
    affiliation?: string
    family?: string
    name?: string
    nickName?: string
    sex?: string
    gender?: string
    race?: string
    handedness?: string
    reaction?: string
    appearanceFeatures?: string
    voice?: string
    age?: string
    appearance?: Appearance
    eyes?: string
    skin?: string
    hair?: string
    facialHair?: string
    build?: string
    weight?: string
    height?: string
    religion?: string
    education?: string
    citizenship?: string
    orientation?: string
    other?: string
    sizeModifier: number
    portrait: string
    cropped?: string
}
export enum Appearance {
    Horrific,
    Monstrous,
    Hideous,
    Unattractive,
    Average,
    Attractive,
    Handsome_Beautiful,
    Very_Handsome_Beautiful,
    Transcendent
}
export class Character extends Mask<CharacterData> {
    constructor(value: CharacterData) {
        super(value)
    }
}
Comlink.expose(Character);