import { EntityStore, getEntityType, Query, Store, StoreConfig } from "@datorama/akita";
import produce from "immer";
import { config, Config } from "@internal";

import Editor from "@ui/sheet.svelte";
import ContextMenu from "@ui/context-menu/ContextMenu.svelte";
import { addHook, removeHook } from "@externals/hooks";
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

    static frames = {}
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
            target: accessFrame().document.body,
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

    static _mountFrame(target: HTMLElement, options: any = {}) {
        const frame = target.appendChild(Object.assign(document.createElement("iframe"), {
            width: "100%",
            height: "100%",
            src: "about:blank",
            name: `valor character sheet ~ ${options.id}`
        }));
        const icons = Object.assign(document.createElement("link"), {
            rel: "stylesheet",
            href: "https://pro.fontawesome.com/releases/v5.10.0/css/all.css",
        });
        const styles = Object.assign(document.createElement("link"), {
            rel: "stylesheet",
            href: options.styles
        });
        frame.contentDocument.head.append(icons, styles);
        frame.onmouseenter = () => {
            ValorRepo.update(data => { data.focusedFrameId = options.id })
            window.frames[`valor character sheet ~ ${options.id}`].focus();
        };
        frame.onmouseleave = () => {
            ValorRepo.update(data => { data.focusedFrameId = null })
            window.focus();
        };
        bubbleFrameEvents(frame);
        this._mountApp(frame.contentDocument.body, options);
    }
    static _mountApp(target: HTMLElement, options: any = {}) {
        if (!options.id) return
        const app = (new Editor({
            target,
            props: {
                ...options,
                editor: this
            }
        }));
        Valor.apps[options.id] = app;
        Valor.frames[options.id] = target;
    }
    static mount(target: HTMLElement, options: { [key: string]: any } = {}) {
        if (options.encapsulate) {
            this._mountFrame(target, options);
        } else {
            this._mountApp(target, options);
        }
        return this
    }
}

export function accessFrame() {
    const frameName = "valor character sheet"
    const frameId = Valor.data.focusedFrameId
    return window.frames[`${frameName} ~ ${frameId}`] || window as Window
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
        window.dispatchEvent(event)
    }
    frame.contentWindow.onscroll = (e) => {
        if (Valor.data.contextMenuActive) {
            Valor.contextMenuApp?.$destroy();
        }
    }
}