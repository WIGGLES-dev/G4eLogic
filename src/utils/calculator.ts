export enum Operators {
    Add = "+",
    Subtract = "-",
    Multiply = "*",
    Divide = "/",
    Modulo = "%",
    Exponentional = "^",
    Ceil = "ceil",
    Floor = "floor"
}
export enum CalculatorModes {

}
type Input = (string | number)[]
export interface Operation {
    operator: Operators
    args: Input
}
export class Calculator {
    static operators = Operators
    static modes = CalculatorModes
    value: number
    constructor(value: number = 0) {
        this.value = value;
    }
    add(...args: Input) {
        for (const arg of args) {
            this.value = this.value + +arg
        }
        return this
    }
    [Operators.Add] = this.add
    subtract(...args: Input) {
        for (const arg of args) {
            this.value = this.value - +arg;
        }
        return this
    }
    [Operators.Subtract] = this.subtract
    multiply(...args: Input) {
        for (const arg of args) {
            this.value = this.value * +arg;
        }
        return this
    }
    [Operators.Multiply] = this.multiply
    divide(...args: Input) {
        for (const arg of args) {
            this.value = this.value / +arg
        }
        return this
    }
    [Operators.Divide] = this.divide
    modulo(...args: Input) {
        for (const arg of args) {
            this.value = this.value % +arg
        }
        return this
    }
    [Operators.Modulo] = this.modulo
    exponential(...args: Input) {
        for (const arg of args) {
            this.value = Math.pow(this.value, +arg)
        }
        return this
    }
    [Operators.Exponentional] = this.exponential
    ceil() {
        this.value = Math.ceil(this.value);
        return this
    }
    floor() {
        this.value = Math.floor(this.value)
        return this
    }
    batch(operations: Operation[]) {
        for (const { operator, args } of operations) {
            this[operator](...args)
        }
        return this
    }
}