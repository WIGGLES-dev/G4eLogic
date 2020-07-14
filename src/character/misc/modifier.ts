import { Trait } from "../trait"
import { Item } from "../equipment"

export type Modifiable = Trait | Item
export abstract class Modifier<T extends Modifiable> {
    static version = 2

    enabled: boolean
    name: string
    reference: string
    notes: string
    categories: Set<string>

    owner: T

    constructor(owner: T) {
        this.owner = owner
        this.categories = new Set();
    }

    loadXML(element: string | Element) {
        if (typeof element === "string") {
            const template = document.createElement("template");
            element.trim();
            template.innerHTML = element;
            element = template.content.firstChild as Element;
        }

        this.name = element.querySelector(":scope > name")?.textContent ?? "";
        this.reference = element.querySelector(":scope > reference")?.textContent ?? "";
        this.enabled = !(element.getAttribute("enabled") === "no");
        this.notes = element.querySelector(":scope > notes")?.textContent ?? "";

        const categories = Array.from(element.querySelectorAll(":scope > category > categories"))
        const categoryList: Set<string> = new Set();
        categories.forEach(category => categoryList.add(category.textContent));
        this.categories = categoryList;

        return this
    }

    toXML(): Element | DocumentFragment {
        const fragment = document.createDocumentFragment();
        fragment.appendChild(document.createElement("name")).textContent = this.name ?? "";
        if (this.reference) fragment.appendChild(document.createElement("reference")).textContent = this.reference;
        if (this.categories.size > 0) {
            const categories = fragment.appendChild(document.createElement("categories"))
            this.categories.forEach(category => {
                categories.appendChild(document.createElement("category")).textContent = category;
            });
        }
        return fragment
    }

    loadJSON(object: any) {
        function mapModifier(object: any, modifier: Modifier<T>): Modifier<T> {
            modifier.name = object.name;
            modifier.reference = object.reference;
            modifier.notes = object.notes;
            modifier.enabled = !object.disabled;
            return modifier
        }
        mapModifier(object, this);
    }

    toJSON() {

    }

    static extractValue(value: string) {
        if (typeof value === "string") {
            let numArr = value.match(/(\d+)/);
            return parseFloat(numArr[0])
        } else {
            return null
        }
    }
}
