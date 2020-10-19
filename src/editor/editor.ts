import Editor from "@ui/Editor.svelte";

export class CharacterEditor {
    static app
    static frame: HTMLIFrameElement

    static character

    static create() { }

    static load() { }

    private static mountFrame(target: HTMLElement) {
        this.frame = target.appendChild(Object.assign(document.createElement("iframe"), {
            src: "about:blank",
            name: "valor character sheet"
        }));
        this.mountApp(this.frame.contentDocument.body);
    }

    private static mountApp(target: HTMLElement) {
        this.app = (new Editor({
            target,
            props: {
                editor: this
            }
        }));
    }

    static mount(target: HTMLElement, options: { [key: string]: any } = {}) {
        if (options.encapsulate) {
            this.mountFrame(target);
        } else {
            this.mountApp(target);
        }
    }
}