import { System, SystemInit } from "@internal";
import "@ui/styles.css";
const SystemWorker = "SharedWorker" in window ?
    new SharedWorker("./worker.ts", { type: "module", name: "gurps" }) :
    new Worker("./worker.ts", { type: "module", name: "gurps" });
const system: SystemInit = {
    workers: [
        [SystemWorker, "gurps"]
    ],
    schemas: [
        ["schemas/gurps/character.yaml", "character"],
        ["schemas/gurps/skill.yaml", "skill"],
        ["schemas/gurps/technique.yaml", "technique"],
        ["schemas/gurps/spell.yaml", "spell"],
        ["schemas/gurps/trait.yaml", "trait"],
        ["schemas/gurps/equipment.yaml", "equipment"],
        ["schemas/gurps/meleeWeapon.yaml", "melee weapon"],
        ["schemas/gurps/rangedWeapon.yaml", "ranged weapon"]
    ]
}
System.init(system);