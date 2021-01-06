import View from '@components/View.svelte';
import Cell from '@components/Cell.svelte';
import Text from '@components/Form/Text.svelte';
import Number from '@components/Form/Number.svelte';
import Checkbox from '@components/Form/Checkbox.svelte';
import Select from "@components/Form/Select/Select.svelte";
import { Resource, Skill, Equipment, Trait, Character, log, Resolver } from "@internal";
import { from, Observable } from "rxjs";
import { map, mergeMap } from 'rxjs/operators';
import { State } from 'rxdeep';
function handleDeleteData(data: Resource | State<any[]>) {
    if (data instanceof Resource) {
        return function () {
            data.delete();
        }
    } else {
        return function () {
            data.value = undefined;
        }
    }
}
export const deleteResource = {
    label: 'Delete',
    callback: new Resolver(handleDeleteData),
    show() { return true }
}
export const editResource = {
    label: 'Edit',
    callback: new Resolver((src: Resource) => () => src.edit()),
    show() { return true }
}
export const makeContainer = {
    label: 'Make Container',
    callback: new Resolver((src: Resource) => () => src.index.sub('canContainChildren').value = true),
    show: new Resolver((src: Resource) => () => src.getMetadata().canContainChildren !== true),
}
export const undoMakeContainer = {
    label: 'Undo Make Container',
    callback: new Resolver((src: Resource) => () => src.eject()),
    show: new Resolver((src: Resource) => () => src.getMetadata().canContainChildren === true),
}
export const changeTraitCategory = {
    label: 'Change Category',
    options: [
        {
            label: {
                component: Select,
                multiple: true,
                options: new Resolver(() => from([[
                    'advantage',
                    'disadvantage',
                    'perk',
                    'quirk',
                    'meta',
                    'racial',
                    'feature'
                ]])),
                value: new Resolver((trait: Trait) => trait.sub('categories'))
            },
            interactive: true
        }
    ]
}
export const skill = {
    reference: {
        header: 'ref',
        component: Text,
        width: '3rem',
        value: new Resolver((skill: Skill) => skill.sub('reference')),
    },
    points: {
        header: 'pts',
        component: Number,
        width: '2.5rem',
        value: new Resolver((skill: Skill) => skill.sub('points'))
    },
    difficulty: {
        header: 'difficulty',
        component: Select,
        options: new Resolver((skill: Skill) => from([['E', 'A', 'H', 'VH', 'WC']])),
        value: new Resolver((skill: Skill) => skill.sub('difficulty'))
    },
    signature: {
        header: 'signature',
        component: Select,
        options: new Resolver((skill: Skill) => {
            return skill.selectNearest('character', Character)
                .pipe(
                    log('character'),
                    mergeMap(char => char.sub('config').sub('attributes')),
                    map(attributes => Object.entries(attributes || {})),
                    map(attributes => attributes.filter(([key, value]) => value.skillSignature)),
                    map(attributes => attributes.map(([value, attr]) => ({ value, label: attr.abbreviation || value })))
                )
        }),
        value: new Resolver((skill: Skill) => skill.sub('signature'))
    },
    mod: {
        component: Number,
        width: '2.5rem',
        value: new Resolver((skill: Skill) => skill.sub('mod'))
    },
    rsl: {
        component: Number,
        width: '3rem',
        value: new Resolver((skill: Skill) => skill.relativeLevel$.pipe(map(Math.floor))),
        disabled: true
    },
    level: {
        component: Number,
        width: '3rem',
        value: new Resolver((skill: Skill) => skill.level$.pipe(map(Math.floor))),
        disabled: true
    },
    name: {
        header: 'Skill',
        width: '100%',
        component: Text,
        value: new Resolver((skill: Skill) => skill.sub('name'))
    }
}

