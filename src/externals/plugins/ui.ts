import { Character, Sheet } from "@character/character";
import { Plugin } from "@externals/plugin";

class G4eUiPlugin extends Plugin<Character> {
    scope: string = "UI"

    constructor() {
        super();
    }

    init(character: Sheet<Character>) {

        return this
    }
}