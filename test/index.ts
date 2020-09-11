import { Character } from "../src/character/character";
import { registerSerializer } from "../src/character/serialization/serializer";
import { GCSJSON } from "../src/character/serialization/gcs_json";
const config = require("../src/character/config.json");

registerSerializer(GCSJSON);

const testSubjectData = require("./subjects/Carson.json");

const testSubject: Character = new Character(config).load(testSubjectData, "GCSJSON");

console.log(testSubject);