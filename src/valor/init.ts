import { fromEvent } from "rxjs";
import { Valor, ValorMessage, Feature, sheetStore, sheetQuery, sheetHistory } from "@internal"

import SheetUIComponent from "@ui/sheet.svelte";

function initWindow(this: GlobalEventHandlers, ev: Event) {
    if (!window) return
    const { opener, frames } = window;

    const stores = {
        ...Feature.collections,
        sheet: {
            sheetStore,
            sheetQuery,
            sheetHistory
        }
    };

    const channel = Valor.channel;

    const storage$ = fromEvent<StorageEvent>(window, "storage")
    const channel$ = fromEvent<MessageEvent<ValorMessage>>(channel, "message");
    const messages$ = fromEvent<MessageEvent<ValorMessage>>(window, "message");

    channel$.subscribe(handleMessage);
    messages$.subscribe(handleMessage);

    new SheetUIComponent({
        target: document.body
    });
}

function handleMessage(message: Event) {

}

document.onload = initWindow;