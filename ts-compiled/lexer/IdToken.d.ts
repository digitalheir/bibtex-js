import { TypedToken, SpecialChar } from "./Token";
import { SingleWhitespace } from "./WhitespaceToken";
import { NumericChar } from "./NumericToken";
export interface IdToken extends TypedToken {
    type: "id";
    string: string;
}
export declare function newIdToken(string: string): IdToken;
export declare function isIdToken(string: any): string is IdToken;
export declare function isIdChar(c: string): c is IdChar;
export declare type IdChar = SpecialChar | NumericChar | SingleWhitespace;
