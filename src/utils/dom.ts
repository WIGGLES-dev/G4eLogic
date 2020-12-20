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

function createFrame(target: HTMLElement, props) {
    const frame = target.appendChild(Object.assign(document.createElement("iframe"), {
        width: props.height || "100%",
        height: props.width || "100%",
        src: props.src || "about:blank",
        name: props.name,
    }));
    const meta = document.createElement("meta");
    meta.setAttribute("charset", "utf-8")
    const styles = props.styles?.map(href => {
        return Object.assign(document.createElement("link"), {
            rel: "stylesheet",
            href
        })
    });
    const scripts = props.scripts?.map(src => {
        return Object.assign(document.createElement("script"), {
            src
        })
    });
    frame.contentDocument.head.append(meta, ...styles, ...scripts);
    frame.onmouseenter = () => frame.focus();
    frame.onmouseleave = () => window.focus();
    bubbleFrameEvents(frame);
    return frame
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

export function handleMessage<P>(message: MessageEvent, proxy: P) {
    try {
        const { data, source, origin } = message;
        if (source instanceof BroadcastChannel) {

        } else if (source instanceof Window) {

        }
        const { call, args } = data;
        if (typeof proxy[call] === "function") proxy[call].call(proxy, ...args)
    } catch (err) {
        console.log("An error occured while receiving a message", err);
    }
}