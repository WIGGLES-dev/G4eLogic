declare class ArmorBuilder {
    armor_coverage: number;
    armor_material: material;
    construction_type: construction_type;
    damage_resistance: number;
    size: number;
    use_weight_scaling: boolean;
    use_sm_scaling: boolean;
    constructor(size: number, { use_weight_scaling, use_sm_scaling }: {
        use_weight_scaling?: boolean;
        use_sm_scaling?: boolean;
    }, weight?: number, customMaterials?: material[], customConstructions?: construction_type[]);
    setMaterial(material: material): void;
    setConstruction(type: construction_type): void;
    setSurfaceArea(area: number): void;
    setDamageResistance(dr: number): void;
    get time_to_don(): number;
    get weight(): number;
    get cost(): number;
}
interface material {
    tl: string;
    material: string;
    wm: number;
    cost: number;
    dr_inch: number;
    max_dr: number;
    notes: MaterialNotes[];
    construction: string[];
}
interface construction_type {
    tl: string;
    type: string;
    cw: number;
    cc: number;
    don: number;
    min_dr: number;
    notes: string[];
}
declare const coverage: {
    head: {
        skull: number;
        face: number;
        readonly total: any;
    };
    neck: number;
    torso: {
        chest: number;
        abdomen: number;
        groin: number;
        readonly total: any;
    };
    arm: {
        shoulder: {
            single: number;
            readonly both: number;
        };
        upper_arm: {
            single: number;
            readonly both: number;
        };
        elbow: {
            single: number;
            readonly both: number;
        };
        forearm: {
            single: number;
            readonly both: number;
        };
        readonly both: any;
        readonly single: number;
    };
    hand: {
        single: number;
        readonly both: number;
    };
    leg: {
        thigh: {
            single: number;
            readonly both: number;
        };
        knee: {
            single: number;
            readonly both: number;
        };
        shin: {
            single: number;
            readonly both: number;
        };
        readonly both: any;
        readonly single: number;
    };
    foot: {
        single: number;
        readonly both: number;
    };
};
declare enum SizeMultipliers {
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
declare enum MaterialNotes {
    B = "B",
    C = "C",
    F = "F",
    S = "S"
}
declare enum ConstructionTypes {
    fabric = "fabric",
    layered_fabric = "layered_fabric",
    scale = "scale",
    mail = "mail",
    segmented_plate = "segmented plate",
    plate = "plate",
    solid = "solid"
}
declare const material: {
    [key: string]: material;
};
declare const construction: {
    [key: string]: construction_type;
};
declare const armor: ArmorBuilder;
