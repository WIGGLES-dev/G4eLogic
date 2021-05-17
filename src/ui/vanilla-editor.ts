import { html, TemplateResult } from "lit";
import { repeat } from "lit/directives/repeat";
import { create, cssomSheet, apply } from "twind";
const sheet = cssomSheet({ target: new CSSStyleSheet() });
const { tw } = create({ sheet });

const styles = {
  section: {
    fieldset: apply`bg-black`,
    legend: apply`text(white center)`
  }
}

const values = {
  pointTotalItems: [
    "race",
    "attributes",
    "advantages",
    "disadvantages",
    "quirks",
    "skills",
    "spells"
  ],
  encumbranceLevels: ["None", "Light", "Medium", "Heavy", "X-Heavy"],
  liftingTypes: [
    "Basic Lift",
    "One-Handed Lift",
    "Two-Handed Lift",
    "Shove & Knock Over",
    "Running Shove & Knock Over",
    "Carry On Back",
    "Shift Slightly"
  ]
}

const textField = (value?) => {
  return html`
    <input type = "number" value=${value} />
  `
};
const numberField = (value?) => {
  return html`
    <input type="number" value=${value} />
  `
};
const checkboxField = (checked?) => {
  return html`
    <input type="checkbox" .checked=${checked} >
  `
}
const imageField = (src: string) => {
  return html`
    <img ${src} />
  `
}

const label = (label: string, control: TemplateResult, path: string, before?: TemplateResult) => {
  return html`
    <label data-path=${path}>
      ${before}
      ${label}
      ${control}
    </label>
  `
}

const fieldset = (legend: string, controls: TemplateResult[]) => {
  return html`
    <fieldset>
      <legend>${legend}</legend>
      ${controls}
    </fieldset>
  `
}

const table = (caption: string, items, keyfunc, template) => {
  const rows = repeat(items, keyfunc, template);
  return html`
    <table>
      <caption>${caption}</caption>
      ${rows}
    </table>
  `
}

const ctxmenu = () => {
  html`
    <ul>

    </ul>
  `;
}

const gcsEditorSections = {
  portrait: (src: string) => {
    const control = imageField(src);
    return fieldset("Portrait", [control])
  },
  identity: ({ name, title, organization }) => {
    const controls = [
      label("Name", textField(name), "profile.name"),
      label("Title", textField(title), "profile.title"),
      label("Organization", textField(organization), "profile.organization")
    ];
    return fieldset("Identity", controls)
  },
  miscellaneous: () => {
    const controls = [

    ];
    return fieldset("Miscellaneous", controls);
  },
  description: () => {
    const col1 = [
      label("Gender", textField(), ""),
      label("Age", textField(), ""),
      label("Birthday", textField(), ""),
      label("Religion", textField(), "")
    ];
    const col2 = [
      label("Height", textField(), ""),
      label("Weight", textField(), ""),
      label("Size", textField(), ""),
      label("Size", textField(), ""),
      label("TL", textField(), "")
    ];
    const col3 = [
      label("Hair", textField(), ""),
      label("Eyes", textField(), ""),
      label("Skin", textField(), ""),
      label("Hand", textField(), "")
    ];
    const flex = html`
      <div>${[col1, col2, col3]}</div>
    `
    const controls = [flex];
    return fieldset("Description", controls);
  },
  points: (total, totals) => {
    return html`
        <fieldset>
          <legend>${total} Points</legend>
          <ul>
            ${values.pointTotalItems.map((item) => html`
              <li>
                <label>
                  ${item}
                  <output>${totals[item]}</output>
                </label>
              </li>
            `)}
          </ul>
        </fieldset>
      `
  },
  primary: (attributes) => {
    const makeAttributeRow = ({ cost, level, label }) => html`
      <li>
        ${cost}
        ${numberField(level)}
        ${label}
      </li>
    `;
    const attributeList = repeat(attributes, ({ label }) => label, makeAttributeRow) as any;
    return fieldset("Primary Attributes", [attributeList]);
  },
  secondary: () => {
    return fieldset("Secondary Attributes", []);
  },
  pools: () => {
    return fieldset("Point Pools", []);
  },
  locations: (build, locations) => {
    return html`
      <table>
        <caption>${build}</caption>
        <tr>
          <th>Roll</th>
          <th>Where</th>
          <th>Penalty</th>
          <th>DR</th>
        </tr>
        ${locations.map(([roll, where, penalty, dr]) => html`
          <tr>
            <td>${roll}</td>
            <td>${where}</td>
            <td>${penalty}</td>
            <td>${dr}</td>
          </tr>
        `)}
      </table>
    `
  },
  encumbrance: (encumbrance: number, bl: number, move: number, dodge: number) => {
    const max = (i) => {
      switch (i) {
        case 0: return 1
        case 1: return 2
        case 2: return 3
        case 3: return 6
        case 4: return 10
      }
    }
    const fraction = (i) => {
      switch (i) {
        case 0: return 1
        case 1: return .8
        case 2: return .6
        case 3: return .4
        case 4: return .2
      }
    }
    html`
        <table>
          <caption>Encumbrance, Move, Dodge</caption>
          <tr>
            <td>Level</td>
            <td>Max Load</td>
            <td>Move</td>
            <td>Dodge</td>
          </tr>
          ${values.encumbranceLevels.map((level, i) => html`
            <tr>
              <td>
                <span>${encumbrance === i ? "*" : ""}</span> 
                (${i})
                ${level}
              </td>
              <td>${bl * fraction(i)}</td>
              <td>${move * fraction(i)}</td>
              <td>${dodge * fraction(i)}</td>
            </tr>
          `)}
        </table>
      `
  },
  lifting: (bl: number) => {
    const multiplier = (i) => {
      switch (i) {
        case 0: return 1
      }
    }
    html`
        <table>
          <caption>Lifting & Moving Things</caption>
          ${values.liftingTypes.map((type, i) => html`
            <tr>
              <td>${bl * multiplier(i)} lb</td>
              <td>${type}</td>
            </tr>
          `)}
        </table>
      `
  },
  meleeWeapons: (weapons) => {
    const renderRow = ([
      owner,
      usage,
      lvl,
      parry,
      block,
      damage,
      reach,
      st
    ]) => html`
            <tr>
                <td>${owner}</td>
                <td>${usage}</td>
                <td>${lvl}</td>
                <td>${parry}</td>
                <td>${block}</td>
                <td>${damage}</td>
                <td>${reach}</td>
                <td>${st}</td> 
            </tr>
        `;
    return html`
            <table>
            <tr>
                <th>Melee Weapons</th>
                <th>Usage</th>
                <th>Lvl</th>
                <th>Parry</th>
                <th>Block</th>
                <th>Damage</th>
                <th>Reach</th>
                <th>ST</th>
            </tr>
                ${weapons.map(renderRow)}
            </table>
        `
  },
  rangedWeapons: () => {
    const renderRow = ({

    }) => html`
            <tr>
            </tr>
        `;
    return html`
            <table>

            </table>
        `
  },
  traits: () => {

  },
  skills: () => {

  },
  equipment: () => {

  },
  otherEquipment: () => {

  },
  notes: () => {

  }
}

