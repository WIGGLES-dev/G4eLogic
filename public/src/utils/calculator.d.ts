export declare enum Operators {
    Add = "+",
    Subtract = "-",
    Multiply = "*",
    Divide = "/",
    Modulo = "%",
    Exponentional = "^",
    Ceil = "ceil",
    Floor = "floor"
}
export declare enum CalculatorModes {
}
declare type Input = (string | number)[];
export interface Operation {
    operator: Operators;
    args: Input;
}
export declare class Calculator {
    static operators: typeof Operators;
    static modes: typeof CalculatorModes;
    value: number;
    constructor(value?: number);
    add(...args: Input): this;
    [Operators.Add]: (...args: Input) => this;
    subtract(...args: Input): this;
    [Operators.Subtract]: (...args: Input) => this;
    multiply(...args: Input): this;
    [Operators.Multiply]: (...args: Input) => this;
    divide(...args: Input): this;
    [Operators.Divide]: (...args: Input) => this;
    modulo(...args: Input): this;
    [Operators.Modulo]: (...args: Input) => this;
    exponential(...args: Input): this;
    [Operators.Exponentional]: (...args: Input) => this;
    ceil(): this;
    floor(): this;
    batch(operations: Operation[]): this;
}
export {};
