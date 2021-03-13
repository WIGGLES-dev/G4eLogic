export declare class Gurps {
    static basicLift(liftingStrength: number): number;
    static encumbranceLevel(basicLift: number, carriedWeight: number): 0 | -1 | -2 | -3 | -4 | -5;
    static encumberedDodgeTarget(encumbranceLevel: number, dodgeTarget: number): number;
    static getThrustDamage(strikingStrength: number): string;
    static getSwingDamage(strikingStrength: number): string;
}
