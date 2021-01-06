webpackHotUpdate("gurps",{

/***/ "./src/ui/fieldConfig.ts":
/*!*******************************!*\
  !*** ./src/ui/fieldConfig.ts ***!
  \*******************************/
/*! exports provided: deleteResource, editResource, makeContainer, undoMakeContainer, changeTraitCategory, skill, technique, spell, trait, formatTraitModifierCost, equipment, meleeWeapon, rangedWeapon */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deleteResource", function() { return deleteResource; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "editResource", function() { return editResource; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeContainer", function() { return makeContainer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "undoMakeContainer", function() { return undoMakeContainer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "changeTraitCategory", function() { return changeTraitCategory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "skill", function() { return skill; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "technique", function() { return technique; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "spell", function() { return spell; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "trait", function() { return trait; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "formatTraitModifierCost", function() { return formatTraitModifierCost; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "equipment", function() { return equipment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "meleeWeapon", function() { return meleeWeapon; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rangedWeapon", function() { return rangedWeapon; });
/* harmony import */ var _components_View_svelte__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @components/View.svelte */ "./src/components/View.svelte");
/* harmony import */ var _components_Cell_svelte__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @components/Cell.svelte */ "./src/components/Cell.svelte");
/* harmony import */ var _components_Form_Text_svelte__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @components/Form/Text.svelte */ "./src/components/Form/Text.svelte");
/* harmony import */ var _components_Form_Number_svelte__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @components/Form/Number.svelte */ "./src/components/Form/Number.svelte");
/* harmony import */ var _components_Form_Checkbox_svelte__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @components/Form/Checkbox.svelte */ "./src/components/Form/Checkbox.svelte");
/* harmony import */ var _components_Form_Select_Select_svelte__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @components/Form/Select/Select.svelte */ "./src/components/Form/Select/Select.svelte");
/* harmony import */ var _internal__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @internal */ "./src/internal.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");









function handleDeleteData(data) {
    if (data instanceof _internal__WEBPACK_IMPORTED_MODULE_6__["Resource"]) {
        return function () {
            data.delete();
        };
    }
    else {
        return function () {
            data.value = undefined;
        };
    }
}
const deleteResource = {
    label: 'Delete',
    callback: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"](handleDeleteData),
    show() { return true; }
};
const editResource = {
    label: 'Edit',
    callback: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((src) => () => src.edit()),
    show() { return true; }
};
const makeContainer = {
    label: 'Make Container',
    callback: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((src) => () => src.index.sub('canContainChildren').value = true),
    show: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((src) => () => src.getMetadata().canContainChildren !== true),
};
const undoMakeContainer = {
    label: 'Undo Make Container',
    callback: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((src) => () => src.eject()),
    show: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((src) => () => src.getMetadata().canContainChildren === true),
};
const changeTraitCategory = {
    label: 'Change Category',
    options: [
        {
            label: {
                component: _components_Form_Select_Select_svelte__WEBPACK_IMPORTED_MODULE_5__["default"],
                multiple: true,
                options: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"](() => Object(rxjs__WEBPACK_IMPORTED_MODULE_7__["from"])([[
                        'advantage',
                        'disadvantage',
                        'perk',
                        'quirk',
                        'meta',
                        'racial',
                        'feature'
                    ]])),
                value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((trait) => trait.sub('categories'))
            },
            interactive: true
        }
    ]
};
const skill = {
    reference: {
        header: 'ref',
        component: _components_Form_Text_svelte__WEBPACK_IMPORTED_MODULE_2__["default"],
        width: '3rem',
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((skill) => skill.sub('reference')),
    },
    points: {
        header: 'pts',
        component: _components_Form_Number_svelte__WEBPACK_IMPORTED_MODULE_3__["default"],
        width: '2.5rem',
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((skill) => skill.sub('points'))
    },
    difficulty: {
        header: 'difficulty',
        component: _components_Form_Select_Select_svelte__WEBPACK_IMPORTED_MODULE_5__["default"],
        options: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((skill) => Object(rxjs__WEBPACK_IMPORTED_MODULE_7__["from"])([['E', 'A', 'H', 'VH', 'WC']])),
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((skill) => skill.sub('difficulty'))
    },
    signature: {
        header: 'signature',
        component: _components_Form_Select_Select_svelte__WEBPACK_IMPORTED_MODULE_5__["default"],
        options: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((skill) => {
            return skill.selectNearest('character', _internal__WEBPACK_IMPORTED_MODULE_6__["Character"])
                .pipe(Object(_internal__WEBPACK_IMPORTED_MODULE_6__["log"])('character'), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_8__["mergeMap"])(char => char.sub('config').sub('attributes')), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_8__["map"])(attributes => Object.entries(attributes || {})), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_8__["map"])(attributes => attributes.filter(([key, value]) => value.skillSignature)), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_8__["map"])(attributes => attributes.map(([value, attr]) => ({ value, label: attr.abbreviation || value }))));
        }),
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((skill) => skill.sub('signature'))
    },
    mod: {
        component: _components_Form_Number_svelte__WEBPACK_IMPORTED_MODULE_3__["default"],
        width: '2.5rem',
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((skill) => skill.sub('mod'))
    },
    rsl: {
        component: _components_Form_Number_svelte__WEBPACK_IMPORTED_MODULE_3__["default"],
        width: '3rem',
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((skill) => skill.relativeLevel$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_8__["map"])(Math.floor))),
        disabled: true
    },
    level: {
        component: _components_Form_Number_svelte__WEBPACK_IMPORTED_MODULE_3__["default"],
        width: '3rem',
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((skill) => skill.level$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_8__["map"])(Math.floor))),
        disabled: true
    },
    name: {
        header: 'Skill',
        width: '100%',
        component: _components_Form_Text_svelte__WEBPACK_IMPORTED_MODULE_2__["default"],
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((skill) => skill.sub('name'))
    }
};
const technique = Object.assign(Object.assign({}, skill), { name: Object.assign(Object.assign({}, skill.name), { header: 'Technique' }), difficulty: Object.assign(Object.assign({}, skill.difficulty), { options: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"](() => Object(rxjs__WEBPACK_IMPORTED_MODULE_7__["from"])([['A', 'H']])) }) });
const spell = Object.assign(Object.assign({}, skill), { name: Object.assign(Object.assign({}, skill.name), { header: 'Spell' }), resist: {
        component: _components_Form_Text_svelte__WEBPACK_IMPORTED_MODULE_2__["default"],
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((spell) => spell.sub('resistance')),
        width: '5rem'
    }, spellClass: {
        header: 'class',
        component: _components_Form_Text_svelte__WEBPACK_IMPORTED_MODULE_2__["default"],
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((spell) => spell.sub('class')),
        width: '5rem'
    }, castingCost: {
        header: 'cost',
        component: _components_Form_Text_svelte__WEBPACK_IMPORTED_MODULE_2__["default"],
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((spell) => spell.sub('castingCost'))
    }, maintenanceCost: {
        header: 'maintenance',
        component: _components_Form_Text_svelte__WEBPACK_IMPORTED_MODULE_2__["default"],
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((spell) => spell.sub('maintenanceCost'))
    }, castingTime: {
        header: 'time',
        component: _components_Form_Text_svelte__WEBPACK_IMPORTED_MODULE_2__["default"],
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((spell) => spell.sub('castingTime'))
    }, duration: {
        header: 'duration',
        component: _components_Form_Text_svelte__WEBPACK_IMPORTED_MODULE_2__["default"],
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((spell) => spell.sub('duration'))
    } });
const trait = {
    name: Object.assign(Object.assign({}, skill.name), { header: 'Trait' }),
    level: {
        header: 'lvl',
        component: _components_Form_Number_svelte__WEBPACK_IMPORTED_MODULE_3__["default"],
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((trait) => trait.sub('levels')),
        width: '3rem',
        disabled: true
    },
    points: {
        header: 'pts',
        component: _components_Form_Number_svelte__WEBPACK_IMPORTED_MODULE_3__["default"],
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((trait) => trait.sub('basePoints')),
        width: '3rem'
    },
    totalPoints: {
        header: 'Tpts',
        component: _components_Form_Number_svelte__WEBPACK_IMPORTED_MODULE_3__["default"],
        width: '3rem',
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((trait) => trait.selectAdjustedPoints()),
        disabled: true
    },
    reference: skill.reference
};
function formatTraitModifierCost(traitModifier) {
    const { cost = 0, levels = 0, costType, affects } = traitModifier;
    const before = costType === 'multiplier' ? 'x' : cost > 0 ? '+' : '-';
    const after = costType === 'percentage' ? '%' : '';
    const note = affects && affects !== 'total' ? ` (${affects})` : '';
    return `${before}${cost}${after}${note}`;
}
const traitModifier = {
    enabled: {
        component: _components_Form_Checkbox_svelte__WEBPACK_IMPORTED_MODULE_4__["default"],
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((state) => state.sub('enabled'))
    },
    name: {
        component: _components_Form_Text_svelte__WEBPACK_IMPORTED_MODULE_2__["default"],
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((state) => state.sub('name')),
        header: 'modifier'
    },
    costModifier: {
        component: _components_Cell_svelte__WEBPACK_IMPORTED_MODULE_1__["default"],
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((state) => state.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_8__["map"])(formatTraitModifierCost))),
        header: 'cost'
    },
    reference: {
        component: _components_Form_Text_svelte__WEBPACK_IMPORTED_MODULE_2__["default"],
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((state) => state.sub('reference')),
        header: 'ref'
    }
};
const equipment = {
    equipped: {
        header: 'E',
        component: _components_Form_Checkbox_svelte__WEBPACK_IMPORTED_MODULE_4__["default"],
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((r) => r.index.sub('enabled'))
    },
    quantity: {
        header: '#',
        component: _components_Form_Number_svelte__WEBPACK_IMPORTED_MODULE_3__["default"],
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((equipment) => equipment.sub('quantity')),
        width: '3rem'
    },
    name: Object.assign(Object.assign({}, skill.name), { header: {
            component: _components_View_svelte__WEBPACK_IMPORTED_MODULE_0__["default"],
            right: "<span class='px-3'>Equipment</span>",
            main: {
                component: _components_Form_Select_Select_svelte__WEBPACK_IMPORTED_MODULE_5__["default"],
                options: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((char) => Object(rxjs__WEBPACK_IMPORTED_MODULE_7__["from"])([[
                        { label: 'Carried', value: 'carried' },
                        { label: 'Other', value: 'other' }
                    ]])),
                value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((char) => char.subFlag('ui', 'equipmentFilter')),
            }
        } }),
    uses: {
        header: 'uses',
        component: _components_Form_Number_svelte__WEBPACK_IMPORTED_MODULE_3__["default"],
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((equipment) => equipment.sub('maxUses')),
        width: '3rem'
    },
    value: {
        component: _components_Form_Number_svelte__WEBPACK_IMPORTED_MODULE_3__["default"],
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((equipment) => equipment.sub('value')),
        width: '3rem'
    },
    weight: {
        component: _components_Form_Number_svelte__WEBPACK_IMPORTED_MODULE_3__["default"],
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((equipment) => equipment.sub('weight')),
        width: '3rem'
    },
    eValue: {
        header: 'EValue',
        component: _components_Form_Number_svelte__WEBPACK_IMPORTED_MODULE_3__["default"],
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((equipment) => equipment.selectExtendedValue()),
        disabled: true,
        width: '3rem'
    },
    eWeight: {
        header: 'EWeight',
        component: _components_Form_Number_svelte__WEBPACK_IMPORTED_MODULE_3__["default"],
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((equipment) => equipment.selectExtendedWeight()),
        disabled: true,
        width: '3rem'
    },
    reference: skill.reference,
};
const equipmentModifier = {};
const weapon = {
    name: {
        component: _components_Form_Text_svelte__WEBPACK_IMPORTED_MODULE_2__["default"],
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((weapon) => weapon.sub('usage')),
        header: 'Name'
    },
    damage: {
        component: _components_Form_Text_svelte__WEBPACK_IMPORTED_MODULE_2__["default"],
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((weapon) => weapon.sub('damage')),
        header: 'damage',
        width: '5rem'
    },
    damageType: {
        component: _components_Form_Select_Select_svelte__WEBPACK_IMPORTED_MODULE_5__["default"],
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((weapon) => weapon.sub('damageType')),
        options: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"](() => Object(rxjs__WEBPACK_IMPORTED_MODULE_7__["from"])([[
                'imp',
                'cr',
                'cut',
                'fat',
                'tox'
            ]])),
        header: 'type',
    },
};
const meleeWeapon = Object.assign(Object.assign({}, weapon), { parryBonus: {
        component: _components_Form_Number_svelte__WEBPACK_IMPORTED_MODULE_3__["default"],
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((weapon) => weapon.sub('parryBonus')),
        header: 'parry',
        width: '2.5rem'
    }, blockBonus: {
        component: _components_Form_Number_svelte__WEBPACK_IMPORTED_MODULE_3__["default"],
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((weapon) => weapon.sub('blockBonus')),
        header: 'block',
        width: '2.5rem'
    }, strength: {
        component: _components_Form_Text_svelte__WEBPACK_IMPORTED_MODULE_2__["default"],
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((weapon) => weapon.sub('strengthRequirement')),
        header: 'st',
        width: '2.5rem'
    }, reach: {
        component: _components_Form_Text_svelte__WEBPACK_IMPORTED_MODULE_2__["default"],
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((weapon) => weapon.sub('reach')),
        header: 'reach',
        width: '3rem'
    }, attackBonus: {
        component: _components_Form_Number_svelte__WEBPACK_IMPORTED_MODULE_3__["default"],
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((weapon) => weapon.sub('attackBonus')),
        header: 'mod',
        width: '2.5rem',
    } });
