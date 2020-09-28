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

export function formatRSL(skill: SkillLike<any>) {
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

export function fixed6(number: number) {
    return +number.toFixed(3) || 0
}