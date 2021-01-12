import { View, System } from "@internal";
import "@ui/styles.css";
import { register } from './register';
async function init() {
    await System.init(register);
    new View(document.body).render('main');
}
window.onload = init