const rangedWeapon = Object.assign(Object.assign({}, weapon), { range: {
        component: _components_Form_Text_svelte__WEBPACK_IMPORTED_MODULE_2__["default"],
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((weapon) => weapon.sub('range')),
        header: 'range',
        width: '3rem'
    }, accuracy: {
        component: _components_Form_Text_svelte__WEBPACK_IMPORTED_MODULE_2__["default"],
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((weapon) => weapon.sub('accuracy')),
        header: 'acc',
        width: '3rem'
    }, rateOfFire: {
        component: _components_Form_Text_svelte__WEBPACK_IMPORTED_MODULE_2__["default"],
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((weapon) => weapon.sub('rateOfFire')),
        header: 'rof',
        width: '3rem'
    }, shots: {
        component: _components_Form_Text_svelte__WEBPACK_IMPORTED_MODULE_2__["default"],
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((weapon) => weapon.sub('shots')),
        width: '3rem'
    }, recoil: {
        component: _components_Form_Number_svelte__WEBPACK_IMPORTED_MODULE_3__["default"],
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((weapon) => weapon.sub('recoil')),
        header: 'rcl',
        width: '3rem'
    }, bulk: {
        component: _components_Form_Number_svelte__WEBPACK_IMPORTED_MODULE_3__["default"],
        value: new _internal__WEBPACK_IMPORTED_MODULE_6__["Resolver"]((weapon) => weapon.sub('bulk')),
        width: '2rem'
    } });


/***/ })

})
//# sourceMappingURL=gurps.d81ee0dbf8af6ddae092.hot-update.js.map