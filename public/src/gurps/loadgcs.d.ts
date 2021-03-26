export declare const character: {
    type: {
        key: string;
        transform: () => string;
    };
    version: {
        key: string;
        transform: () => number;
    };
    id: string;
    settings: string;
    created_date: {
        key: string;
        transform: (value: any) => number;
    };
    modified_dattate: {
        key: string;
        transform: (value: any) => number;
    };
    profile: {
        key: string;
        transform: (value: any) => object;
    };
    "profile.name": string;
    total_points: string;
    ST: string;
    DX: string;
    IQ: string;
    HT: string;
    will_adj: string;
    per_adj: string;
    speed_adj: string;
    move_adj: string;
    "advantages[]": {
        key: string;
        transform: (value: any) => object;
    };
    "equipment[]": {
        key: string;
        transform: (value: any) => object;
    };
    "other_equipment[]": {
        key: string;
        transform: (value: any) => object;
    };
    skills: {
        key: string;
        transform: (values: any) => any;
    }[];
    "spells[]": {
        key: string;
        transform: (value: any) => object;
    };
    print_settings: string;
};
