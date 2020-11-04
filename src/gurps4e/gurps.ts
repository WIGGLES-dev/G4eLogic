export function basicLift(liftingStrength: number) {
    return Math.round(Math.pow(liftingStrength, 2) / 5)
}

export function encumbranceLevel(basicLift: number, carriedWeight: number) {
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

export function encumberedDodgeTarget(encumbranceLevel: number, dodgeTarget: number) {
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

function diceString(count: number, modifier: number = 0, sides: number = 6, multiplier: number = 1) {
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

export function getThrustDamage(strikingStrength: number) {
    let value = strikingStrength;
    if (strikingStrength < 19) {
        return diceString(1, -(6 - (value - 1) / 2))
    }
    value -= 11;
    if (strikingStrength > 50) {
        value--;
        if (strikingStrength > 79) {
            value -= 1 + (strikingStrength - 80) / 5;
        }
    }
    return diceString(value / 8 + 1, value % 8 / 2 - 1)
}

export function getSwingDamage(strikingStrength: number) {
    let value = strikingStrength;
    if (value < 10) {
        return diceString(1, -(5 - (value - 1) / 2))
    }
    if (value < 28) {
        value -= 9;
        return diceString(value / 4 + 1, value % 4 - 1)
    }
    if (strikingStrength > 40) {
        value -= (strikingStrength - 40) / 5;
    }
    if (strikingStrength > 59) {
        value++
    }
    value += 9
    return diceString(value / 8 + 1, value % 8 / 2 - 1)
}

/**
 * Reducing Algorithm to remove duplicates from derived lists. Any item that appears
 * in the list later on, based on the order of the keys. Things earlier in the lists will
 * be overridden by things later in the list. Be sure to account for that when using this function.
 * @param lists A series of lists to remove the duplicates from
 */
// export function removeDuplicates(lists: { [key: string]: ListItem[] }) {
//     const checked = new Set();
//     return Object.entries(lists).reduce((prev, [key, list]) => {
//         checked.add(key);
//         const checkAgainst = Object.entries(lists).filter(([key1, list]) => {
//             key !== key1 && !checked.has(key1)
//         }).map(values => values[1]).map(list => list).flat();
//         let newCollection = list.filter(item => !checkAgainst.includes(item));
//         lists[key] = newCollection;
//         return prev
//     }, lists)
// }

// function resolveWeights(list: List, target?: ListItem, newWeight?: number) {
//     if (!list) return
//     if (!list.contents.has(target)) return list
//     let arr = list.iter();
//     if (target && newWeight > -1) {
//         arr.splice(newWeight, 0, arr.splice(target.listWeight, 1)[0]);
//     }
//     arr.forEach((item, i) => item.listWeight = i);
// }