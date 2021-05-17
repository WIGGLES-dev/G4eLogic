import { TableController, TreeController, TemplateController } from "./controllers";
import { popper } from "./directives";
import { html, css, TemplateResult, render } from "lit";
import { TWindElement, tw } from "./twind-base";
import { apply } from "twind";
import { css as twcss } from "twind/css";
import { property } from "lit/decorators/property";
import { customElement } from "lit/decorators/custom-element";
import { state } from "lit/decorators/state";
import { queryAssignedNodes } from "lit/decorators/query-assigned-nodes";
import { unsafeHTML } from "lit/directives/unsafe-html";
import { classMap } from "lit/directives/class-map";
import { styleMap } from "lit/directives/style-map";
import { repeat } from "lit/directives/repeat";
import { createRef, ref } from "lit/directives/ref";
import { getValueAtPath, Path, updateValueAtPath } from "@utils/path";
import { closestElement } from "@utils/dom";
import { Tree, TreeHash } from "@utils/tree";
import "./action-menu";
import "./custom-dialog";
import { CustomDialog } from "./custom-dialog";
import { ActionMenu } from "./action-menu";

enum CellTypes {
  number = "number",
  text = "text",
  checkbox = "checkbox",
  file = "file",
  output = "output",
}
interface CellContext {
  path: {
    row: Path;
    cell: Path;
    absolute: Path;
  };
  value: {
    src: any;
    row: any;
    cell: any;
  };
  hash: TreeHash<any>;
}
type CellFunction = (this: DataTable, ctx: CellContext) => TemplateResult;
type Options = [value: string, label?: string][];
type CellType = CellTypes | Options | CellFunction;
interface CellSetup {
  type: CellType;
}
type CellSetupShorthand = [
  type: CellType,
  path: Path,
  project?: (v) => any,
  toggle?: boolean
];
type Cell = CellSetupShorthand | CellSetup;
const pathConverter = {
  fromAttribute(path: string) {
    return path.split(".");
  },
  toAttribute(path: string[]) {
    return path.join(".");
  },
};
const setupConverter = {
  fromAttribute() { },
  toAttribute() { },
};
type DisplayOptions = "table" | "grid" | "list";
@customElement("data-table")
export class DataTable extends TWindElement {
  @property({ type: Number })
  main: number;
  @property({ type: String })
  persist: "indexeddb" | "localstorage" | "sessionstorage" = "indexeddb";
  @property({ type: String })
  rootId: string;
  @property({ attribute: false })
  data: Record<string, any>;
  get hash() {
    return this._treeController.hash
  }
  @property({ attribute: false })
  processed: Record<string, any>;
  @property({ converter: pathConverter })
  togglePath = ["showingChildren"];
  @property({ converter: pathConverter })
  containerPath = ["isContainer"];
  @property({ converter: pathConverter })
  branchpath = ["children"];
  @property({ converter: pathConverter })
  idpath = ["id"];
  @property({ type: Number })
  maxDepth = Number.POSITIVE_INFINITY;
  @property({ type: Boolean })
  showCollapsed = false;
  @property({ attribute: false })
  filter: Record<string, any> = {};
  @property({ converter: setupConverter })
  props: string[];
  @property({ type: Boolean })
  mutate = false;
  @property()
  schema: string;
  @property({ type: Array })
  hide: number[];
  @property({ attribute: false })
  template: any;
  @state()
  private _selectedId: string;
  @state()
  private _selectedIds: string[] = [];
  @state()
  private _tableController = new TableController(this);
  private _templateController = new TemplateController(this);
  private _treeController: TreeController = new TreeController(this);
  constructor() {
    super();
    this.addEventListener("click", this._handleClick);
    this.addEventListener("focusin", this._handleFocusin);
    this.addEventListener("focusout", this._handleFocusout);
    this.addEventListener("contextmenu", this._handleContextmenu);
  }
  static get styles() {
    return [
      super.styles,
      css`
        td {
          border: 0.5px solid black;
          height: 1.5rem;
        }
        td:not([data-toggle]) {
          text-align: center;
        }
        td:not(:last-child) {
          border-right: none;
        }
        tr:not(:first-child) > td {
          border-top: none;
        }
        input[type="checkbox"] {
          margin: 0.25rem;
        }
      `,
    ];
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("keydown", this._handleKeyboardEvent);
  }
  disconnectedCallback() {
    window.removeEventListener("keydown", this._handleKeyboardEvent);
    super.disconnectedCallback();
  }
  willUpdate(changes) {
    if (
      changes.has("data") ||
      changes.has("branchpath") ||
      changes.has("idpath") ||
      changes.has("filter") ||
      changes.has("rootId")
    ) {
      this._treeController.setData();
    }
    if (changes.has("hide")) {
      this._tableController.hideColumns(...(this.hide || []));
    }
  }
  private _dispatchCustomEvent(
    name: string,
    detail: any = {},
    bubbles = false,
    composed = true
  ) {
    const event = new CustomEvent(name, {
      detail,
      bubbles,
      composed,
    });
    this.dispatchEvent(event);
  }
  private _getContext(e?: Event) {
    const path = e?.composedPath() ?? [];
    const { id = this.hash.srcId } = path.find(elem => elem?.["dataset"]?.id)?.["dataset"] ?? {};
    return this._treeController.getContext(id);
  }
  private _handleKeyboardEvent = async (e: KeyboardEvent) => {
    const { key } = e;
    const { filteredIds, pathMap, ancestorMap } = this.hash;
    const ids = Array.from(
      this.shadowRoot.querySelectorAll<HTMLTableRowElement>("tr[data-id]")
    ).map((tr) => tr?.dataset?.id);
    const path = pathMap[this._selectedId] || [];
    const indexOfFocused = ids.indexOf(this._selectedId);
    const nextId = ids[indexOfFocused + 1] || ids[0];
    const lastId = ids[indexOfFocused - 1] || ids[ids.length - 1];
    const multiSelect = () =>
      (this._selectedIds = [...this._selectedIds, this._selectedId]);
    switch (key) {
      case "ArrowDown": {
        if (e.shiftKey) {
          multiSelect();
        }
        this._selectedId = nextId;
        break;
      }
      case "ArrowUp": {
        if (e.shiftKey) {
          multiSelect();
        }
        this._selectedId = lastId;
        break;
      }
      case "ArrowRight": {
        this._dispatchCustomEvent("cellchange", {
          id: this._selectedId,
          path: [...path, "showingChildren"],
          value: true,
        });
        break;
      }
      case "ArrowLeft": {
        this._dispatchCustomEvent("cellchange", {
          id: this._selectedId,
          path: [...path, "showingChildren"],
          value: false,
        });
        break;
      }
      case "Delete": {
        this._dispatchCustomEvent("delete", {
          id: this._selectedId,
          path,
        });
        //this._selectedId = nextId;
      }
      case "Enter": {
        if (e.shiftKey) {
          this._dispatchCustomEvent("add", {
            id: ancestorMap[this._selectedId].slice(-1)[0],
            path,
          });
        } else if (e.ctrlKey) {
        }
        break;
      }
      case "Escape": {
        this._selectedId = null;
        this._selectedIds = [];
      }
    }
  };
  private _handleFocusin(e: FocusEvent) {
  }
  private _handleFocusout(e: FocusEvent) {

  }
  private _handleClick(e: MouseEvent) {
    const path = e.composedPath();
    const [target] = path;
    if (target instanceof HTMLElement) {
      const td = target.closest("td");
      const tr = target.closest("tr");
      if (td && tr) {
        const data = Object.assign({}, td?.dataset, tr?.dataset);
        const { id } = tr?.dataset;
        this._dispatchCustomEvent("cellclick", {
          e,
          ...data,
        });
        this._selectedId = id;
      }
    }
  }
  private _handleContextmenu(e: MouseEvent) {
    const actions = [
      this._actionEdit(e),
      this._actionToggleOpen(e),
      this._actionAddChild(e),
      this._actionMakeContainer(e),
      this._actionDelete(e),
    ];
    const container = document.createElement("div");
    document.body.append(container);
    const template = html`<action-menu .actions=${actions} ${popper(e)}> </action-menu>`
    const closeMenuHandler = (e) => {
      container.remove();
      window.removeEventListener(e.type, closeMenuHandler);
    };
    window.addEventListener("click", closeMenuHandler, true);
    window.addEventListener("contextmenu", closeMenuHandler, true);
    e.preventDefault();
    render(template, container);
  }
  private _actionToggleOpen(e?: Event) {
    const { id, path, value } = this._getContext(e);
    const { isContainer, showingChildren } = value;
    return {
      show: () => isContainer === true,
      callback: () => {
        this._dispatchCustomEvent("cellchange", {
          id: this._selectedId,
          path: [...path, "showingChildren"],
          value: !showingChildren,
        });
      },
      label: `${showingChildren === true ? "Close" : "Open"} Container`,
    };
  }
  private _actionDelete(e?: Event) {
    const ctx = this._getContext(e);
    return {
      show: () => true,
      callback: () => {
        this._dispatchCustomEvent("delete", ctx);
      },
      label: "Delete",
    };
  }
  private _actionEdit(e?: Event) {
    const ctx = this._getContext(e);
    return {
      show: () => true,
      callback: () => this._dispatchCustomEvent("edit", ctx),
      label: "Edit"
    }
  }
  private _actionAddChild(e?: Event) {
    const { id, path, value } = this._getContext(e);
    const { isContainer, showingChildren } = value;
    return {
      show: () => isContainer === true,
      callback: () => {
        this._dispatchCustomEvent("add", {
          path,
        });
      },
      label: "Add Child",
    };
  }
  private _actionMakeContainer(e?: Event) {
    const { id, path, value } = this._getContext(e);
    const { isContainer, showingChildren } = value;
    return {
      show: () => isContainer !== true,
      callback: () => {
        this._dispatchCustomEvent("cellchange", {
          id,
          path: [...path, "isContainer"],
          value: true
        })
      },
      label: "Make Container"
    };
  }
  private _actionEjectContainer() {
    return {};
  }
  private _readData(): Cell[] {
    if (this.template) {
      if (this.template instanceof Array) {
      } else {
        return Object.entries(this.template).map(([key, value]) => {
          if (value instanceof Array) {
            const [type] = value;
            const toggle = value.includes("toggle");
            const fixed = value.find((v) => v?.startsWith?.("fixed"));
            const project = (v) => {
              if (fixed && v) {
                const [_, to] = fixed.split("(").slice(1, -1);
                return +v.toFixed(to);
              }
              const mathfunc = value.find(
                (arg) => typeof Math[arg] === "function"
              );
              if (mathfunc) return Math[mathfunc](v);
              return v;
            };
            return [type, key.split("."), project, toggle];
          }
        });
      }
    } else {
    }
  }
  private _getSetupInfo(): Cell[] {
    return this._readData();
  }
  private _renderRepItems(template: (id: string) => TemplateResult) {
    const { filteredIds } = this.hash;
    return repeat(filteredIds, (id) => id, template);
  }
  private _renderTable() {
    const rows = this._renderRepItems((id) => this._renderTableRow(id));
    return html`
      <div class=${tw`table whitespace-nowrap`}>
        <slot name="colgroup"></slot>
        <caption>
          <slot name="caption"></slot>
        </caption>
        <div class=${tw`table-header-group`}>
          <slot></slot>
        </div>
        <div class=${tw`table-row-group`}>${rows}</div>
        <div class=${tw`table-footer-group`}>
          <slot name="tfoot"></slot>
        </div>
      </div>
    `;
  }
  private _renderTableRow(id: string) {
    const { ancestorMap, filteredIds, hashMap, pathMap } = this.hash;
    const rowPath = pathMap[id];
    const cells = this._getSetupInfo();
    const showing = ancestorMap[id]
      .filter((id) => filteredIds.includes(id))
      .map((id) => hashMap[id])
      .map((value) => value.showingChildren)
      .every((value) => value === true);
    if (showing) {
      const baseClass = apply`hover:bg-red-200`;
      const classes = {
        [tw`${baseClass}`]: true,
        [tw`bg-red-200!`]: this._selectedIds.includes(id),
        [tw`bg-blue-200!`]: id === this._selectedId,
      };
      const tds = cells
        .map((setup) => {
          if (setup instanceof Array) {
            const [type, cellPath, project, toggle] = setup;
            return this._renderCell(id, type, cellPath, project, toggle);
          }
        })
        .filter((_, i) => !this.hide?.includes(i));
      return html`
        <tr
          draggable="true"
          data-path=${rowPath.join(".")}
          data-id=${id}
          class=${classMap(classes)}
        >
          ${tds}
        </tr>
      `;
    } else {
    }
  }
  private _renderCell(
    id,
    type: CellType,
    cellPath: Path,
    project = (v) => v,
    toggle
  ) {
    const { pathMap, indentMap } = this.hash;
    const rowPath = pathMap[id];
    const absolutePath = [...rowPath, ...cellPath];
    const { src } = this.hash;
    const rowValue = getValueAtPath(src, rowPath);
    let cellValue = getValueAtPath(
      type === "output" ? this.processed?.[id] : rowValue,
      cellPath
    );
    cellValue = project(cellValue);
    const isContainer = getValueAtPath(rowValue, ["isContainer"]);
    const showingChildren = getValueAtPath(rowValue, ["showingChildren"]);
    const indent = indentMap[id];
    const handleToggle = ({ detail }) => {
      this._dispatchCustomEvent("cellchange", {
        id,
        path: [...rowPath, "showingChildren"],
        value: detail,
      });
    };
    const showToggle = toggle && isContainer === true;
    let toggleOffset = (indent + 1) * 16;
    if (showToggle) {
      toggleOffset -= 16;
    }
    if (!toggle) {
      toggleOffset = 0;
    }
    const toggleSwitch = html`
      <i class=${tw`text(red-700 center) font-bold`} @click=${handleToggle}>${showingChildren ? "↓" : "→"}</i>
    `;
    if (type === "checkbox") {
      cellValue = html`<input type="checkbox" .checked=${cellValue} />`
    } else if (type instanceof Array) {
      const options = type.map(([value, label = value]) => html`<option .selected=${cellValue === value} value=${value}>${label}</option>`)
      cellValue = html`
        <select>${options}</select>
      `
    }
    const actions = [
      "ACTION_LOG",
      "ACTION_TOGGLE_OPEN",
      "ACTION_ADD_CHILD",
      "ACTION_DELETE",
    ]
    return html`
      <td
        data-actions=${actions.join(" ")}
        class=${tw`pl-[${toggleOffset}px]`}
        ?data-toggle=${toggle}
        data-type=${type}
        data-path=${absolutePath.join(".")}
        data-prop=${cellPath.join(".")}
        data-value=${cellValue}
      >
        ${showToggle ? toggleSwitch : undefined} ${cellValue}
      </td>
    `;
  }
  render() {
    return html`
      <div>
        ${this._renderTable()}
        <menu class=${tw`flex p-0 m-0`}>
        <i
          @click=${this._actionAddChild().callback}
          class=${tw`text-xl font-bold text-center p-1 text-red-500 hover:bg-green-500 hover:text-white`}
        >
          +
        </i>
      </menu>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "data-table": DataTable;
  }
}
