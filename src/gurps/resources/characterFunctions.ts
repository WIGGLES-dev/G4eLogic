export class Gurps {
    static basicLift(liftingStrength: number) {
        return Math.round(Math.pow(liftingStrength, 2) / 5)
    }
    static encumbranceLevel(basicLift: number, carriedWeight: number) {
        if (carriedWeight < basicLift) {
            return 0
        } else if (carriedWeight < basicLift * 2) {
            return -1
        } else if (carriedWeight < basicLift * 3) {
            return -2
        } else if (carriedWeight < basicLift * 6) {
            return -3
        } else if (carriedWeight < basicLift * 10) {
            return -4
        } else {
            return -5
        }
    }
    static encumberedDodgeTarget(encumbranceLevel: number, dodgeTarget: number) {
        switch (encumbranceLevel) {
            case 0:
                return dodgeTarget
            case -1:
                return Math.floor(dodgeTarget * .8)
            case -2:
                return Math.floor(dodgeTarget * .6)
            case -3:
                return Math.floor(dodgeTarget * .4)
            case -4:
                return Math.floor(dodgeTarget * .2)
        }
    }
    static getThrustDamage(strikingStrength: number) {
        let value = strikingStrength;
        if (strikingStrength < 19) {
            return Dice.diceString(1, -(6 - (value - 1) / 2))
        }
        value -= 11;
        if (strikingStrength > 50) {
            value--;
            if (strikingStrength > 79) {
                value -= 1 + (strikingStrength - 80) / 5;
            }
        }
        return Dice.diceString(value / 8 + 1, value % 8 / 2 - 1)
    }
    static getSwingDamage(strikingStrength: number) {
        let value = strikingStrength;
        if (value < 10) {
            return Dice.diceString(1, -(5 - (value - 1) / 2))
        }
        if (value < 28) {
            value -= 9;
            return Dice.diceString(value / 4 + 1, value % 4 - 1)
        }
        if (strikingStrength > 40) {
            value -= (strikingStrength - 40) / 5;
        }
        if (strikingStrength > 59) {
            value++
        }
        value += 9
        return Dice.diceString(value / 8 + 1, value % 8 / 2 - 1)
    }
}

class Dice {
    static diceString(count: number, modifier: number = 0, sides: number = 6, multiplier: number = 1) {
        let string = "";
        count = Math.floor(Math.max(count, 0));
        sides = Math.max(sides, 0);
        modifier = Math.floor(modifier);
        if (count > 0 && sides > 0) {
            string += count;
            string += "d";
            string += sides;
        }
        if (modifier > 0) {
            string += "+";
            string += modifier;
        } else if (modifier < 0) {
            string += modifier;
        }
        if (multiplier !== 1) {
            string += "*"
            string += multiplier;
        }
        if (string.length === 0) {
            string += 0
        }
        return string
    }
}