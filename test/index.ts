import { Character } from "../src/character/character";

const testSubjectData = require("./subjects/Mysterious_Warrior.json");

const testSubject: Character = new Character().load(testSubjectData);

console.log(testSubject);

console.log(
    testSubject.skillList.iter().map(skill => skill.calculateLevel())
);