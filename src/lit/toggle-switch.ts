import { LitElement, html, css, TemplateResult } from "lit";
import { property, customElement } from "lit/decorators";
import { unsafeHTML } from "lit/directives/unsafe-html";
import { classMap } from "lit/directives/class-map";
import { styleMap } from "lit/directives/style-map";

@customElement("custom-dialog")
export class ToggleSwitch extends LitElement {
    @property({ type: Boolean })
    toggled: boolean = false
    static styles = [
        css`
            
        `
    ]
    render() {
        const classes = {
            "fas": true,
            "angle-right": !this.toggled,
            "angle-down": this.toggled
        }
        return html`
            <i class=${classMap(classes)}></i>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "toggle-switch": ToggleSwitch
    }
}