class ArmorBuilder {
    armor_coverage: number
    armor_material: material
    construction_type: construction_type
    damage_resistance: number

    size: number

    use_weight_scaling: boolean;
    use_sm_scaling: boolean;
    constructor(
        size: number = 0,
        {
            use_weight_scaling = false,
            use_sm_scaling = true
        },
        weight?: number,
        customMaterials?: material[],
        customConstructions?: construction_type[],
    ) {
        this.size = size
        this.use_weight_scaling = use_weight_scaling;
        this.use_sm_scaling = use_sm_scaling;
    }
    setMaterial(material: material) {
        this.armor_material = material;
    }
    setConstruction(type: construction_type) {
        this.construction_type = type
    }
    setSurfaceArea(area: number) {
        this.armor_coverage = area;
    }
    setDamageResistance(dr: number) {
        this.damage_resistance = dr;
    }
    get time_to_don() {
        const base = this.armor_coverage * this.construction_type.don
        if (this.armor_material.notes.includes(MaterialNotes.F) && this.damage_resistance <= this.armor_material.max_dr / 4) {
            return Math.round(base * (2 / 3));
        } else {
            return Math.round(base)
        }
    }
    get weight() {
        console.log(this);
        const final = this.armor_coverage * this.armor_material.wm * this.construction_type.cw * this.damage_resistance;
        return final
        if (this.weight && this.use_weight_scaling) {
            console.log("yupeee");
            return 0
        } else {
            console.log("yupeee");
            return Object.values(SizeMultipliers)[this.size + 6] as number * final
        }
    }
    get cost() {
        const final = this.weight * this.armor_material.cost * this.construction_type.cc;
        if (this.weight && this.use_weight_scaling) {
            return 0
        } else {
            return Object.values(SizeMultipliers)[this.size + 6] as number * final
        }
    }
}

interface material {
    tl: string
    material: string
    wm: number
    cost: number
    dr_inch: number
    max_dr: number
    notes: MaterialNotes[]
    construction: string[]
}

interface construction_type {
    tl: string
    type: string
    cw: number
    cc: number
    don: number
    min_dr: number
    notes: string[]
}

const coverage = {
    head: {
        skull: 1.4,
        face: 0.7,
        get total() { return this.skull + this.face }
    },
    neck: 0.35,
    torso: {
        chest: 5.25,
        abdomen: 1.75,
        groin: 0.35,
        get total() { return this.chest + this.abdomen + this.groin }
    },
    arm: {
        shoulder: {
            single: 0.35,
            get both() { return this.single * 2 }
        },
        upper_arm: {
            single: 0.35,
            get both() { return this.single * 2 }
        },
        elbow: {
            single: 0.175,
            get both() { return this.single * 2 }
        },
        forearm: {
            single: 0.875,
            get both() { return this.single * 2 }
        },
        get both() {
            return this.shoulder.both + this.upper_arm.both + this.elbow.both + this.forearm.both
        },
        get single() {
            return this.both / 2
        },
    },
    hand: {
        single: 0.35,
        get both() { return this.single * 2 }
    },
    leg: {
        thigh: {
            single: 1.575,
            get both() { return this.single * 2 }
        },
        knee: {
            single: 0.175,
            get both() { return this.single * 2 }
        },
        shin: {
            single: 1.7,
            get both() { return this.single * 2 }
        },
        get both() {
            return this.thigh.both + this.knee.both + this.shin.both
        },
        get single() {
            return this.both / 2
        },
    },
    foot: {
        single: 0.35,
        get both() { return this.single * 2 }
    },
}

enum SizeMultipliers {
    sm_less_6 = 0.1,
    sm_less_5 = 0.04,
    sm_less_4 = 0.09,
    sm_less_3 = 0.16,
    sm_less_2 = 0.25,
    sm_less_1 = 0.64,
    sm_0 = 1,
    sm_1 = 2.25,
    sm_2 = 6.25,
    sm_3 = 12.25,
    sm_4 = 25,
    sm_5 = 56.25,
    sm_6 = 100
}

enum MaterialNotes {
    B = "B",
    C = "C",
    F = "F",
    S = "S"
}

enum ConstructionTypes {
    fabric = "fabric",
    layered_fabric = "layered_fabric",
    scale = "scale",
    mail = "mail",
    segmented_plate = "segmented plate",
    plate = "plate",
    solid = "solid",
}