const dataList = (items, keyfunc, template) => {
  const dataItems = repeat(items, keyfunc, template);
  return html`
    <ul>
      ${dataItems}
    </ul>
  `
}

const panels = {
  features: () => {

  },
  defaults: () => {

  },
  rangedWeapons: () => {

  },
  meleeWeapons: () => {

  }
}

const detailEditor = (type: string) => {
  const form = html`
    <form>
        <button>Apply</button>
        <button>Cancel</button>
    </form>
  `
}

const entityEditors = {
  skill: () => {
    return html`

    `
  },
  technique: () => {
    return html`
          
    `
  },
  spell: () => {
    return html`
           
    `
  },
  trait: () => {
    return html`
          
    `
  },
  equipment: () => {
    return html`
          
    `
  },
  equipmentModifier: () => {
    return html`

    `
  },
  traitModifier: () => {
    return html`

    `
  }
}

const handlers = {
  click() { },
  input() { },
  change() { },
  _update() { }
}

const gcsEditor = () => html`
    <form>
      <div>
        ${gcsEditorSections.portrait(null)}
        <div>
          <div>
            ${gcsEditorSections.identity(null)}
            ${gcsEditorSections.miscellaneous()}
          </div>
          <div>
            ${gcsEditorSections.description()}
          </div>
        </div>
        ${gcsEditorSections.points(null, null)}
      </div>
      <div>
        <div>
          <div>
            ${gcsEditorSections.primary(null)}
            ${gcsEditorSections.secondary()}
          </div>
          ${gcsEditorSections.pools()}
        </div>
        ${gcsEditorSections.locations(null, null)}
        <div>
          ${gcsEditorSections.encumbrance(null, null, null, null)}
          ${gcsEditorSections.lifting(null)}
        </div>
      </div>
      ${gcsEditorSections.meleeWeapons([])}
      ${gcsEditorSections.rangedWeapons()}
      <div>
        ${gcsEditorSections.traits()}
        ${gcsEditorSections.skills()}
      </div>
      ${gcsEditorSections.equipment()}
      ${gcsEditorSections.otherEquipment()}
      ${gcsEditorSections.notes()}
    </form>
  `