import { Skill, SkillLike } from "@character/skill/skill";

export function formatTrait() {

}

export function formatSkill(skill: Skill) {
    let name = "";
    name += skill.name;
    if (skill.hasTechLevel && skill.techLevel) name += `/${skill.techLevel}`;
    if (skill.specialization) name += ` (${skill.specialization})`;
    return name
}

export function formatRSL(skill: SkillLike) {
    if (skill.isContainer()) return ""
    let relativeLevel = skill.getRelativeLevel();
    let rsl = "";
    if (skill.signature) rsl += skill.signature;
    rsl += relativeLevel < 0 ? "" : "+";
    rsl += relativeLevel;
    return rsl
}

export function formatTechnique() {

}

export function formatSpell() {

}

export function formatEquipment() {

}

export function string(string, { beforeStart = "", afterEnd = "", fallback = "" } = {}) {
    let output;
    try {
        if (string === null) return fallback
        if (string === undefined) return fallback
        if (+string > Number.NEGATIVE_INFINITY) output = +string?.toFixed(3) ?? 0
        output = string;
    } catch (err) {
        output = fallback;
    }
    return beforeStart + output + afterEnd
}