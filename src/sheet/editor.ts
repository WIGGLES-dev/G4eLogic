type Fields = TextField | TextAreaField | SelectField | RadioField | CheckboxField
type FieldElements = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
enum FieldTypes {
    Text = "text",
    Number = "number",
    Checkbox = "checkbox",
    Radio = "radio",
    Select = "select",
    TextArea = "textarea"
}
interface Field {
    type: FieldTypes
    element: FieldElements
    id?: string
    name: string
    label: string
    averageCharacterLength: number
}
interface FieldGroup {
    elements: FieldElements[]
}
interface TextField extends Field {
    type: FieldTypes.Text
    element: HTMLInputElement
}
interface TextAreaField extends Field {
    type: FieldTypes.TextArea
    element: HTMLTextAreaElement
}
interface SelectField extends Field {
    type: FieldTypes.Select
    element: HTMLSelectElement
}
interface RadioField extends FieldGroup {
    type: FieldTypes.Radio
    elements: HTMLInputElement[]
}
interface CheckboxField extends Field {
    type: FieldTypes.Checkbox
    element: HTMLInputElement
}
class Field {
    static coerce(value: string) { }
    characterLength() {
        const value = this.element.value
        return value.length
    }

    constructor() { }
}
class FieldGroup {

}
class Editor {
    fields: Fields[]

    constructor() {
    }
}