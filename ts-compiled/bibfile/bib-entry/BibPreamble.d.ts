export declare class Preamble {
    readonly type: string;
    readonly data: any[];
    readonly string: string;
    constructor(data: any[]);
    toString(): string;
}
export declare function isPreamble(x: any): x is Preamble;
export declare function newPreambleNode(data: any): Preamble;
