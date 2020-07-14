import {
    stringToTemplate
} from "../../utils/element_utils";
import {
    generateRowID,
    generateUUID
} from "../../utils/2R20";

export abstract class CharacterElement<T extends CharacterElement<T>> {
    uuid: string
    r20rowID: string

    reference: string
    userDescription: string
    notes: string
    categories: Set<string>

    constructor() {
        this.uuid = generateUUID().toString();
        this.r20rowID = generateRowID();
        this.categories = new Set();
    }

    toXML(): Element | DocumentFragment {
        const fragment = document.createDocumentFragment();
        if (this.reference) fragment.appendChild(document.createElement("reference")).textContent = this.reference;
        if (this.userDescription) fragment.appendChild(document.createElement("user_description")).textContent = this.userDescription;
        if (this.notes) fragment.appendChild(document.appendChild(document.createElement("notes"))).textContent = this.notes;
        if (this.categories.size > 0) {
            const categories = fragment.appendChild(document.createElement("categories"))
            this.categories.forEach(category => {
                categories.appendChild(document.createElement("category")).textContent = category;
            });
        }
        return fragment
    }

    loadXML(element: string | Element) {
        element = stringToTemplate(element);

        this.reference = element.querySelector(":scope > reference")?.textContent;
        this.userDescription = element.querySelector(":scope > user_description")?.textContent;
        this.notes = element.querySelector(":scope > notes")?.textContent
        const categories = Array.from(element.querySelectorAll(":scope > category > categories"))
        const categoryList: Set<string> = new Set();
        categories.forEach(category => categoryList.add(category.textContent));
        this.categories = categoryList;
    }
    toJSON() {

    }
    loadJSON(object: any) {
        this.reference = object.reference;
        this.userDescription = object.user_description;
        this.notes = object.notes;
        object?.categories?.forEach((category: any) => this.categories.add(category));
    }
}