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

export class Profile {
    birthPlace = ""
    birthday = ""
    status = ""
    wealth = ""
    income = ""
    expenses = ""
    base = ""
    affiliation = ""
    family = ""

    name = ""
    nickName = ""
    sex = ""
    gender = ""
    race = ""
    handedness = ""

    reaction = ""
    appearanceFeatures = ""

    age = ""
    appearance: Appearance = Appearance.Average
    eyes = ""
    skin = ""
    hair = ""
    facialHair = ""
    build = ""
    weight = ""
    height = ""

    religion = ""
    education = ""
    citizenship = ""
    orientation = ""

    other = ""

    portrait: URL = new URL("silhouette.png", window.location.origin)

    constructor() {

    }
}