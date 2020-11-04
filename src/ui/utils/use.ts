export function toTop(node: HTMLElement) {
    document.body.appendChild(node);
}

interface PathBindParams {

}
export function pathBind(node: HTMLElement, params: PathBindParams) {
    return {
        update(params: PathBindParams) { },
        destroy() { }
    }
}