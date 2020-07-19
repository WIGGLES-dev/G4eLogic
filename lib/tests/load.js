import { Character } from "../character/character";
const pathToTest = "./subjects/Mysterious_Warrior.json";
fetch(pathToTest).then(response => response.json().then(json => {
    const testSubject = new Character().loadJSON(json);
    console.log(testSubject.skillList.iter().map(skill => [
        skill.name,
        skill.calculateLevel(),
        skill.getBonus(),
        testSubject.attributes(skill.signature)
    ]));
    console.log(testSubject);
}));
//# sourceMappingURL=load.js.map