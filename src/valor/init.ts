import {
    Valor,
    handleMessage,
    valorConnectionMethods,
} from "@internal"
import "firebase/app";
import ValorGUI from "@ui/view.svelte";
import { connectToParent } from "penpal";
import { foundryConnectionMethods, handleForwardEventsToFoundry, handleFoundryEvent } from "./plugins/xss/foundry/init";

console.time("page-load");
console.log("loading script");

async function integrateWithFoundry() {
    try {
        const host = connectToParent<typeof foundryConnectionMethods>({ methods: valorConnectionMethods });
        const methods = await host.promise;
        if (typeof methods.getEnvironment === "function" && await methods.getEnvironment() === "foundry") {
            // Valor.events$.subscribe(e => handleForwardEventsToFoundry(e, host));
            // Valor.events$.subscribe(e => handleFoundryEvent(e));
            // const game = await methods.getGameData();
            // for (const actor of game?.actors ?? []) {
            //     Entity.collections[actor.data.type]?.store.add(actor.data);
            //     for (const item of actor.items || []) {
            //         Entity.collections[item.data.type]?.store.add(item.data);
            //     }
            // }
            // for (const item of game?.items ?? []) {
            //     Entity.collections[item.data.type]?.store.add(item.dat);
            // }
        }
    } catch (err) {
        console.log(err);
    }
}

async function initWindow(this: GlobalEventHandlers, ev: Event) {
    if (!window) return
    console.timeLog("page-load", "document ready");
    console.timeLog("page-load", "integrating with foundry");
    await integrateWithFoundry();

    try {
        console.timeLog("page-load", "loading the database")

    } catch (err) {
        console.log("The database has failed to load", err);
    }
    console.timeLog("page-load", "setting up message channels")
    Valor.channel.addEventListener("message", m => handleMessage(m, Valor));

    try {
        console.timeLog("page-load", "initiating the GUI");
        new ValorGUI({
            target: document.body,
            props: {}
        });
    } catch (err) {

    }

}

window.onload = initWindow;