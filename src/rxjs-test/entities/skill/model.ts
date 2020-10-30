export enum SkillDifficulty {
    Easy = "E",
    Average = "A",
    Hard = "H",
    VeryHard = "VH",
    Wildcard = "W"
}
export interface SkillData {
    id: string
    sheetId?: string
    ownedById?: string
    points: number
    name: string
    specialization?: string
    techLevel?: string
    difficulty: SkillDifficulty
    signature: "10"
    mod: 0
    encumbrancePenaltyMultiple: 0
    defaults: SkillDefault[]
}

export interface SkillDefault {
    type: "Skill" | "Attribtue",
    criteria: {
        name: string,
        specialization?: string
    }
    modifier: number
}

function calculateBaseRelativeLevel(difficulty: SkillDifficulty) {
    switch (difficulty) {
        case SkillDifficulty.Easy:
            return 0
        case SkillDifficulty.Average:
            return -1
        case SkillDifficulty.Hard:
            return -2
        case SkillDifficulty.VeryHard:
            return -3
        case SkillDifficulty.Wildcard:
            return -3
    }
}

export function calculateRelativeSkillLevel(points: number, difficulty: SkillDifficulty) {
    let relativeLevel = calculateBaseRelativeLevel(difficulty);
    if (points === 1) {

    } else if (points < 4) {
        relativeLevel++;
    } else {
        relativeLevel += 1 + points / 4;
    }
    return relativeLevel
}

export function skillMatchesAnyDefaults(skill: SkillData, defaults: SkillDefault[]) {
    return defaults.filter(skillDefault => skillDefault.type === "Skill").some(skillDefault =>
        skillDefault.criteria.name === skill.name
            && skillDefault.criteria.specialization ? skillDefault.criteria.specialization === skill.specialization : true
    )
}

export function calculateSkillLevel(
    skill: SkillData,
    baseLevel: number = 10,
    encumbranceLevel: number = 0,
    bonus: number = 0,
) {
    let points = skill.points;
    if (skill.difficulty === SkillDifficulty.Wildcard) points = points / 3;
    let relativeLevel = calculateRelativeSkillLevel(points, skill.difficulty);
    const encumbrancePenalty = encumbranceLevel * skill.encumbrancePenaltyMultiple;
    const preliminaryLevel = baseLevel + relativeLevel + encumbrancePenalty;

    return preliminaryLevel + skill.mod + bonus
}

