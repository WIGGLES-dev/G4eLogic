import { Character, Sheet } from "@character/character";
import defaultConfig from "@character/config.json";

export class Configurer {
    static defaultConfig = defaultConfig

    sheet: Sheet
    config: any

    constructor(sheet: Sheet) {
        this.sheet = sheet;
        this.config = Configurer.defaultConfig;
    }

    registerFeature() { }
    registerAttribute() { }

    getConfig() { return this.config }
    reconfigure(config: any) {
        this.config.config = config
        this.sheet.Hooks.callAll("reconfigure", this.sheet);
    }
}