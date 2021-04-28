import { makeIframe } from "@utils/dom";
const vSheetDefaultOptions = {
    classes: ["foundry-valor"],
    template: "systems/GURPS/templates/holder.html",
    width: 1330,
    height: 700,
    submitOnChange: false
} as BaseEntitySheet.Options;
export class VActorSheet extends ActorSheet {
    constructor(...args) {
        //@ts-ignore
        super(...args);
    }
    static get defaultOptions() {
        return mergeObject(ActorSheet.defaultOptions, vSheetDefaultOptions)
    }
    activateListeners(jquery) {
        super.activateListeners(jquery);
        const element = jquery[0];
        const { actor } = this;
        const { origin } = game["GURPS"]["origin"] || {};
        const iframe = makeIframe({
            origin,
            slug: `/#/edit/${actor.data.type}/${actor.id}?hideMenu=true`,
        });
        const sheet = element.closest(".foundry-valor");
        const setFrameInactive = e => iframe.style.pointerEvents = "none";
        const setFrameActive = e => iframe.style.pointerEvents = "all";
        sheet.onmousedown = setFrameInactive;
        sheet.onmouseup = setFrameActive;
        element.append(iframe);
    }
    render(force = false, options = {}) {
        if (this.rendered) return
        return super.render(force, options)
    }
}
export class VActor extends Actor {
    constructor(...args) {
        super(...args);
    }
    prepareData(...args) {
        //@ts-ignore
        super.prepareData(...args);
        const speed = this.data.data?.attributeLevels?.speed;
        const dexterity = this.data.data?.attributeLevels?.dexterity
        const health = this.data.data?.attributeLevels?.health;
        mergeObject(
            this.data.data,
            {
                initiative: speed + (dexterity + health) / 4
            }
        );
    }
}
export class VItemSheet extends ItemSheet {
    constructor(...args) {
        //@ts-ignore
        super(...args)
    }
    static get defaultOptions() {
        return mergeObject(ItemSheet.defaultOptions, vSheetDefaultOptions)
    }
    activateListeners(jquery) {
        super.activateListeners(jquery);
        const element = jquery[0];
        const { item } = this;
        const { origin } = game["GURPS"]["origin"] || {};
        const iframe = makeIframe({
            origin,
            slug: `/#/edit/${item.data.type}/${item.id}?hideMenu=true`,
        });
        const handle = element.closest(".foundry-valor").querySelector(".window-resizable-handle");
        handle.onmousedown = e => iframe.style.pointerEvents = "none";
        handle.onmouseup = e => iframe.style.pointerEvents = "all";
        iframe.onclick = e => jquery.click();
        element.append(iframe);
    }
    render() {
        if (this.rendered) return
        return super.render(...arguments)
    }
}
export class VApp extends Application {
    constructor(...args) {
        super(...args)
    }
    static get defaultOptions() {
        return mergeObject(ActorSheet.defaultOptions, vSheetDefaultOptions)
    }
}
export class VItem extends Item {
    constructor(...args) {
        super(...args)
    }
}