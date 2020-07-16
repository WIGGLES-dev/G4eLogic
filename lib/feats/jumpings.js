"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jump = void 0;
class Jump {
    constructor(character) {
        this.character = character;
        this.properlyPrepared = true;
    }
    superJumpMultiplier() {
        const superJump = this.character.traitList.iter().find(trait => trait.name.toLowerCase() === "super jump");
        if (superJump) {
        }
        else {
            return 1;
        }
    }
    jumpingSkillLevel() {
        return this.character.skillList.iter().find(skill => skill.name.toLowerCase() === "jumping");
    }
    characterEffectiveHighestMove() {
        const move = this.character.Move.calculateLevel();
        const jumpMove = this.jumpingSkillLevel().calculateLevel() / 2;
        const encumbranceLevel = this.character.encumbranceLevel();
        if (move > jumpMove) {
            return move - encumbranceLevel + this.distanceMoved;
        }
        else {
            return jumpMove - encumbranceLevel + this.distanceMoved;
        }
    }
    highJump() {
        return {
            distance: (this.characterEffectiveHighestMove() * 2 - 3) / (this.properlyPrepared ? 2 : 1),
            units: "feet",
            toString() {
                return `High jump height is ${this.distance()} ${this.units}`;
            }
        };
    }
    broadJump() {
        return {
            distance: (this.characterEffectiveHighestMove() * 6 - 10) / (this.properlyPrepared ? 2 : 1),
            units: "inches",
            toString() {
                return `Broad jump distance is ${this.distance()} ${this.units}`;
            }
        };
    }
}
exports.Jump = Jump;
var JumpType;
(function (JumpType) {
    JumpType[JumpType["broad"] = 0] = "broad";
    JumpType[JumpType["high"] = 1] = "high";
})(JumpType || (JumpType = {}));
//# sourceMappingURL=jumpings.js.map