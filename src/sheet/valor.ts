import { EntityStore, getEntityType, Query, Store, StoreConfig } from "@datorama/akita";
import produce from "immer";
import { config, Config, addHook, before, removeHook } from "@internal";

import Editor from "@ui/sheet.svelte";
import EntityEditor from "@ui/editors/Editor.svelte";
import ContextMenu from "@ui/context-menu/ContextMenu.svelte";

import { SvelteComponent } from "svelte";

export abstract class ValorEntityStore<S> extends EntityStore<S> {
    constructor() {
        super();
    }

    akitaPreAddEntity(newEntity: any): getEntityType<S> {
        return newEntity
    }
    akitaPreUpdateEntity(_: Readonly<getEntityType<S>>, nextEntity: any): getEntityType<S> {
        return nextEntity
    }
}

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

@StoreConfig({ name: 'valor', producerFn: produce })
export class ValorStore extends Store<ValorConfig> {
    constructor() {
        super(defaultValorConfig());
    }
}

export class ValorQuery extends Query<ValorConfig> {
    constructor(store: ValorStore) {
        super(store);
    }
}

export const ValorRepo = new ValorStore();
export const ValorLookup = new ValorQuery(ValorRepo)

export class Valor {
    static get data$() { return ValorLookup.select() }
    static get data() { return ValorLookup.getValue() }

    static on(hook: string, fn: Function) { return addHook(hook, fn) }
    static off(hook: string, fn: Function) { return removeHook(hook, fn) }

    static apps = {}

    static contextMenuApp: SvelteComponent

    constructor() { }

    static upload() {
        return new Promise((resolve, reject) => {
            Object.assign(document.createElement("input"), {
                type: "file",
                async onchange() {
                    resolve(this.files)
                }
            }).click();
        });
    }

    static download(href, filename) {
        Object.assign(document.createElement("a"), {
            href,
            filename
        }).click();
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
        this.contextMenuApp = menu;
        menu.$on("close", () => { menu.$destroy(); ValorRepo.update(data => { data.contextMenuActive = false }) });
    }

    static mount(target: HTMLElement, props) {
        return mount(Editor, target, { ...props, editor: this });
    }
    static mountEditor(target: HTMLElement, props = {}) {
        return mount(EntityEditor, target, { ...props, editor: this });
    }
}

function mount(app: typeof SvelteComponent, target: HTMLElement, props) {
    if (!props.id) return
    let appInstance = new app({
        target: props.encapsulate ?
            props.encapsulate === "shadow" ?
                createShadow(target, props) : createFrame(target, props).contentDocument.body
            : target,
        props
    });
    Valor.apps[props.id] = appInstance
    return appInstance
}

export function getRoot(element: HTMLElement) {
    const rootNode = element.getRootNode()
    if (rootNode instanceof Document) {
        return rootNode.body
    } else if (rootNode instanceof ShadowRoot) {
        return rootNode.appendChild(document.createElement("div"));
    }
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

function bubbleFrameEvents(frame: HTMLIFrameElement) {
    frame.contentWindow.onmousemove = (e) => {
        const bounding = frame.getBoundingClientRect();
        const event = new MouseEvent("mousemove", {
            ...e,
            screenX: e.screenX + bounding.left,
            clientX: e.clientX + bounding.left,
            screenY: e.clientY + bounding.top,
            clientY: e.clientY + bounding.top,
        });
        window.dispatchEvent(event);
    }
    frame.contentWindow.onclick = (e) => {
        const bounding = frame.getBoundingClientRect();
        const event = new MouseEvent("click", {
            ...e,
            screenX: e.screenX + bounding.left,
            clientX: e.clientX + bounding.left,
            screenY: e.clientY + bounding.top,
            clientY: e.clientY + bounding.top,
        });
        window.dispatchEvent(event);
    }
    frame.contentWindow.onkeypress = (e) => {
        const event = new MouseEvent("keypress", {
            ...e
        });
        window.dispatchEvent(event);
    }
    frame.contentWindow.onmouseup = (e) => {
        const bounding = frame.getBoundingClientRect();
        const event = new MouseEvent("mouseup", {
            ...e,
            screenX: e.screenX + bounding.left,
            clientX: e.clientX + bounding.left,
            screenY: e.clientY + bounding.top,
            clientY: e.clientY + bounding.top,
        });
        window.dispatchEvent(event);
    }
    frame.contentWindow.onmousedown = (e) => {
        const bounding = frame.getBoundingClientRect();
        const event = new MouseEvent("mousedown", {
            ...e,
            screenX: e.screenX + bounding.left,
            clientX: e.clientX + bounding.left,
            screenY: e.clientY + bounding.top,
            clientY: e.clientY + bounding.top,
        });
        frame.parentElement.dispatchEvent(event);
    }
    frame.contentWindow.onscroll = (e) => {
        if (Valor.data.contextMenuActive) {
            Valor.contextMenuApp?.$destroy();
        }
    }
}