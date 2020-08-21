export class Damage {

    static getThrust(strength: number) {

    }

    static getSwing(strength: number) {

    }
}

export function getThrust(strength: number) {
    let value = strength;
    if (strength < 19) {
        return diceString(1, -(6 - (value - 1) / 2))
    }
    value -= 11;
    if (strength > 50) {
        value--;
        if (strength > 79) {
            value -= 1 + (strength - 80) / 5;
        }
    }
    return diceString(value / 8 + 1, value % 8 / 2 - 1)
}

export function getSwing(strength: number) {
    let value = strength;
    if (value < 10) {
        return diceString(1, -(5 - (value - 1) / 2))
    }
    if (value < 28) {
        value -= 9;
        return diceString(value / 4 + 1, value % 4 - 1)
    }
    if (strength > 40) {
        value -= (strength - 40) / 5;
    }
    if (strength > 59) {
        value++
    }
    value += 9
    return diceString(value / 8 + 1, value % 8 / 2 - 1)
}

function diceString(count: number, modifier: number = 0, sides: number = 6, multiplier: number = 1) {
    let string = "";
    count = Math.floor(Math.max(count, 0));
    sides = Math.max(sides, 0);
    modifier = Math.ceil(modifier);
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