import { noChange, Part } from "lit";
import { DirectiveParameters, PartInfo, PartType } from "lit/directive"
import { AsyncDirective, directive } from "lit/async-directive";
import { Observable } from "rxjs";
import { State } from "rxdeep";
class ObserveDirective extends AsyncDirective {
    observable: Observable<unknown> | undefined;
    unsubscribe: (() => void) | undefined;
    render(observable: Observable<unknown>) {
        if (this.observable !== observable) {
            this.unsubscribe?.();
            this.observable = observable
            this.subscribe(observable);
        }
        return noChange;
    }
    subscribe(observable: Observable<unknown>) {
        this.unsubscribe = observable
            .subscribe((v: unknown) => {
                this.setValue(v);
            })
            .unsubscribe;
    }
    disconnected() {
        this.unsubscribe!();
    }
    reconnected() {
        this.subscribe(this.observable!);
    }
}
export const observe = directive(ObserveDirective);

class BindDirective extends AsyncDirective {
    state: State<unknown> | undefined
    unsubscribe: (() => void) | undefined
    constructor(partInfo: PartInfo) {
        super(partInfo);
        if (partInfo.type === PartType.ELEMENT) {

        } else {

        }
    }
    render(state: State<unknown>) {
        if (this.state !== state) {
            this.unsubscribe?.();
            this.state = state;
            this.subscribe(state);
        }
    }
    update(part: Part, [state]: DirectiveParameters<this>) {
        if (part.type === PartType.ELEMENT) {
            const { element } = part;
            this.unsubscribe = state
                .subscribe((v: unknown) => {

                    this.setValue(v);
                })
                .unsubscribe
        } else {
            return noChange
        }
    }
    subscribe(state: State<unknown>) {

    }
    disconnected() {
        this.unsubscribe()
    }
    reconnected() {
        this.subscribe(this.state)
    }
}
export const bind = directive(BindDirective);