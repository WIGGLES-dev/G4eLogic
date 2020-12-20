import { getRoot } from "@internal";
import ContextMenuComponent from "@components/ContextMenu/ContextMenu.svelte";
import Home from "@ui/home.svelte";
import { SvelteComponent } from "svelte";
import { GConstructor } from "../utils/mixin";

export function createContextMenu(e: MouseEvent, options: ContextMenuOption[]) {
    if (!(e.target instanceof HTMLElement) || !(options?.length > 0)) return
    const menu = new ContextMenuComponent({
        target: getRoot(e.target),
        props: {
            e,
            options
        }
    });
    menu.$on("close", () => menu.$destroy());
    return menu
}
export interface ContextMenuOption {
    label: string
    callback: () => void
    disabled?: boolean
    show?: () => boolean
    options?: ContextMenuOption[]
    classes?: string[]
}
export function createTooltip() { }

export class UI {
    document: Document
    contextMenuOpen: boolean
    view: string

    constructor(document: Document) {
        this.document = document;
    }

    renderContextMenu(e: MouseEvent, options?: ContextMenuOption[]) {
        const menu = createContextMenu(e, options);
        if (!menu || this.contextMenuOpen) return
        this.contextMenuOpen = true;
        menu.$on("close", () => this.contextMenuOpen = false);
    }
    // static register(view: GConstructor<View>) { }

    render() {
        const app = new Home({
            target: this.document.body,
            props: {}
        });
        console.log(app);
    }
}

