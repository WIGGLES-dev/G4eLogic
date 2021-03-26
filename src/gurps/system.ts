import { System } from "@internal";
import "@ui/styles.css";
System.expose();
System.addWorker("character", "workers/character-worker.js");
System.addWorker("skill", "workers/skill-worker.js");
System.addWorker("trait", "workers/trait-worker.js");
System.addWorker("equipment", "workers/equipment-worker.js");
async function setup() {
    await System.addSchema('schemas/gurps/skill.yaml', 'skill');
    await System.addSchema('schemas/gurps/spell.yaml', 'spell');
    await System.addSchema('schemas/gurps/trait.yaml', 'trait');
    await System.addSchema('schemas/gurps/technique.yaml', 'technique');
    await System.addSchema('schemas/gurps/equipment.yaml', 'equipment');
    await System.addSchema('schemas/gurps/meleeWeapon.yaml', 'melee weapon');
    await System.addSchema('schemas/gurps/rangedWeapon.yaml', 'ranged weapon');
    await System.addSchema('schemas/gurps/character.yaml', 'character');
}
setup();
window.onload = System.init