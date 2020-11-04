import { Query, Store, StoreConfig } from "@datorama/akita";
import { Config } from "./keys";
import config from "../gurps4e/config.json";
import produce from "immer";
export interface ValorConfig {
    globalConfig: Config
    currentlyEditing: string[]
}
const defaultValorConfig = (): ValorConfig => ({
    globalConfig: config,
    currentlyEditing: []
})
@StoreConfig({ name: 'valor', producerFn: produce })
export class ValorStore extends Store {
    constructor() {
        super(defaultValorConfig());
    }
}
export class ValorQuery extends Query<ValorConfig> {
    constructor(store: ValorStore) {
        super(store);
    }
}
export const ValorGlobal = new ValorStore();
class ValorEditor {
    get query() { return new ValorQuery(ValorGlobal) }
    get data$() { return this.query.select() }
}
export const Valor = new ValorEditor()