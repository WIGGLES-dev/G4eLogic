import { registerDataType } from "./serializer";
import { Serializer } from "v8";

@registerDataType(GCSJSON)
class GCSJSON extends Serializer {
    constructor() {
        super();
    }

    mapSkill() {
    }
    mapTechnique(object: any) {

    }
    mapSpell(object: any) {

    }
    mapItem(object: any) {

    }
    mapTrait(object: any) {

    }
}