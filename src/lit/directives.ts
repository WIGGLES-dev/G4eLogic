import { noChange } from "lit";;
import { Part, PartType, Directive, directive } from "lit/directive.js";
import { AsyncDirective } from "lit/async-directive.js";
import type { Observable } from "rxjs";
import { createPopper, Instance, Modifier, OptionsGeneric } from "@popperjs/core";
import { VirtualElement } from "@utils/dom";
class ObserveDirective extends AsyncDirective {
  observable: Observable<unknown> | undefined;
  unsubscribe: (() => void) | undefined;
  render(observable: Observable<unknown>) {
    if (this.observable !== observable) {
      this.unsubscribe?.();
      this.observable = observable;
      this.subscribe(observable);
    }
    return noChange;
  }
  subscribe(observable: Observable<unknown>) {
    this.unsubscribe = observable.subscribe((v: unknown) => {
      this.setValue(v);
    }).unsubscribe;
  }
  disconnected() {
    this.unsubscribe!();
  }
  reconnected() {
    this.subscribe(this.observable!);
  }
}
export const observe = directive(ObserveDirective);

type PopperReference = Element | VirtualElement
class PopperDirective extends AsyncDirective {
  instance: Instance
  reference: PopperReference
  modifiers: any
  render(reference: PopperReference | MouseEvent, modifiers?: any) {
    if (this.__part.type == PartType.ELEMENT && reference !== null) {
      const { element } = this.__part
      if (typeof reference === "string") {
        reference = element.closest(reference);
      }
      this.reference = reference instanceof Element || reference instanceof VirtualElement ? reference : new VirtualElement(reference);
      this.modifiers = modifiers;
      this._createPopper();
    }
    return noChange
  }
  private _createPopper() {
    if (this.__part.type == PartType.ELEMENT) {
      const { element } = this.__part;
      if (element instanceof HTMLElement) {
        this.instance = createPopper(this.reference, element, this.modifiers);
      }
    }
  }
  disconnected() {
    this.instance?.destroy();
  }
  reconnected() {
    this._createPopper();
  }
}
export const popper = directive(PopperDirective);