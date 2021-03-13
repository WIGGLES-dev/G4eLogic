export function parseGURPSRefernce() {
    let ref: string;
    ref = /( )/.test(ref) ? ref.split(" ")[0] : ref;
    ref = /,/.test(ref) ? ref.split(",")[0] : ref;
    ref = /\//.test(ref) ? ref.split("/")[0] : ref;
    const meta = ref.includes(":") ? ref.split(":") : [ref.split(/[0-9]+/)[0], ref.split(/^[^0-9]+/)[1]];
}