import { Character } from "../src/character/character";

const testSubjectData = require("./subjects/Mysterious_Warrior.json");

const testSubject = new Character().load(testSubjectData);

console.log(testSubject);