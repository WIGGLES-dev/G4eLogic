export interface persistable<T> {
    loadXML: (xml: string | Element) => void;
    toXML: () => string | Element | DocumentFragment;
    loadJSON: (json: string | {}) => void;
    toJSON: () => string | {};
    toR20?: () => {};
}
