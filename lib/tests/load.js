"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const character_1 = require(".././character/character");
const pathToTest = "./subjects/Mysterious_Warrior.json";
const testSubjectData = require(pathToTest);
const testSubject = new character_1.Character().loadJSON(testSubjectData);
console.log(testSubject.skillList.iter().map(skill => [
    skill.name,
    skill.calculateLevel(),
    skill.getBonus()
]));
//# sourceMappingURL=load.js.map