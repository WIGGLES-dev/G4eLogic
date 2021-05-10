import { TWindElement, tw } from "./twind-base";
import { LitElement, html, css, TemplateResult } from "lit";
import { property } from "lit/decorators/property";
import { customElement } from "lit/decorators/custom-element";
import { unsafeHTML } from "lit/directives/unsafe-html";
import { classMap } from "lit/directives/class-map";
import { styleMap } from "lit/directives/style-map";

interface Action {
  callback: () => void;
  show?: () => boolean;
  label: string;
  classes?: string;
  subActions?: Action[];
}
@customElement("action-menu")
export class ActionMenu extends TWindElement {
  @property({ type: Boolean })
  flex: boolean;
  @property({ attribute: false })
  actions: Action[];
  private _dispatchSelectAction() {
    const event = new CustomEvent("actionselect");
    this.dispatchEvent(event);
  }

  private _renderOption(action: Action, i: number) {
    if (action?.show?.() ?? true) {
      const handleClick = () => {
        action?.callback?.();
        this._dispatchSelectAction();
      };
      const subActions =
        action.subActions instanceof Array
          ? html` <action-menu .actions=${action.subActions}></action-menu> `
          : undefined;
      return html`
        <li @click=${handleClick} class=${action.classes}>${action?.label}</li>
        ${subActions}
      `;
    }
  }

  showMenu() {}

  render() {
    const options = this.actions.map(this._renderOption, this);
    const classes = {
      [tw`flex-1`]: this.flex,
      [tw`children:(p-2 flex-1 shadow hover:(bg-gray-300))`]: true,
    };
    return html`
      <ul class=${classMap(classes)}>
        ${options}
      </ul>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "action-menu": ActionMenu;
  }
}
