import { Character } from "../character/character";

class Throw {
    character: Character
    objectWeight: number
    constructor(character: Character) {
        this.character = character;
        this.objectWeight = 1;
    }
    skillStrengthAdd() {
        const throwing = this.character.skillList.iter().find(skill => skill.name.toLowerCase() === "throwing");
        const throwingArt = this.character.skillList.iter().find(skill => skill.name.toLowerCase() === "throwing art");

        const throwingRSL = throwing.getRelativeLevel();
        const throwingArtRSL = throwingArt.getRelativeLevel();

        let throwingBonus;
        let throwingArtBonus;

        if (throwingRSL === 1) {
            throwingBonus = 1
        } else if (throwingRSL >= 2) {
            throwingBonus = 2
        }

        if (throwingArtRSL === 0) {
            throwingArtBonus = 1
        } else if (throwingArtRSL > 1) {
            throwingArtBonus = 2
        }

        return Math.max(throwingBonus, throwingArtBonus);
    }
    oneHandMaxThrow() {
        return 2 * this.character.basicLift();
    }
    doesObjectRequireTwoHands() {
        if (this.objectWeight > this.oneHandMaxThrow()) {
            return true
        } else {
            return false
        }
    }
    objectDamage() {
        const basicLift = this.character.basicLift();
        const objectWeight = this.objectWeight;
        if (objectWeight > 0 && objectWeight < basicLift / 8) {
            //Thrust -2 per die
        } else if (objectWeight >= basicLift / 8 && objectWeight < basicLift / 4) {
            //Thrust -1 per die
        } else if (objectWeight >= basicLift / 4 && objectWeight < basicLift / 2) {
            //Thrust 
        } else if (objectWeight >= basicLift / 2 && objectWeight < basicLift) {
            //Thrust +1 per die
        } else if (objectWeight >= basicLift && objectWeight < basicLift * 2) {
            //Thrust
        } else if (objectWeight >= basicLift * 2 && objectWeight < basicLift * 4) {
            //Thrust -1/2 per die (round down)
        } else if (objectWeight >= basicLift * 4 && objectWeight < basicLift * 8) {
            //Thrust -1 per die
        }
    }
    throwingDistance() {
        const weightRatio = this.objectWeight / this.character.basicLift();
        const distanceMod = 0.44 * Math.pow(this.objectWeight, -0.79);
        return (this.character.ST.calculateLevel() + this.skillStrengthAdd()) * distanceMod;
    }
    normalThrow() {

    }
}