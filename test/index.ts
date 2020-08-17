import { Character } from "../src/character/character";

const testSubjectData = require("./subjects/Mysterious_Warrior.json");

const testSubject: Character = new Character("GCSJSON").load(testSubjectData, "GCSJSON");

// testSubject.skillList.iter().forEach(skill => {
//     let unsubscribe = skill.subscribe((value) => {
//         console.log(value);
//     });
// });

console.log(testSubject);

// testSubject.skillList.iter().forEach(skill => {
//     skill.name = "test";
// });