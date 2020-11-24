import { Query, Store, StoreConfig, createStore, createQuery } from "@datorama/akita";
import produce from "immer";
import Editor from "@ui/sheet.svelte";
import EntityEditor from "@ui/editors/Editor.svelte";
import ContextMenu from "@ui/context-menu/ContextMenu.svelte";

import { config, Config, addHook, removeHook, ResourceHooks, getRoot, bubbleFrameEvents, HookEvent } from "@internal";
import { fromEvent, Observable } from "rxjs";

export interface ValorConfig {
    focusedFrameId?: string
    contextMenuActive: boolean
    globalConfig: Config
    currentlyEditing: string[]
}

export const defaultValorConfig = (): ValorConfig => ({
    contextMenuActive: false,
    globalConfig: config,
    currentlyEditing: []
})

export const ValorRepo = createStore<ValorConfig>(defaultValorConfig(), { name: 'valor', producerFn: produce });
export const ValorLookup = createQuery(ValorRepo)

type ValorHooks = ResourceHooks
export class Valor {
    static channel = new BroadcastChannel("valor")

    static get data() { return ValorLookup.getValue() }
    static get data$() { return ValorLookup.select() }

    static on(hook: ValorHooks, fn: (e: HookEvent) => void) { return addHook(hook, fn) }
    static on$(hook: ValorHooks) { return fromEvent<HookEvent>(this, hook) }
    static get allHooks() {
        return Object.values({ ...ResourceHooks }).reduce((hooks, hook) => {
            hooks[hook] = this.on$(hook)
            return hooks
        }, {} as { [key in ValorHooks]: Observable<HookEvent> })
    }

    static off(hook: string, fn: Function) { return removeHook(hook, fn) }

    window: Window

    constructor(window: Window) {
        this.window = window;
    }

    static contextMenu(e: MouseEvent, options = []) {
        if (!options.length || this.data.contextMenuActive) return
        const menu = new ContextMenu({
            target: getRoot(e.target as HTMLElement),
            props: {
                e,
                options
            }
        });
        ValorRepo.update(data => {
            data.contextMenuActive = true;
        })
        menu.$on("close", () => { menu.$destroy(); ValorRepo.update(data => { data.contextMenuActive = false }) });
    }

    static open() { }
    static embed() { }

    static mount(target: HTMLElement, props) {
        return mount(Editor, target, { ...props, editor: this });
    }
    static mountEditor(target: HTMLElement, props = {}) {
        return mount(EntityEditor, target, { ...props, editor: this });
    }

    setState() {
        this.window
    }
}

function mount(app: typeof Editor, target: HTMLElement, props) {
    if (!props.id) return
    let appInstance = new app({
        target: props.encapsulate ?
            props.encapsulate === "shadow" ?
                createShadow(target, props) : createFrame(target, props).contentDocument.body
            : target,
        props
    });

    return appInstance
}

function createShadow(target: HTMLElement, props) {
    const root = target.appendChild(document.createElement("div"));
    const shadow = root.attachShadow({ mode: 'open' });
    const meta = document.createElement("meta");
    meta.setAttribute("charset", "utf-8")
    const links = props.styles?.map(href => {
        return Object.assign(document.createElement("link"), {
            rel: "stylesheet",
            href
        })
    });
    shadow.append(meta, ...links);
    const mount = shadow.appendChild(document.createElement("div"));
    return mount
}

function createFrame(target: HTMLElement, props) {
    const frame = target.appendChild(Object.assign(document.createElement("iframe"), {
        width: "100%",
        height: "100%",
        src: "about:blank",
        name: `valor character sheet ~ ${props.id}`,
    }));

    const meta = document.createElement("meta");
    meta.setAttribute("charset", "utf-8")
    const links = props.styles?.map(href => {
        return Object.assign(document.createElement("link"), {
            rel: "stylesheet",
            href
        })
    });
    frame.contentDocument.head.append(meta, ...links);
    frame.onmouseenter = () => {
        ValorRepo.update(data => { data.focusedFrameId = props.id })
        window.frames[`valor character sheet ~ ${props.id}`].focus();
    };
    frame.onmouseleave = () => {
        ValorRepo.update(data => { data.focusedFrameId = null })
        window.focus();
    };
    bubbleFrameEvents(frame);
    return frame
}