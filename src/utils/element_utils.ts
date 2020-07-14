export function stringToTemplate(xml: string | Element) {
    if (typeof xml === "string") {
        const template = document.createElement("template");
        xml.trim();
        template.innerHTML = xml;
        xml = template.content.firstChild as Element;
        return xml
    } else if (xml instanceof Element) {
        return xml
    }
}

export function stringToFragment(xml: string | Element) {
    const fragment = document.createDocumentFragment();
    if (typeof xml === "string") {
        const template = document.createElement("template");
        xml.trim();
        template.innerHTML = xml;
        xml = template.content.firstChild as Element;
        fragment.appendChild(xml);
    } else if (xml instanceof Element) {
        fragment.appendChild(xml);
    }
    return fragment
}