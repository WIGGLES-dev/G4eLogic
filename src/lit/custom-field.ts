import { LitElement } from "lit";
import { customElement, property } from "lit/decorators";
import { State } from "rxdeep";
enum FieldType {
    text = "text",
    number = "number",
    select = "select",
    date = "data",
    checkbox = "checkbox",
}

@customElement("custom-field")
export class CustomField extends LitElement {
    @property({ type: String })
    type: FieldType
    @property({ attribute: false })
    state: State<unknown>
    render() {

    }
}

declare global {
    interface HTMLElementTagNameMap {
        "custom-field": CustomField
    }
}