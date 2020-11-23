import "@ui/styles/styles.css";
import { Valor, Sheet, Feature, getFeatureCollection, Trait } from "@internal";

function init() {
    console.log(Feature.collections);

    console.log(new Trait(null));

    const sheet = new Sheet(null).create();
    console.log(sheet);

    Valor.mount(document.body, { id: sheet.id });
}

document.addEventListener("DOMContentLoaded", init);