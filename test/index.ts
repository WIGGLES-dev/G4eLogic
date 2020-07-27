import { Character } from "../src/character/character";

const testSubjectData = require("./subjects/Mysterious_Warrior.json");

const testSubject: Character = new Character().load(testSubjectData);

console.log(testSubject);

console.log(
    testSubject.traitList.iter().map(trait => [trait.name, trait.adjustedPoints(), trait.modifiers.size])
);