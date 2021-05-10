import { LitElement, html, css, TemplateResult } from "lit";
import { property } from "lit/decorators/property";
import { customElement } from "lit/decorators/custom-element";
import { createRef, ref } from "lit/directives/ref";
import { unsafeHTML } from "lit/directives/unsafe-html";
import { classMap } from "lit/directives/class-map";
import { styleMap } from "lit/directives/style-map";

@customElement("custom-dialog")
export class CustomDialog extends LitElement {
  private _dialog = createRef<HTMLDialogElement>();
  get open() {
    return this._dialog?.value?.open;
  }
  static styles = [
    css`
      dialog[open] {
        -webkit-animation: show 1s ease normal;
      }
      @-webkit-keyframes show {
        from {
          transform: translateY(-100vh);
        }
        to {
          transform: translateY(0%);
        }
      }
      dialog.hide {
        -webkit-animation: hide 1s ease normal;
      }
      @-webkit-keyframes hide {
        to {
          transform: translateY(-100vh);
        }
      }
      .dialog::backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        -webkit-animation: none;
      }
      .dialog[open]::backdrop {
        -webkit-animation: show-backdrop 0.5s ease 0.2s normal;
      }
      .dialog.hide::backdrop {
        -webkit-animation: hide-backdrop 0.5s ease 0.2s normal;
      }
      @-webkit-keyframes show-backdrop {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      @-webkit-keyframes hide-backdrop {
        to {
          opacity: 0;
        }
      }
    `,
  ];
  showModal() {
    this._dialog.value?.showModal();
  }
  close() {
    const element = this._dialog?.value;
    function hideAndClose() {
      element.classList.remove("hide");
      element.close();
      element.removeEventListener("webkitAnimationEnd", hideAndClose);
    }
    element.addEventListener("webkitAnimationEnd", hideAndClose);
    element.classList.add("hide");
  }
  render() {
    return html`
      <dialog ${ref(this._dialog)}>
        <slot></slot>
      </dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "custom-dialog": CustomDialog;
  }
  interface CustomHTMLDialogElement extends CustomDialog {}
}
