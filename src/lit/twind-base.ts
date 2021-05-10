import { LitElement } from "lit";
import { create, cssomSheet } from "twind";
import { apply } from "twind/css";
const sheet = cssomSheet({ target: new CSSStyleSheet() });
export const { tw } = create({ sheet });
export class TWindElement extends LitElement {
  static styles: typeof LitElement["styles"] = [sheet.target];
  constructor() {
    super();
  }
}
