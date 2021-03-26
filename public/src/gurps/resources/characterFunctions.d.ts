export declare class Gurps {
    static basicLift(liftingStrength: number): number;
    static encumbranceLevel(basicLift: number, carriedWeight: number): 0 | -1 | -2 | -3 | -5 | -4;
    static encumberedDodgeTarget(encumbranceLevel: number, dodgeTarget: number): number;
    static getThrustDamage(strikingStrength: number): string;
    static getSwingDamage(strikingStrength: number): string;
}