const material: { [key: string]: material } = {
    bone: {
        tl: "0",
        material: "Bone",
        wm: 1,
        cost: 12.5,
        dr_inch: 8,
        max_dr: 4,
        notes: [MaterialNotes.S],
        construction: [ConstructionTypes.scale, ConstructionTypes.solid],
    },
    cloth: {
        tl: "0",
        material: "Cloth",
        wm: 0.85,
        cost: 8,
        dr_inch: 4,
        max_dr: 4,
        notes: [MaterialNotes.C, MaterialNotes.F],
        construction: [ConstructionTypes.fabric],
    },
    horn: {
        tl: "0",
        material: "Horn",
        wm: 0.85,
        cost: 12.5,
        dr_inch: 8,
        max_dr: 4,
        notes: [],
        construction: [ConstructionTypes.scale, ConstructionTypes.fabric]
    },
    leather: {
        tl: "0",
        material: "Leather",
        wm: 0.9,
        cost: 10,
        dr_inch: 9,
        max_dr: 4,
        notes: [MaterialNotes.C, MaterialNotes.F],
        construction: [ConstructionTypes.fabric, ConstructionTypes.layered_fabric, ConstructionTypes.scale]
    },
    wood: {
        tl: "0",
        material: "Wood",
        wm: 1.4,
        cost: 3,
        dr_inch: 1.5,
        max_dr: 2,
        notes: [MaterialNotes.C, MaterialNotes.S],
        construction: [ConstructionTypes.scale, ConstructionTypes.solid]
    },
    bronze_cheap: {
        tl: "1",
        material: "Bronze, cheap",
        wm: 0.9,
        cost: 60,
        dr_inch: 48,
        max_dr: 9,
        notes: [],
        construction: [ConstructionTypes.mail, ConstructionTypes.plate, ConstructionTypes.scale, ConstructionTypes.solid]
    },
    bronze_good: {
        tl: "1",
        material: "Bronze, good",
        wm: 0.6,
        cost: 100,
        dr_inch: 68,
        max_dr: 14,
        notes: [],
        construction: [ConstructionTypes.mail, ConstructionTypes.plate, ConstructionTypes.scale, ConstructionTypes.solid]
    },
    copper: {
        tl: "1",
        material: "Copper",
        wm: 1.7,
        cost: 80,
        dr_inch: 30,
        max_dr: 5,
        notes: [],
        construction: [ConstructionTypes.mail, ConstructionTypes.plate, ConstructionTypes.scale, ConstructionTypes.solid],
    },
    // stone: {

    // },
    // iron_cheap: {},
    // iron_good: {},
    // lead: {},
    // steel_strong: {},
    // steel_hard: {},
    // adamant: {},
    // orichalcum: {},
    // aluminum: {},
    // steel_very_hard: {},
    // titanium: {},
    // aramid_fabric: {}
}


const construction: { [key: string]: construction_type } = {
    fabric: {
        tl: "0",
        type: "Fabric",
        cw: 1,
        cc: 1,
        don: 2.14,
        min_dr: 1,
        notes: ["-1 DR vs. impaling."]
    },
    layered_fabric: {
        tl: "0",
        type: "Layered Fabric",
        cw: 1.2,
        cc: 1.5,
        don: 4.28,
        min_dr: 2,
        notes: ["TL1 for leather.",]
    },
    scales: {
        tl: "1",
        type: "Scales",
        cw: 1.1,
        cc: 0.8,
        don: 4.28,
        min_dr: 2,
        notes: ["-1 DR vs. crushing unless armor is DR5+."]
    },
    mail: {
        tl: "2",
        type: "Mail",
        cw: 0.9,
        cc: 1.2,
        don: 2.14,
        min_dr: 2,
        notes: ["-2 DR vs. crushing.", "If mail has DR 10 or it has -20% DR vs. crushing damage instead of subtracting 2."]
    },
    segmented_plate: {
        tl: "2",
        type: "Segmented Plate",
        cw: 1.45,
        cc: 1.5,
        don: 6.42,
        min_dr: 3,
        notes: [],
    },
    plate: {
        tl: "1",
        type: "Plate",
        cw: 0.8,
        cc: 5,
        don: 6.42,
        min_dr: 3,
        notes: ["If made of iron or steel it is TL4 when used for any location except the head."]
    },
    solid: {
        tl: "1",
        type: "Solid",
        cw: 1,
        cc: 1,
        don: 2,
        min_dr: 10,
        notes: ["If made of iron or steel it is TL4 when used for any location except the head.", "Rarely used in body armor."]
    }
}

const armor = new ArmorBuilder(0, { use_weight_scaling: false, use_sm_scaling: true });
armor.setConstruction(construction.plate);
armor.setMaterial(material.bronze_cheap);
armor.setSurfaceArea(coverage.torso.total);
armor.setDamageResistance(3);

console.log(armor.weight);