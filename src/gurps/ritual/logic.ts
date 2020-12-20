enum RitualEffect {
    Strengthen = 3,
    Restore = 3,
    Control = 5,
    Destroy = 5,
    Create = 6,
    Trasnfrom = 8
}

enum RitualEffectLevel {
    Greater = 1,
    Lesser = 0
}

enum RitualModifiers {
    Afflictions,
    AlteredTraits,
    AreaOfEffect,
    BestowsModifier,
    DamageDirect,
    DamageIndirect,
    Duration,
    ExtraEnergy,
    Healing,
    MetaMagic,
    Range,
    Speed,
    SubjectWeight
}

interface SpellEffect {
    effectName: string,
    effectModifier: number,
    effectLevel: 0 | 1
}

interface SpellModifier {

}

export function calculateEnergyCost(
    effects: SpellEffect[],
    modifiers: SpellModifier[]
) {
    let effectMultiplier = effects.reduce((prev, cur) => cur.effectLevel + prev, 0) * 2 + 1;
    let effectCost = effects.reduce((prev, cur) => cur.effectModifier + prev, 0);

}

function ritualDamageEffect() {}
