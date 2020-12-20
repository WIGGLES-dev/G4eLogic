import { UI, Registry } from "@internal";
import "@ui/styles.css";
import "./registerAll";
const gui = new UI(document)
//@ts-ignore
window.Registry = Registry
window.onload = function () {
    gui.render();
}