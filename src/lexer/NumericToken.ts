export const NUMBER = "number";

import {TypedToken} from "./Token";

export function newNumber(string: string): NumberToken {
    return {
        type: "number",
        string
    };
}

export interface NumberToken extends TypedToken {
    type: "number"
}

export const numericChars = {
    "0": true,
    "1": true,
    "2": true,
    "3": true,
    "4": true,
    "5": true,
    "6": true,
    "7": true,
    "8": true,
    "9": true
};

export type NumericChar = keyof typeof numericChars;

export function isNum(c: string): c is NumericChar {
    return numericChars.hasOwnProperty(c);
}