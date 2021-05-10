import { html } from "lit";

export default {
  skill: {
    row() {},
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
    card() {},
  },
  technique: {
    row() {},
    list() {},
    card() {},
  },
  spell: {
    row() {},
    list() {},
    card() {},
  },
  equipment: {
    row() {},
    list() {},
    card() {},
  },
  trait: {
    row() {},
    list() {},
    card() {},
  },
};
