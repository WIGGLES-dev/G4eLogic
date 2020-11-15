import "@ui/styles/styles.css";
import { Valor, Sheet } from "@internal";

function init() {

    const sheet = new Sheet(null).create();

    Valor.mount(document.body, { id: sheet.id });
}

document.addEventListener("DOMContentLoaded", init);