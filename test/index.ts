import { Character } from "../src/character/character";

const testSubjectData = require("./subjects/Mysterious_Warrior.json");

const testSubject = new Character().loadJSON(testSubjectData);

console.log(
    testSubject.skillList.iter().map(
        skill => [
            skill.name,
            skill.calculateLevel(),
            skill.getBonus(),
            testSubject.attributes(skill.signature)
        ]
    )
);

console.log(testSubject);