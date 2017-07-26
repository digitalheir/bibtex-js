import {TypedToken, SpecialChar, isSpecialChar} from "./Token";

import {SingleWhitespace, isSingleWhiteSpaceCharacter} from "./WhitespaceToken";
import {isNum, NumericChar} from "./NumericToken";

export interface IdToken extends TypedToken {
    type: "id";
    string: string;
}

export function newIdToken(string: string): IdToken {
    return {
        type: "id",
        string
    };
}

export function isIdToken(string: any): string is IdToken {
    return string.type === "id" && typeof string.string === "string";
}

export function isIdChar(c: string): c is IdChar {
    return !(isSpecialChar(c) || isNum(c) || isSingleWhiteSpaceCharacter(c));
}

export type IdChar = SpecialChar | NumericChar | SingleWhitespace;
