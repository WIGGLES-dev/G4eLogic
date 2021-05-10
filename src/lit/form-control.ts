import { LitElement, html, TemplateResult, css } from "lit";
import { TWindElement, tw } from "./twind-base";
import { customElement } from "lit/decorators/custom-element";
import { property } from "lit/decorators/property";
enum InputType {
  Hidden = "hidden",
  Text = "text",
  Number = "number",
  Search = "search",
  Tel = "tel",
  URL = "url",
  Email = "email",
  Password = "password",
  Datetime = "datetime",
  Date = "date",
  Month = "month",
  Week = "week",
  Time = "time",
  DatetimeLocal = "datetime-local",
  Range = "range",
  Color = "color",
  Checkbox = "checkbox",
  Radio = "radio",
  File = "file",
  Submit = "submit",
  Image = "image",
  Reset = "reset",
  Button = "button",
}
const valueConverter = {
  toAttribute(value) {
    return value;
  },
  fromAttribute(value) {
    return value;
  },
};
@customElement("form-control")
export class FormControl extends TWindElement {
  @property({ type: String })
  type: any;
  @property({ converter: valueConverter })
  value: any;
  @property({ type: Boolean })
  multiple = false;
  @property({ type: Boolean })
  disabled = false;
  static get styles() {
    return [
      css`
        input,
        select,
        textarea {
          display: block;
          outline: none;
          border: none;
          padding: 0px 0px 0px 0px;
          margin: 0px 0px 0px 0px;
          height: 2rem;
        }
        :host {
          height: 2rem;
          display: block;
        }
      `,
    ];
  }
  constructor() {
    super();
    this.addEventListener("input", this._handleInput);
    this.addEventListener("change", this._handleChange);
  }
  private _handleInput(e: InputEvent) {
    const path = e.composedPath();
    const [target] = path;
    if (target instanceof HTMLElement) {
      if (target instanceof HTMLInputElement) {
        if (this.type === "number") {
          this.value = +target.value;
        } else if (this.type === "checkbox") {
          this.value = target.checked;
        } else {
          this.value = target.value;
        }
      } else if (target instanceof HTMLTextAreaElement) {
        this.value = target.value;
      } else if (target instanceof HTMLSelectElement) {
        this.value = target.value;
      }
    }
  }
  private _handleChange(e: Event) {}
  private _renderCustomTextarea() {
    return html` <textarea value=${this.value}> </textarea> `;
  }
  private _renderOptions(options: Options) {
    return options?.map(
      ([value, label = value]) => html`
        <option value=${value}>${label}</option>
      `
    );
  }
  private _renderCustomSelect() {
    return html`
      <select>
        <slot> </slot>
      </select>
    `;
  }
  private _renderField() {
    let control: TemplateResult;
    if (this.type instanceof Array) {
      control = html`
        <select>
          ${this._renderOptions(this.type)}
        </select>
      `;
    } else if (this.type === "textarea") {
      control = this._renderCustomTextarea();
    } else if (this.type === "select") {
      control = this._renderCustomSelect();
    } else {
      control = html` <input type=${this.type} value=${this.value} /> `;
    }
    return control;
  }
  render() {
    return html`
      <div contenteditable="true">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "form-control": FormControl;
  }
}
