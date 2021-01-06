import { View, System } from "@internal";
import "@ui/styles.css";
import "./registerAll";
System.init();
window.onload = function () {
    new View(document.body).render('main');
}