import { fromEvent } from "rxjs";

export function toTop(node: HTMLElement) {
    document.body.appendChild(node);
}

interface PathBindParams {
    event: string
    observer: any
}

export function pathBind(node: HTMLElement, params: PathBindParams) {
    const event$ = fromEvent(node, params.event);
    const subscription = event$.subscribe(params.observer)

    return {
        update(params: PathBindParams) { },
        destroy() {
            subscription.unsubscribe();
        }
    }
}