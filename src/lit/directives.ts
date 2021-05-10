import { noChange, Part } from "lit";
import { DirectiveParameters, PartInfo, PartType } from "lit/directive";
import { AsyncDirective, directive } from "lit/async-directive";
import type { Observable } from "rxjs";
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
