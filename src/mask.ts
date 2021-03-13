export class Mask<V, R = V> {
    value: V
    root: R
    constructor(value: V, root?: R) {
        this.value = value;
        this.root = root;
    }
}