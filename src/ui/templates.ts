import { html } from "lit";

const label = (label: string, control: unknown, binding: string = label) => {
  let _control;
  if (control instanceof Array) {
    const options = control.map(() => html``);
    _control = html`
      <select>${options}</select>
    `
  } else if (typeof control === "string" && ["text", "number", "checkbox"].includes(control)) {
    _control = html`<input type=${control} />`
  } else if (control === "textarea") {
    _control = html`<textarea> </textarea>`
  }
  return html`
    <label data-prop=${binding}>
      <span>${label}</span>
      ${_control}
    </label>
`}

class ProcessingDirective {

  render(prop: string, rootId, embedId?) {

  }
}

const editor = (rootId: string, relPath: string, form) => {
  return html`
    <form data-root-id=${rootId} data-relpath=${relPath}>
      ${form}
    </form>
  `
}

const getProcessedData = (prop, rootId, embedId) => {
  return null
}

const fields = {
  name: label("name", "text", "name"),
  specializations: label("specialization", "text"),
  signature: label("signature", []),
  difficulty: label("difficulty", []),
  points: label("points", "number"),
  encumbrance: label("encumbrance", [], ""),
  techLevel: label("TL", "text", "techLevel"),
  enabled: label("enabled", "checkbox", "enabled"),
  categories: label("categories", "text"),
  reference: label("reference", "text"),
  notes: label("notes", "textarea"),
  level: (rootId, embedId?) => html`
    <output>
      ${getProcessedData("level", rootId, embedId)}
    </output>
  `
};
const tableHeaders = {
  skill: [],
  technique: [],
};

const skillEditor = (rootId: string, embedId: string, relPath: string) =>
  html`
    <form data-root-id=${rootId} data-relpath=${relPath}>
      <fieldset>
        ${fields.name}
        ${fields.specializations}
      </fieldset>
      <fieldset>
        ${fields.signature}
        ${fields.difficulty}
        ${fields.points}
        ${fields.level(rootId, embedId)}
      </fieldset>
      <fieldset>
        ${fields.encumbrance}
        ${fields.techLevel}
        ${fields.enabled}
      </fieldset>
      <fieldset>
        ${fields.categories}
        ${fields.reference}
      </fieldset>
      ${fields.notes}
    </form>
  `;
const techniqueEditor = html`
  <fieldset> </fieldset>
`;
const spellEditor = html``;
const traitEditor = html``;
const equipmentEditor = html``;

export default {
  skill: {
    row() { },
    list(record) {
      return html`
        <article>
          <h3>${record.name}</h3>
          <ul>
            <li></li>
          </ul>
        </article>
      `;
    },
    card() { },
  },
  technique: {
    row() { },
    list() { },
    card() { },
  },
  spell: {
    row() { },
    list() { },
    card() { },
  },
  equipment: {
    row() { },
    list() { },
    card() { },
  },
  trait: {
    row() { },
    list() { },
    card() { },
  },
};