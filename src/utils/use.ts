import { ignore, State } from 'rxdeep';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';
import { preventDefault } from '@utils/operators';
export type UseFunction<E extends Element, P = any> = (node: E, params: P) => UseFunctionReturn
export interface UseFunctionReturn<P = any> {
    update: (params: P) => void
    destroy: () => void
}
export function use<E extends Element, P = any>(node: E, fn: UseFunction<E, P>, ctx: Observable<P>) {

}
export function bind(node: HTMLElement, params: State<any>) {
    const {
        dataset: {
            event = 'change',
            debounce,
            prop = node['type'] === 'checkbox'
                ? 'checked' : node.matches("[contenteditable]")
                    ? 'innerHTML' : 'value'
        }
    } = node;
    if (params instanceof State) {
        const event$ = fromEvent(node, event);
        const observer = new MutationObserver((records, observer) => {
            if (params.value == null || node[prop] == params.value) return
            node[prop] = params.value;
        })
        const value$ = event$.pipe(
            debounce ? debounceTime(+debounce) : src => src,
            map(e => e.target as HTMLElement),
            map(elem => {
                if (elem instanceof HTMLInputElement) {
                    switch (elem.type) {
                        case 'text': return elem.value
                        case 'number': return +elem.value
                        case 'checkbox': return !!elem.checked
                    }
                } else if (elem instanceof HTMLSelectElement) {
                    return elem.value
                } else if (elem instanceof HTMLTextAreaElement) {
                    return elem.value
                } else if (elem.matches("[contenteditable]")) {
                    return elem.innerHTML
                }
            }),
        );
        let sub1 = value$.subscribe(params);
        let sub2 = params.subscribe(value => {
            if (value == null || node[prop] == value) return
            node[prop] = value
        });
        if (node instanceof HTMLSelectElement) {
            observer.observe(node, {
                childList: true
            });
        }
        return {
            update(params) {
                sub1.unsubscribe();
                sub1 = value$.subscribe(params);
            },
            destroy() {
                sub1.unsubscribe();
                sub2.unsubscribe();
                observer.disconnect();
            }
        }
    }
}
export function assign(node: HTMLElement, params: Record<string, any>) {
    Object.assign(node, params);
    return {
        update(params) {
            Object.assign(node, params);
        }
    }
}
export function fragment(node: HTMLTemplateElement) {
    node.parentElement.appendChild(node.content);
    return {
        destroy() {
            if (node && node.parentElement && node.parentElement.contains(node)) {
                try {
                    node.parentElement.removeChild(node.content);
                } catch (err) {

                }
            }
        },
    };
}
export function lift(node: HTMLElement, params: number = 1) {
    let targetElem = node;
    for (let i = 0; i < params; ++i) {
        targetElem = targetElem.parentElement;
    }
    targetElem.append(node);
    return {
        destroy() {
            node.remove();
        }
    }
}
export function colSpanMax(node: HTMLTableCellElement | HTMLTableHeaderCellElement) {
    const table = node.closest("table");
    const rows = table.querySelectorAll("tr");
    const cells = Array.from(rows).reduce((span, row) => Math.max(span, row.cells.length), 0);
    node.colSpan = cells;
}
export function droptarget(node: HTMLElement) {
    const dragStart$ = fromEvent(node, 'dragstart').pipe(preventDefault);
    const dragOver$ = fromEvent(node, 'dragover').pipe(preventDefault);
    const sub1 = dragStart$.subscribe();
    const sub2 = dragOver$.subscribe();
    return {
        destroy() {
            sub1.unsubscribe();
            sub2.unsubscribe();
        }
    }
}

export function stream(node: HTMLElement, params) {
    const mutationConfig = {};
    function onNodeChange(mutationList, observer) { }
    const mutationObserver = new MutationObserver(onNodeChange)
    mutationObserver.observe(node, mutationConfig);
    function makeEvent() {
        const {
            event
        } = node.dataset
        return fromEvent(node, event)
    }
    let event$ = makeEvent()
    let sub = params.subscribe(event$)
    return {
        destroy() {
            sub.unsubscribe()
        },
        update(params) {
            sub.unsubscribe();
            event$ = makeEvent();
            sub = params.subscribe(event$);
        }
    }
}