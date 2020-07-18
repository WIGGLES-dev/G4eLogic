import { objectify, json } from "../utils/json_utils"

export class Profile {
    tag = "profile"

    sizeModifier: string = ""
    techLevel: string = ""
    birthday: string = ""
    name: string = ""
    eyes: string = ""
    skin: string = ""
    hair: string = ""
    handedness: string = ""
    weight: string = ""
    height: string = ""
    gender: string = ""
    race: string = ""
    bodyType: string = ""
    age: string = ""
    portrait: string = ""

    constructor() {

    }

    toJSON() {

    }
    loadJSON(object: string | json) {
        object = objectify<gcs.Profile>(object);
        this.sizeModifier = object?.size_modifier ?? "";
        this.techLevel = object?.tech_level ?? "";
        this.birthday = object?.birthday ?? "";
        this.name = object?.name ?? "";
        this.eyes = object?.eyes ?? "";
        this.skin = object?.skin ?? "";
        this.hair = object?.hair ?? "";
        this.handedness = object?.handedness ?? "";
        this.weight = object?.weight ?? "";
        this.height = object?.height ?? "";
        this.gender = object?.gender ?? "";
        this.race = object?.race ?? "";
        this.bodyType = object?.bodyType ?? "";
        this.age = object?.age ?? "";
        this.portrait = object?.portait ?? "";
    }
}