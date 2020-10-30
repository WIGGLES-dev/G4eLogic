import Sheet from "@ui/Sheet.svelte";

export enum ValorEvent {
    Roll = "roll",
    Notify = "notify",
    Edit = "edit"
}

export class Valor {
    static Events = ValorEvent

    static sheets: Set<Sheet> = new Set()
    static elements
    static editors: Set<ValorEditor> = new Set()

    static components = {

    }

    static init() { return new ValorEditor() }

    // static getConfig(context?: SheetElement) {
    //     if (context?.sheet instanceof Sheet) {
    //         return context.sheet.config.getConfig()
    //     }
    //     return this.config
    // }
}

enum RollTypes {
    Parry = "parry",
    Attack = "attack",
    Block = "block",
    Damage = "damage"
}

interface Options {
    rolling: boolean
    notes: boolean
}

export class ValorEditor {
    app: Sheet
    frame: HTMLIFrameElement

    constructor() {
        Valor.editors.add(this);
    }

    on(event: ValorEvent, callback: (event: CustomEvent<any>) => void): () => void { return this.app.$on(event, callback) }
    set(props: { [key: string]: any }) { this.app.$set(props) }

    destroy() { Valor.editors.delete(this); }

    download(href, filename) {
        Object.assign(document.createElement("a"), {
            href,
            filename
        }).click();
    }

    upload() {
        return new Promise((resolve, reject) => {
            Object.assign(document.createElement("input"), {
                type: "file",
                async onchange() {
                    resolve(this.files)
                }
            }).click();
        });
    }

    private mountFrame(target: HTMLElement) {
        this.frame = target.appendChild(Object.assign(document.createElement("iframe"), {
            src: "about:blank",
            name: "valor character sheet"
        }));
        this.mountApp(this.frame.contentDocument.body);
    }

    private mountApp(target: HTMLElement, props: any = {}) {
        this.app = (new Sheet({
            target,
            props
        }));
    }

    mount(target: HTMLElement, options: { [key: string]: any } = {}) {
        if (options.encapsulate) {
            this.mountFrame(target);
        } else {
            this.mountApp(target, options);
        }
        return this
    }
}