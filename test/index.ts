import { Character } from "../src/character/character";
import { registerSerializer } from "../src/character/serialization/serializer";
import { GCSJSON } from "../src/character/serialization/gcs_json";

registerSerializer(GCSJSON);

const testSubjectData = require("./subjects/Jack_Fanning.json");

const testSubject: Character = new Character("GCSJSON").load(testSubjectData);

console.log(testSubject);

testSubject.skillList.iter().forEach(skill => {
    try {
        let bestDefault = skill.getBestDefaultWithPoints();
        console.log(skill.calculateLevel(), skill.name, skill.specialization, skill.defaultedFrom, skill.getModList());
    } catch (err) {
        console.log(err);
        console.log(skill.name, skill.specialization, skill, skill.getBestDefault());
    }
})

// testSubject.techniqueList.iter().forEach(skill => {
//     try {
//         console.log(
//             skill.calculateLevel(),
//             skill.name,
//             skill.getBestDefault()?.getHighestMatchLevel(),
//             skill.getBestDefault()?.name,
//             skill.getBestDefault()?.specialization,
//             skill.getBestDefault()?.getMatches()
//         );
//     } catch (err) {
//         console.log(err);
//         console.log(skill)
//     }
// })