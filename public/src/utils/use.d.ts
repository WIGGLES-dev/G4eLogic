import { State } from 'rxdeep';
import { Observable } from 'rxjs';
export declare type UseFunction<E extends Element, P = any> = (node: E, params: P) => UseFunctionReturn;
export interface UseFunctionReturn<P = any> {
    update: (params: P) => void;
    destroy: () => void;
}
export declare function use<E extends Element, P = any>(node: E, fn: UseFunction<E, P>, ctx: Observable<P>): void;
export declare function bind(node: HTMLElement, params: State<any>): {
    update(params: any): void;
    destroy(): void;
};
export declare function assign(node: HTMLElement, params: Record<string, any>): {
    update(params: any): void;
};
export declare function fragment(node: HTMLTemplateElement): {
    destroy(): void;
};
export declare function lift(node: HTMLElement, params?: number): {
    destroy(): void;
};
export declare function colSpanMax(node: HTMLTableCellElement | HTMLTableHeaderCellElement): void;
export declare function droptarget(node: HTMLElement): {
    destroy(): void;
};
export declare function stream(node: HTMLElement, params: any): {
    destroy(): void;
    update(params: any): void;
};
