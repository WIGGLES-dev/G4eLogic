import { LitElement, html, css, TemplateResult } from "lit";
import { property, customElement } from "lit/decorators";
import { unsafeHTML } from "lit/directives/unsafe-html";
import { classMap } from "lit/directives/class-map";
import { styleMap } from "lit/directives/style-map";

@customElement("custom-dialog")
export class CustomDialog extends LitElement {
    static styles = [
        css`
            
        `
    ]
    render() {
        return html`
            <dialog>
                <slot></slot>
            </dialog>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "custom-dialog": CustomDialog
    }
}