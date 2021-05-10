import { AbstractSystem, SystemInit } from "@internal";
import "@ui/styles.css";

class GURPSSystem extends AbstractSystem {
  constructor() {
    super();
  }
}

const url = "./gurps-worker.js";
const SystemWorker =
  "SharedWorker" in window
    ? new SharedWorker(url, { name: "gurps" })
    : new Worker(url, { name: "gurps" });
const init: SystemInit = {
  workers: [[SystemWorker, "gurps"]],
  schemas: [
    ["schemas/gurps/character.yaml", "character"],
    ["schemas/gurps/skill.yaml", "skill"],
    ["schemas/gurps/technique.yaml", "technique"],
    ["schemas/gurps/spell.yaml", "spell"],
    ["schemas/gurps/trait.yaml", "trait"],
    ["schemas/gurps/equipment.yaml", "equipment"],
    ["schemas/gurps/meleeWeapon.yaml", "melee weapon"],
    ["schemas/gurps/rangedWeapon.yaml", "ranged weapon"],
  ],
};

const system = new GURPSSystem();
system.init(init);
