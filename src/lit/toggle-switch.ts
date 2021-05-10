import { LitElement, html, css, TemplateResult } from "lit";
import { property } from "lit/decorators/property";
import { customElement } from "lit/decorators/custom-element";
import { classMap } from "lit/directives/class-map";
import { styleMap } from "lit/directives/style-map";

const arrows = css`
  .arrow {
    display: inline-block;
    margin: 0.25rem;
    width: 0;
    height: 0;
    border-style: solid;
    border-color: transparent transparent transparent transparent;
    border-width: 0.5rem 0.5rem 0.5rem 0.5rem;
  }
  .arrow.up {
    border-bottom-color: red;
    border-top-width: 0;
  }
  .arrow.down {
    border-top-color: red;
    border-bottom-width: 0;
  }
  .arrow.right {
    border-left-color: red;
    border-right-width: 0;
  }
  .arrow.left {
    border-right-color: red;
    border-left-width: 0;
  }
`;

@customElement("toggle-switch")
export class ToggleSwitch extends LitElement {
  @property({ type: String })
  class: string;
  @property({ type: Boolean })
  toggled: boolean = false;
  static styles = [arrows];
  private _dipsatchToggle() {
    const event = new CustomEvent("toggle", {
      detail: this.toggled,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
  private _toggle() {
    this.toggled = !this.toggled;
    this._dipsatchToggle();
  }
  render() {
    const classes = {
      right: !this.toggled,
      down: this.toggled,
    };
    return html`
      <div @click=${this._toggle} class="arrow ${classMap(classes)}"></div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "toggle-switch": ToggleSwitch;
  }
}
