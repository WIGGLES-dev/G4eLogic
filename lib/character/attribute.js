import { Feature } from "./misc/feature";
import { FeatureType } from "gcs";
import { objectify } from "utils/json_utils";
export class Attribute {
    constructor(name, character, costPerLevel, { defaultLevel = 0, basedOn = () => 0 }) {
        this.character = character;
        this.level = defaultLevel;
        this.costPerLevel = costPerLevel;
        this.defaultLevel = defaultLevel;
        this.basedOn = basedOn;
    }
    setLevel(level) { if (level)
        this.level = level; }
    setLevelDelta() { }
    getMod() { return Attribute.bonusReducer(this.character, this.name); }
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
        return sheet.featureList.getFeaturesByType(FeatureType.attributeBonus).reduce((prev, cur) => {
            var _a, _b, _c;
            if (cur instanceof AttributeBonus) {
                if (cur.ownerIsActive() && ((_b = (_a = cur.attribute) === null || _a === void 0 ? void 0 : _a.toString()) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === ((_c = attribute === null || attribute === void 0 ? void 0 : attribute.toString()) === null || _c === void 0 ? void 0 : _c.toLowerCase())) {
                    prev += cur.getBonus();
                }
            }
            return prev;
        }, 0);
    }
}
export class AttributeBonus extends Feature {
    constructor(owner) {
        super(owner, FeatureType.attributeBonus);
    }
    loadJSON(json) {
        const data = objectify(json);
        super.loadJSON(data);
        this.attribute = data.attribute;
        return this;
    }
}
//# sourceMappingURL=attribute.js.map