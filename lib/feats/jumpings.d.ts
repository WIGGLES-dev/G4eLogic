import { Character } from "../character/character";
export declare class Jump {
    character: Character;
    distanceMoved: number;
    properlyPrepared: boolean;
    constructor(character: Character);
    superJumpMultiplier(): number;
    jumpingSkillLevel(): import("..").Skill;
    characterEffectiveHighestMove(): number;
    highJump(): {
        distance: number;
        units: string;
        toString(): string;
    };
    broadJump(): {
        distance: number;
        units: string;
        toString(): string;
    };
}
