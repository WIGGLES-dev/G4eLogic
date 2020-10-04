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

    save() {
        let data: any = {
            size_modifier: this.sizeModifier,
            tech_level: this.techLevel,
            birthday: this.birthday,
            name: this.name,
            eyes: this.eyes,
            skin: this.skin,
            hair: this.hair,
            handedness: this.handedness,
            weight: this.weight,
            height: this.height,
            gender: this.gender,
            body_type: this.bodyType,
            age: this.age,
            portrait: this.portrait
        }
        return data
    }

    load(object: any) {
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
        this.portrait = object?.portrait ?? "";
        return this
    }
}