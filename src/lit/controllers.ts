import {
  ReactiveController,
  LitElement,
  ReactiveControllerHost,
  html,
  TemplateResult,
} from "lit";
import { closestElement, datasetChangeObserver } from "@utils/dom";
import { Tree, TreeHash } from "@utils/tree";
import { Path } from "@app/utils/path";
export class TableController implements ReactiveController {
  host: LitElement;
  constructor(host: LitElement) {
    (this.host = host).addController(this);
  }
  private _hideCells(...indexes: number[]) {
    const slots = Array.from(
      this.host.shadowRoot.querySelectorAll("slot")
    ).flatMap((slot) => slot.assignedElements({ flatten: true }));
    const cells = this.host.shadowRoot.querySelectorAll<HTMLTableCellElement>(
      "td,th"
    );
    slots
      .flatMap((element) =>
        Array.from(element.querySelectorAll<HTMLTableCellElement>("td,th"))
      )
      .concat(Array.from(cells))
      .forEach((cell) => {
        const display = indexes.includes(cell.cellIndex) ? "none" : null;
        cell.style.display = display;
      });
  }

  hideColumns(...indexes: number[]) {
    this._hideCells(...indexes);
  }

  hostConnected() { }
  hostDisconnected() { }
}

export class DatasetController implements ReactiveController {
  host: LitElement;
  observeredKeys: string[];
  mutationObserver = new MutationObserver(
    this._datasetChangeObserver.bind(this)
  );
  constructor(host: LitElement, ...keys: string[]) {
    (this.host = host).addController(this);
    this.observeredKeys = keys;
  }

  private _datasetChangeObserver(
    mutations: MutationRecord[],
    observer: MutationObserver
  ) {
    const datasetChange = mutations.some((mutation) =>
      mutation.attributeName.includes("data-")
    );
    if (datasetChange) {
      this.host.requestUpdate();
    }
  }

  hostConnected() {
    this.mutationObserver.observe(this.host);
  }
  hostDisconnected() {
    this.mutationObserver.disconnect();
  }
}

export class TemplateController implements ReactiveController {
  private static FunctionCache: WeakMap<HTMLElement, Function> = new WeakMap();
  host: LitElement;
  private _mutationObserver = new MutationObserver(
    this._handleTemplateMutation
  );
  constructor(host: LitElement) {
    (this.host = host).addController(this);
  }

  private _handleTemplateMutation(
    mutations: MutationRecord[],
    observer: MutationObserver
  ) {
    for (const { target } of mutations) {
      if (target instanceof HTMLElement) {
        TemplateController.FunctionCache.set(
          target,
          this._parseTemplate(target.innerHTML)
        );
      }
    }
    this.host.requestUpdate();
  }

  private _parseTemplate(template: string) {
    const regex = /\$\{.+?}/g;
    const parts = regex.exec(template);
    const params = parts
      .map((part) => part.slice(2, -1))
      .filter((result) => !result.includes(".") && !result.includes("["));
    const func = new Function(
      "__$html$__",
      ...params,
      "return __$html$__" + "`" + template + "`"
    );
    return func;
  }

  private _getTemplate(selector: string | HTMLElement) {
    if (typeof selector === "string") {
      return (
        this.host.querySelector<HTMLElement>(selector) ||
        document.querySelector<HTMLElement>(selector)
      );
    } else {
      return selector;
    }
  }

  private _getTemplateFunction(element: HTMLElement) {
    if (!TemplateController.FunctionCache.has(element)) {
      this._mutationObserver.observe(element);
      TemplateController.FunctionCache.set(
        element,
        this._parseTemplate(element.innerHTML)
      );
    }
    return TemplateController.FunctionCache.get(element);
  }

  render(selector: string | HTMLElement, record: Record<string, any>) {
    const element = this._getTemplate(selector);
    const templateFunction = this._getTemplateFunction(element);
    if (typeof templateFunction === "function") {
      return templateFunction.call(this.host, html, ...Object.values(record));
    } else {
      return html` <pre>You Have Not Provided A Template</pre> `;
    }
  }

  hostUpdate() { }
  hostConnected() { }
  hostDisconnected() {
    this._mutationObserver.disconnect();
  }
}

interface TreeElement extends LitElement {
  data: any
  branchpath: Path
  idpath: Path
  filter: any
}
export class TreeController implements ReactiveController {
  host: TreeElement
  hash: TreeHash<any>
  constructor(host: TreeElement) {
    (this.host = host).addController(this);
    this.setData();
  }

  setData() {
    const { data, branchpath, idpath, filter } = this.host;
    if (data && branchpath && idpath && filter) {
      this.hash = Tree.hash(data, branchpath, idpath, filter);
    }
  }

  getContext(id) {
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
  private _isInsertOperation(e) {
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
  private _handleDragstart = (e) => {
    const path = e.composedPath();
    const [target] = path;
    if (target instanceof HTMLElement) {
      const idElem = closestElement(`[data-id]`, target);
      if (idElem) {
        const { id } = idElem.dataset;
        const data = this.getContext(id);
        e.dataTransfer.setData("text/plain", JSON.stringify({ id }));
        e.dataTransfer.setData("application/json", JSON.stringify(data));
      }
    }
  }
  private _handleDragover = (e) => {
    if (this._isInsertOperation(e)) {
      e.dataTransfer.dropEffect === "link";
    } else {
      e.dataTransfer.dropEffect === "move";
    }
    e.preventDefault();
  }
  private _handleDragenter = (e) => {
    e.preventDefault();
  }
  private _handleDrop = (e) => {
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
      const to = this.getContext(toId);
      const { ancestors } = to;
      if (!ancestors.includes(fromId) && fromId !== toId) {
        const insert = this._isInsertOperation(e);
        const event = new CustomEvent("move", {
          bubbles: false,
          composed: true,
          detail: {
            from: data,
            to,
            foreign: !ids.includes(fromId),
            insert
          }
        })
        this.host.dispatchEvent(event);
      }
    }
  }
  private _handleDragend = (e) => {

  }
  private _handleInput = (e) => {
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
      if (id && path) {
        const event = new CustomEvent("cellchange", {
          bubbles: false,
          composed: false,
          detail: {
            id,
            path: path.split("."),
            value
          }
        });
        this.host.dispatchEvent(event);
      }
    }
  }
  hostUpdate() {

  }
  hostConnected() {
    this.host.addEventListener("dragstart", this._handleDragstart);
    this.host.addEventListener("dragover", this._handleDragover);
    this.host.addEventListener("dragover", this._handleDragover);
    this.host.addEventListener("dragenter", this._handleDragenter);
    this.host.addEventListener("drop", this._handleDrop);
    this.host.addEventListener("dragend", this._handleDragend);
    this.host.addEventListener("input", this._handleInput);
  }
  hostDisconnected() {

  }
}

export type SupportedProtocols = "indexeddb";
export class DatabaseController implements ReactiveController {
  host: LitElement
  constructor(host: LitElement) {
    (this.host = host).addController(this);
  }

  hostConnected() { }
  hostDisconnected() { }
}

export class PopperController implements ReactiveController {
  host: LitElement
  constructor(host: LitElement) {
    (this.host = host).addController(this);
  }



  hostConnected() { }
  hostDisconnected() { }
}