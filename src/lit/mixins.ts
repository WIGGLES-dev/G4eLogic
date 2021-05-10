import { LitElement, TemplateResult } from "lit";

type Constructor<T = {}> = new (...args: any[]) => T;
function isTemplateResult(obj: unknown): obj is TemplateResult {
  return (
    typeof obj === "object" &&
    "_$litType$" in obj &&
    "string" in obj &&
    "values" in obj
  );
}
export function autoObserve<TBase extends Constructor<LitElement>>(
  Base: TBase
) {
  class AutoObserveMixin extends Base {
    constructor(...args) {
      super(...args);
    }

    render() {
      const _render = super.render();
      console.log(_render);
      if (isTemplateResult(_render)) {
        for (const value of _render.values) {
        }
      }
      return _render;
    }
  }
  return AutoObserveMixin as TBase;
}
