import { LitElement, html, css, TemplateResult } from "lit";
import { property, customElement } from "lit/decorators";
import { unsafeHTML } from "lit/directives/unsafe-html";
import { classMap } from "lit/directives/class-map";
import { styleMap } from "lit/directives/style-map";

interface Option {
    callback: () => void
    show: () => boolean
    label: string
}
@customElement("action-menu")
export class ActionMenu extends LitElement {
    @property({ attribute: false })
    options: Option[]
    private _renderOption(option: Option, i: number, options: Option[]) {
        if (option?.show?.()) {
            return html`
                <li @click=${() => option?.callback?.()}>
                    ${option.label}
                </li>
            `
        }
    }
    render() {
        const options = this.options.map(this._renderOption);
        return html`
            <ul>
                ${options}   
            </ul>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "action-menu": ActionMenu,
    }
}