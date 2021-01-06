import { SvelteComponent } from 'svelte';
import { System } from '@internal';
export type Component = typeof SvelteComponent;
export type Props = Record<string, any>
export class View {
    element: HTMLElement
    parent: View
    children: Set<View> = new Set()
    component: SvelteComponent
    constructor(element: HTMLElement) {
        this.element = element;
    }
    render(c: string | typeof SvelteComponent, props: Props = {}) {
        let component: typeof SvelteComponent = typeof c === 'string' ? System.components.get(c) : c;
        if (this.component instanceof SvelteComponent) {
            this.component.$destroy();
        }
        this.component = new component({
            target: this.element,
            props
        });
        return this
    }
    nest() {

    }
    destroy() {

    }
}