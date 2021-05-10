import { TWindElement, tw } from "./twind-base";
import { LitElement, html, css, TemplateResult } from "lit";
import { property } from "lit/decorators/property";
import { customElement } from "lit/decorators/custom-element";
import { queryAssignedNodes } from "lit/decorators/query-assigned-nodes";
import { unsafeHTML } from "lit/directives/unsafe-html";
import { classMap } from "lit/directives/class-map";
import { styleMap } from "lit/directives/style-map";

@customElement("tabbed-layout")
export class TabbedLayout extends TWindElement {
  @property({ type: String, reflect: true })
  activeTab: string;
  @queryAssignedNodes(undefined, true)
  private _tabNodes: HTMLElement[];
  constructor() {
    super();
  }
  static get styles() {
    return [
      super.styles,
      css`
        ::slotted([data-tab]) {
        }
        ::slotted([data-tab].active) {
        }
      `,
    ];
  }
  _handleSelectTab(e: Event) {
    const path = e.composedPath();
    const [target] = path;
    if (target instanceof HTMLElement) {
      const { tab } = target.closest(`[data-tab]`)?.["dataset"] ?? {};
      if (tab) {
        this.activeTab = tab;
        this._tabNodes.forEach((element) => {
          const { tab: _tab } = element.dataset;
          if (tab === _tab) {
            element.classList.add("active");
          } else {
            element.classList.remove("active");
          }
        });
      }
    }
  }
  render() {
    return html`
      <div>
        <nav @click=${this._handleSelectTab} class=${tw`flex`}>
          <slot></slot>
        </nav>
        <slot name=${this.activeTab}></slot>
      </div>
    `;
  }
}
