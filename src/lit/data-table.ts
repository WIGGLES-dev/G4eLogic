import { directive } from "lit/async-directive";
import { TableController } from "./controllers";
import { html, css, TemplateResult } from "lit";
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
import "./toggle-switch";
import "./form-control";
import "./custom-dialog";
import { CustomDialog } from "./custom-dialog";
import { TemplateController } from "./controllers";

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
  fromAttribute() {},
  toAttribute() {},
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
  hash: TreeHash<any>;
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
  private _contextId: string;
  @state()
  private _editId: string;
  @state()
  private _selectedId: string;
  @state()
  private _selectedIds: string[] = [];
  @state()
  private _inlineEditId: string;
  private _dialog = createRef<CustomDialog>();
  private _tableController = new TableController(this);
  private _templateController = new TemplateController(this);
  constructor() {
    super();
    this.addEventListener("dragstart", this._handleDragstart);
    this.addEventListener("dragover", this._handleDragover);
    this.addEventListener("dragenter", this._handleDragenter);
    this.addEventListener("drop", this._handleDrop);
    this.addEventListener("dragend", this._handleDragend);
    this.addEventListener("click", this._handleClick);
    //this.addEventListener("contextmenu", this._handleContextmenu);
    //this.addEventListener("dblclick", this._handleDoubleclick);
    this.addEventListener("input", this._handleInput);
    this.addEventListener("focusin", this._handleFocusin);
  }
  static get styles() {
    return [
      super.styles,
      css`
        td {
          border: 0.5px solid black;
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
    window.addEventListener("resize", this._handleResize);
  }
  disconnectedCallback() {
    window.removeEventListener("keydown", this._handleKeyboardEvent);
    window.removeEventListener("keydown", this._handleResize);
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
      this._makeHash();
    }
    if (changes.has("hide")) {
      this._tableController.hideColumns(...(this.hide || []));
    }
  }
  private _makeHash() {
    if (this.data && this.branchpath && this.idpath && this.filter) {
      this.hash = Tree.hash(
        this.data,
        this.branchpath,
        this.idpath,
        this.filter,
        this.maxDepth,
        this.rootId
      );
    }
  }
  updated(changes) {}
  private _dispatchCustomEvent(
    name: string,
    detail: any = {},
    bubbles = false,
    composed = true
  ) {
    const event = new CustomEvent(name, {
      detail: {
        ...this._getContext(),
        ...detail,
      },
      bubbles,
      composed,
    });
    this.dispatchEvent(event);
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
  private _handleResize = (e) => {
    if (innerWidth < 1000) {
    } else {
    }
  };
  private _handleFocusin(e: FocusEvent) {
    console.log(e);
  }
  private _handleInput(e: InputEvent) {
    const path = e.composedPath();
    const [target] = path;
    if (target instanceof HTMLElement) {
      const pathElem = closestElement(`[data-path]`, target);
      const idElem = closestElement(`[data-id]`, target);
      const { path, type } = pathElem?.["dataset"] ?? {};
      const { id } = idElem?.["dataset"] ?? {};
      let value = target["value"];
      if (target instanceof HTMLInputElement) {
        const type = target.getAttribute("type");
        if (type === "number") {
          value = +target.value;
        } else if (type === "checkbox") {
          value = target.checked;
        } else {
          value = target.value;
        }
      } else {
        const contenteditable = target.isContentEditable;
        if (contenteditable) {
          const { type } = target.dataset;
          if (type === "number") {
            value = +target.innerText;
          } else {
            value = target.innerText;
          }
        } else {
        }
      }
      if (path && id) {
        this._dispatchCustomEvent("cellchange", {
          id,
          path: path.split("."),
          value,
        });
      }
    }
  }
  private _handleDragstart(e: DragEvent) {
    const path = e.composedPath();
    const [target] = path;

    if (target instanceof HTMLElement) {
      const idElem = closestElement(`[data-id]`, target);
      if (idElem) {
        const { id } = idElem.dataset;
        const data = this._getContext(id);
        e.dataTransfer.setData("text/plain", JSON.stringify({ id }));
        e.dataTransfer.setData("application/json", JSON.stringify(data));
      }
    }
  }
  private _handleDragover(e: DragEvent) {
    if (this._isInsertOperation(e)) {
      e.dataTransfer.dropEffect === "link";
    } else {
      e.dataTransfer.dropEffect === "move";
    }
    e.preventDefault();
  }
  private _handleDragenter(e: DragEvent) {
    e.preventDefault();
  }
  private _isInsertOperation(e: DragEvent) {
    const path = e.composedPath();
    const [target] = path;
    if (target instanceof Element) {
      const tr = target.closest(`tr`);
      if (tr) {
        const { id } = tr.dataset;
        const { hashMap } = this.hash;
        const isContainer = hashMap[id]?.isContainer === true;
        const bbox = tr.getBoundingClientRect();
        const { clientX, clientY } = e;
        const elem = document.elementFromPoint(clientX, clientY);
        const onToggle = elem.matches("[data-toggle]");
        const inUpperHalf =
          clientY > bbox.top &&
          clientY < bbox.bottom &&
          clientY - bbox.top < bbox.height / 2;
        const inRightHalf =
          clientX > bbox.left &&
          clientX < bbox.right &&
          clientX - bbox.left < bbox.width / 2;
        if ((onToggle || inUpperHalf) && isContainer === true) {
          return true;
        } else {
          return false;
        }
      }
    }
  }
  private _handleDrop(e: DragEvent) {
    const path = e.composedPath();
    const [target] = path;
    if (target instanceof HTMLElement) {
      const { pathMap, hashMap, ids } = this.hash;
      const { dataTransfer } = e;
      const txt = dataTransfer.getData("text/plain");
      const { id: fromId, type } = JSON.parse(txt || "{}");
      const appJson = dataTransfer.getData("application/json");
      const data = JSON.parse(appJson || "{}");
      const idElem = closestElement(`[data-id]`, target);
      const { id: toId } = idElem?.["dataset"];
      const to = this._getContext(toId);
      const { ancestors } = to;
      if (!ancestors.includes(fromId) && fromId !== toId) {
        const insert = this._isInsertOperation(e);
        this._dispatchCustomEvent("move", {
          from: data,
          to,
          foreign: !ids.includes(fromId),
          insert,
        });
      }
    }
  }
  private _handleDragend(e: DragEvent) {}
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
  private _handleDoubleclick(e: MouseEvent) {
    const path = e.composedPath();
    const [target] = path;
    if (target instanceof HTMLElement) {
      const tr = target.closest("tr");
      if (tr) {
        const { id } = tr.dataset;
        this._inlineEditId = id;
      }
    }
  }
  private _handleContextmenu(e: MouseEvent) {
    const path = e.composedPath();
    const [target] = path;
    if (target instanceof HTMLElement) {
      this._editId = null;
      const idElem = closestElement(`[data-id]`, target);
      const { id } = idElem?.["dataset"] ?? {};
      this._contextId = id;
      e.preventDefault();
      this._dialog.value?.showModal();
    }
  }
  private _getContext(id = this._contextId) {
    const { pathMap, indexMap, hashMap, ancestorMap } = this.hash;
    const ancestors = ancestorMap[id];
    const [parent] = ancestors?.slice(-1) ?? [];
    const path = pathMap[id];
    const i = indexMap[id];
    const value = hashMap[id];
    return {
      id,
      ancestors,
      parent,
      path,
      i,
      value,
      hash: this.hash,
    };
  }
  private _actionLog() {
    return {
      show() {
        return true;
      },
      callback: () => {
        console.log(this._getContext());
        this._dialog.value?.close();
      },
      label: "Log",
    };
  }
  private _actionCloseMenu() {
    return {
      show: () => this._dialog.value?.open,
      callback: () => this._dialog.value?.close(),
      label: "Close",
    };
  }
  private _actionToggleOpen() {
    const activeId = () => this._getContext()?.id;
    const activeIsContainer = () =>
      this.hash.hashMap[activeId()]?.isContainer === true;
    const activeShowingChildren = () =>
      this.hash.hashMap[this._getContext()?.id]?.showingChildren;
    const activePath = () => this.hash.pathMap[activeId()] || [];
    return {
      show: activeIsContainer,
      callback: () => {
        this._dispatchCustomEvent("cellchange", {
          id: this._selectedId,
          path: [...activePath(), "showingChildren"],
          value: !activeShowingChildren(),
        });
        this._dialog.value?.close();
      },
      label: `${activeShowingChildren() === true ? "Close" : "Open"} Container`,
    };
  }
  private _actionDelete() {
    return {
      show: () => true,
      callback: () => {
        const { id, path } = this._getContext();
        this._dispatchCustomEvent("delete", {
          id,
          path,
        });
        this._dialog.value?.close();
      },
      label: "Delete",
    };
  }
  private _actionAddChild() {
    const activeId = () => this._getContext()?.id;
    const activeIsContainer = () =>
      this.hash.hashMap[activeId()]?.isContainer === true;
    const activeShowingChildren = () =>
      this.hash.hashMap[this._getContext()?.id]?.showingChildren;
    const activePath = () => this.hash.pathMap[activeId()] || [];
    return {
      show: activeIsContainer,
      callback: () => {
        this._dispatchCustomEvent("add", {
          path: activePath(),
        });
        this._dialog.value?.close();
      },
      label: "Add Child",
    };
  }
  private _actionEdit() {
    return {
      show: () => true,
      callback: async () => {
        this._dispatchCustomEvent("edit", {
          ...this._getContext(),
        });
        this._editId = this._getContext()?.id;
      },
      label: "Edit",
    };
  }
  private _actionMakeContainer() {
    return {};
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
      <toggle-switch @toggle=${handleToggle} ?toggled=${showingChildren}>
      </toggle-switch>
    `;
    if (typeof cellValue === "boolean") {
      //cellValue = cellValue ? "✔" : "✖";
    }
    return html`
      <td
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
    const actionSet1 = [
      this._actionLog(),
      this._actionEdit(),
      this._actionToggleOpen(),
      this._actionAddChild(),
      this._actionDelete(),
      this._actionCloseMenu(),
    ];
    const closeDialog = () => {
      this._dialog.value?.close();
    };
    let dialogContent: TemplateResult;
    if (this._editId) {
      dialogContent = html`
        <slot name="edit"></slot>
        <button
          class=${tw`w-full bg-gray-500 text-white`}
          @click=${closeDialog}
        >
          Close
        </button>
      `;
    } else {
      dialogContent = html`
        <action-menu .actions=${actionSet1}> </action-menu>
      `;
    }
    const dialog = html`
      <custom-dialog ${ref(this._dialog)} class=${tw`p-0`}>
        ${dialogContent}
      </custom-dialog>
    `;
    const actionSet2 = [
      {
        show: () => true,
        callback: () => {
          this._dispatchCustomEvent("add", {
            path: this.hash.pathMap[this.rootId] || [],
          });
        },
        label: "＋",
        classes: tw`text(lg red-700)`,
      },
    ];
    const tableMenu = html`
      <action-menu .actions=${actionSet2} flex> </action-menu>
    `;
    return html`<div class=${tw`w-min`}>
      ${dialog} ${this._renderTable()} ${tableMenu}
    </div> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "data-table": DataTable;
  }
}
