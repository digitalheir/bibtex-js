import { TypedToken } from "./Token";
export declare function newNumber(string: string): NumberToken;
export interface NumberToken extends TypedToken {
    type: "number";
}
export declare const numericChars: {
    "0": boolean;
    "1": boolean;
    "2": boolean;
    "3": boolean;
    "4": boolean;
    "5": boolean;
    "6": boolean;
    "7": boolean;
    "8": boolean;
    "9": boolean;
};
export declare type NumericChar = keyof typeof numericChars;
export declare function isNum(c: string): c is NumericChar;