export const technique = {
    ...skill,
    name: {
        ...skill.name,
        header: 'Technique'
    },
    difficulty: {
        ...skill.difficulty,
        options: new Resolver(() => from([['A', 'H']])),
    }
};
export const spell = {
    ...skill,
    name: {
        ...skill.name,
        header: 'Spell'
    },
    resist: {
        component: Text,
        value: new Resolver((spell) => spell.sub('resistance')),
        width: '5rem'
    },
    spellClass: {
        header: 'class',
        component: Text,
        value: new Resolver((spell) => spell.sub('class')),
        width: '5rem'
    },
    castingCost: {
        header: 'cost',
        component: Text,
        value: new Resolver((spell) => spell.sub('castingCost'))
    },
    maintenanceCost: {
        header: 'maintenance',
        component: Text,
        value: new Resolver((spell) => spell.sub('maintenanceCost'))
    },
    castingTime: {
        header: 'time',
        component: Text,
        value: new Resolver((spell) => spell.sub('castingTime'))
    },
    duration: {
        header: 'duration',
        component: Text,
        value: new Resolver((spell) => spell.sub('duration'))
    }
}
export const trait = {
    name: {
        ...skill.name,
        header: 'Trait'
    },
    level: {
        header: 'lvl',
        component: Number,
        value: new Resolver((trait) => trait.sub('levels')),
        width: '3rem',
        disabled: true
    },
    points: {
        header: 'pts',
        component: Number,
        value: new Resolver((trait) => trait.sub('basePoints')),
        width: '3rem'
    },
    totalPoints: {
        header: 'Tpts',
        component: Number,
        width: '3rem',
        value: new Resolver((trait) => trait.selectAdjustedPoints()),
        disabled: true
    },
    reference: skill.reference
}
export function formatTraitModifierCost(traitModifier) {
    const {
        cost = 0,
        levels = 0,
        costType,
        affects
    } = traitModifier;
    const before = costType === 'multiplier' ? 'x' : cost > 0 ? '+' : '-';
    const after = costType === 'percentage' ? '%' : '';
    const note = affects && affects !== 'total' ? ` (${affects})` : ''
    return `${before}${cost}${after}${note}`
}
const traitModifier = {
    enabled: {
        component: Checkbox,
        value: new Resolver((state: State<any>) => state.sub('enabled'))
    },
    name: {
        component: Text,
        value: new Resolver((state: State<any>) => state.sub('name')),
        header: 'modifier'
    },
    costModifier: {
        component: Cell,
        value: new Resolver((state: State<any>) => state.pipe(map(formatTraitModifierCost))),
        header: 'cost'
    },
    reference: {
        component: Text,
        value: new Resolver((state: State<any>) => state.sub('reference')),
        header: 'ref'
    }
}
export const equipment = {
    equipped: {
        header: 'E',
        component: Checkbox,
        value: new Resolver((r: Resource) => r.index.sub('enabled'))
    },
    quantity: {
        header: '#',
        component: Number,
        value: new Resolver((equipment) => equipment.sub('quantity')),
        width: '3rem'
    },
    name: {
        ...skill.name,
        header: {
            component: View,
            right: "<span class='px-3'>Equipment</span>",
            main: {
                component: Select,
                options: new Resolver((char: Character) => from([[
                    { label: 'Carried', value: 'carried' },
                    { label: 'Other', value: 'other' }
                ]])),
                value: new Resolver((char: Character) => char.subFlag('ui', 'equipmentFilter')),
            }
        }
    },
    uses: {
        header: 'uses',
        component: Number,
        value: new Resolver((equipment) => equipment.sub('maxUses')),
        width: '3rem'
    },
    value: {
        component: Number,
        value: new Resolver((equipment) => equipment.sub('value')),
        width: '3rem'
    },
    weight: {
        component: Number,
        value: new Resolver((equipment) => equipment.sub('weight')),
        width: '3rem'
    },
    eValue: {
        header: 'EValue',
        component: Number,
        value: new Resolver((equipment: Equipment) => equipment.selectExtendedValue()),
        disabled: true,
        width: '3rem'
    },
    eWeight: {
        header: 'EWeight',
        component: Number,
        value: new Resolver((equipment: Equipment) => equipment.selectExtendedWeight()),
        disabled: true,
        width: '3rem'
    },
    reference: skill.reference,
}
const equipmentModifier = {

}
const weapon = {
    name: {
        component: Text,
        value: new Resolver((weapon) => weapon.sub('usage')),
        header: 'Name'
    },
    damage: {
        component: Text,
        value: new Resolver((weapon) => weapon.sub('damage')),
        header: 'damage',
        width: '5rem'
    },
    damageType: {
        component: Select,
        value: new Resolver((weapon) => weapon.sub('damageType')),
        options: new Resolver(() => from([[
            'imp',
            'cr',
            'cut',
            'fat',
            'tox'
        ]])),
        header: 'type',
    },
}
export const meleeWeapon = {
    ...weapon,
    parryBonus: {
        component: Number,
        value: new Resolver((weapon) => weapon.sub('parryBonus')),
        header: 'parry',
        width: '2.5rem'
    },
    blockBonus: {
        component: Number,
        value: new Resolver((weapon) => weapon.sub('blockBonus')),
        header: 'block',
        width: '2.5rem'
    },
    strength: {
        component: Text,
        value: new Resolver((weapon) => weapon.sub('strengthRequirement')),
        header: 'st',
        width: '2.5rem'
    },
    reach: {
        component: Text,
        value: new Resolver((weapon) => weapon.sub('reach')),
        header: 'reach',
        width: '3rem'
    },
    attackBonus: {
        component: Number,
        value: new Resolver((weapon) => weapon.sub('attackBonus')),
        header: 'mod',
        width: '2.5rem',
    }
};
export const rangedWeapon = {
    ...weapon,
    range: {
        component: Text,
        value: new Resolver((weapon) => weapon.sub('range')),
        header: 'range',
        width: '3rem'
    },
    accuracy: {
        component: Text,
        value: new Resolver((weapon) => weapon.sub('accuracy')),
        header: 'acc',
        width: '3rem'
    },
    rateOfFire: {
        component: Text,
        value: new Resolver((weapon) => weapon.sub('rateOfFire')),
        header: 'rof',
        width: '3rem'
    },
    shots: {
        component: Text,
        value: new Resolver((weapon) => weapon.sub('shots')),
        width: '3rem'
    },
    recoil: {
        component: Number,
        value: new Resolver((weapon) => weapon.sub('recoil')),
        header: 'rcl',
        width: '3rem'
    },
    bulk: {
        component: Number,
        value: new Resolver((weapon) => weapon.sub('bulk')),
        width: '2rem'
    },
};