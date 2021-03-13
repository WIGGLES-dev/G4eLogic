import { System } from "@internal";
import "@ui/styles.css";
import { register } from './register';
async function init() {
    await register();
    await System.init();
}
window.onload = init