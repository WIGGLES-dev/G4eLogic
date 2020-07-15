import { Character } from ".././character/character";

const pathToTest = "./subjects/Mysterious_Warrior.json";

const testSubjectData = require(pathToTest);

const testSubject = new Character().loadJSON(testSubjectData);

console.log(
    testSubject.skillList.iter().map(
        skill => [
            skill.name, 
            skill.calculateLevel(),
            skill.getBonus()
        ]
    )
);

//console.log(testSubject.featureList.table);