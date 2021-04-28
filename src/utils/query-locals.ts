const locals = {
    add(input, ...numbers) {
        return numbers.reduce((a, b) => a + b, input)
    },
    subtract(input, ...numbers) {
        return numbers.reduce((a, b) => a - b, input)
    },
    multiply(input, ...numbers) {
        return numbers.reduce((a, b) => a * b, input)
    },
    divide(input, ...numbers) {
        return numbers.reduce((a, b) => a / b, input)
    },
    then(input, thenValue, elseValue) {
        return input ? thenValue : elseValue
    },
    pluck(input, ...properties) {
        return properties.reduce((a, b) => a[b], input)
    },
    select(input, ...properties) {
        if (Array.isArray(input)) {
            return input.flatMap(value => locals.select.call(this, value, ...properties))
        } else {
            return properties.map(prop => input[prop])
        }
    },
    call(input, method: string, ...args: any[]) {
        input[method].call(input, ...args);
    },
    apply(input, method: string, args: any[]) {
        input[method].apply(input, args)
    },
    debug(input, message) {
        console.group(message, this, input);
        return input
    }
}