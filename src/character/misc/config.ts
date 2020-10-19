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

    getStaticFields() { }

    registerFeature() { }
    registerPlugin() { }
    registerAttribute() { }
    registerLocation() { }

    getConfig() { return this.config }
    setDefault() { return this.reconfigure(Configurer.defaultConfig) }
    reconfigure(config: any) {
        this.config = config
        this.sheet.Hooks.callAll("reconfigure", this.sheet);
        this.sheet.dispatch();
        return this.config
    }

    validate() {
        try {

        } catch (err) {

        }
    }

    stringify() { return JSON.stringify(this.config) }
}