"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attribute = void 0;
const feature_1 = require("./misc/feature");
class Attribute {
    constructor(sheet, costPerLevel, { defaultLevel = 0, basedOn = () => 0 }) {
        this.sheet = sheet;
        this.level = defaultLevel;
        this.costPerLevel = costPerLevel;
        this.defaultLevel = defaultLevel;
        this.basedOn = basedOn;
    }
    setLevel(level) { if (level)
        this.level = level; }
    setLevelDelta() { }
    getMod() { return 0; }
    pointsSpent() { return this.levelsIncreased() * this.costPerLevel; }
    levelsIncreased() { return this.level - this.defaultLevel; }
    calculateLevel() { return this.level + this.getMod() + this.basedOn(); }
    get displayLevel() { return this.calculateLevel(); }
    set displayLevel(level) {
        const mod = this.getMod();
        if (this.defaultLevel) {
            this.level = level - mod;
        }
        else if (!this.defaultLevel && this.basedOn) {
            this.level = level - this.basedOn() - mod;
        }
    }
    static bonusReducer(sheet, attribute) {
        return 0;
    }
}
exports.Attribute = Attribute;
class AttributeBonus extends feature_1.Feature {
    constructor(element) {
        super(element, feature_1.FeatureType.attributeBonus);
        this.element = element;
    }
    get attribute() { var _a, _b; return (_b = (_a = this.element.querySelector("attribute")) === null || _a === void 0 ? void 0 : _a.textContent) !== null && _b !== void 0 ? _b : ""; }
}
//# sourceMappingURL=attribute.js.map