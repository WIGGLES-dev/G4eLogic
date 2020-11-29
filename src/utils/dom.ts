import ContextMenu from "@ui/context-menu/ContextMenu.svelte";

export function upload() {
    return new Promise<FileList>((resolve, reject) => {
        Object.assign(document.createElement("input"), {
            type: "file",
            async onchange(this: HTMLInputElement) {
                resolve(this.files)
            }
        }).click();
    });
}

export function download(href: string, filename: string) {
    Object.assign(document.createElement("a"), {
        href,
        filename
    }).click();
}

export function bubbleFrameEvents(frame: HTMLIFrameElement) {
    frame.contentWindow.onmousemove = (e) => {
        const bounding = frame.getBoundingClientRect();
        const event = new MouseEvent("mousemove", {
            ...e,
            screenX: e.screenX + bounding.left,
            clientX: e.clientX + bounding.left,
            screenY: e.clientY + bounding.top,
            clientY: e.clientY + bounding.top,
        });
        window.dispatchEvent(event);
    }
    frame.contentWindow.onclick = (e) => {
        const bounding = frame.getBoundingClientRect();
        const event = new MouseEvent("click", {
            ...e,
            screenX: e.screenX + bounding.left,
            clientX: e.clientX + bounding.left,
            screenY: e.clientY + bounding.top,
            clientY: e.clientY + bounding.top,
        });
        window.dispatchEvent(event);
    }
    frame.contentWindow.onkeypress = (e) => {
        const event = new MouseEvent("keypress", {
            ...e
        });
        window.dispatchEvent(event);
    }
    frame.contentWindow.onmouseup = (e) => {
        const bounding = frame.getBoundingClientRect();
        const event = new MouseEvent("mouseup", {
            ...e,
            screenX: e.screenX + bounding.left,
            clientX: e.clientX + bounding.left,
            screenY: e.clientY + bounding.top,
            clientY: e.clientY + bounding.top,
        });
        window.dispatchEvent(event);
    }
    frame.contentWindow.onmousedown = (e) => {
        const bounding = frame.getBoundingClientRect();
        const event = new MouseEvent("mousedown", {
            ...e,
            screenX: e.screenX + bounding.left,
            clientX: e.clientX + bounding.left,
            screenY: e.clientY + bounding.top,
            clientY: e.clientY + bounding.top,
        });
        frame.parentElement.dispatchEvent(event);
    }
    frame.contentWindow.onscroll = (e) => {
        frame.ownerDocument.body.scrollTop = frame.ownerDocument.body.scrollHeight;
    }
}

export function getRoot(element: HTMLElement) {
    const rootNode = element.getRootNode()
    if (rootNode instanceof Document || rootNode.nodeName === "#document") {
        return (rootNode as Document).body
    } else if (rootNode instanceof ShadowRoot) {
        return rootNode.appendChild(document.createElement("div"));
    } else {
        return document.body
    }
}

export function createContextMenu(e: MouseEvent, options = []) {
    if (!(e.target instanceof HTMLElement) || !(options.length > 0)) return
    const menu = new ContextMenu({
        target: getRoot(e.target),
        props: {
            e,
            options
        }
    });
    menu.$on("close", () => menu.$destroy());
    return menu
}
export function createTooltip() { }
