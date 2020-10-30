import * as jp from "jsonpath";
import { Valor, ValorEvent } from "valor/valor";

import "@ui/styles/styles.css";

function init() {
    const editor = Valor.init().mount(document.body);

    editor.on(ValorEvent.Roll, ({ detail }) => alert(detail.entity.id))
}

document.addEventListener("DOMContentLoaded", init);

//@ts-ignore
window.jp = jp;
