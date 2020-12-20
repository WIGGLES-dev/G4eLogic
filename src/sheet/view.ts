import { Resource, GConstructor } from "@internal"
import { SvelteComponent } from "svelte"

class View {
    component: SvelteComponent
    element: HTMLElement
}

export interface Tab {
    label: string
    panel: Panel
}
export interface Panel {
    widgets: string[]
}
export class TabbedInterface extends View {
    tabs: Tab[]
    active: string
    moveTo(tab: string) { }
}

interface TreeGridMap {

}
function resourceToTreeGrid(resource: Resource, mapping: TreeGridMap) {
    return {
        header: {},
        items: [],
    }
}