"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Profile = void 0;
const json_utils_1 = require("../utils/json_utils");
class Profile {
    constructor() {
        this.tag = "profile";
        this.sizeModifier = "";
        this.techLevel = "";
        this.birthday = "";
        this.name = "";
        this.eyes = "";
        this.skin = "";
        this.hair = "";
        this.handedness = "";
        this.weight = "";
        this.height = "";
        this.gender = "";
        this.race = "";
        this.bodyType = "";
        this.age = "";
        this.portrait = "";
    }
    toJSON() {
    }
    loadJSON(object) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        object = json_utils_1.objectify(object);
        this.sizeModifier = (_a = object === null || object === void 0 ? void 0 : object.size_modifier) !== null && _a !== void 0 ? _a : "";
        this.techLevel = (_b = object === null || object === void 0 ? void 0 : object.tech_level) !== null && _b !== void 0 ? _b : "";
        this.birthday = (_c = object === null || object === void 0 ? void 0 : object.birthday) !== null && _c !== void 0 ? _c : "";
        this.name = (_d = object === null || object === void 0 ? void 0 : object.name) !== null && _d !== void 0 ? _d : "";
        this.eyes = (_e = object === null || object === void 0 ? void 0 : object.eyes) !== null && _e !== void 0 ? _e : "";
        this.skin = (_f = object === null || object === void 0 ? void 0 : object.skin) !== null && _f !== void 0 ? _f : "";
        this.hair = (_g = object === null || object === void 0 ? void 0 : object.hair) !== null && _g !== void 0 ? _g : "";
        this.handedness = (_h = object === null || object === void 0 ? void 0 : object.handedness) !== null && _h !== void 0 ? _h : "";
        this.weight = (_j = object === null || object === void 0 ? void 0 : object.weight) !== null && _j !== void 0 ? _j : "";
        this.height = (_k = object === null || object === void 0 ? void 0 : object.height) !== null && _k !== void 0 ? _k : "";
        this.gender = (_l = object === null || object === void 0 ? void 0 : object.gender) !== null && _l !== void 0 ? _l : "";
        this.race = (_m = object === null || object === void 0 ? void 0 : object.race) !== null && _m !== void 0 ? _m : "";
        this.bodyType = (_o = object === null || object === void 0 ? void 0 : object.bodyType) !== null && _o !== void 0 ? _o : "";
        this.age = (_p = object === null || object === void 0 ? void 0 : object.age) !== null && _p !== void 0 ? _p : "";
        this.portrait = (_q = object === null || object === void 0 ? void 0 : object.portait) !== null && _q !== void 0 ? _q : "";
    }
}
exports.Profile = Profile;
//# sourceMappingURL=profile.js.map