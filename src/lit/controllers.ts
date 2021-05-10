import {
  ReactiveController,
  LitElement,
  ReactiveControllerHost,
  html,
  TemplateResult,
} from "lit";
import { datasetChangeObserver } from "@utils/dom";
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

  hostConnected() {}
  hostDisconnected() {}
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

  hostUpdate() {}
  hostConnected() {}
  hostDisconnected() {
    this._mutationObserver.disconnect();
  }
}

export class TreeController implements ReactiveController {
  host: LitElement;
  constructor(host: LitElement) {
    (this.host = host).addController(this);
  }

  private _handleDragstart() {}
  private _handleDragmove() {}
  private _handleDragenter() {}
  private _handleDrop() {}
  private _handleDragend() {}

  hostConnected() {}
  hostDisconnected() {}
}
