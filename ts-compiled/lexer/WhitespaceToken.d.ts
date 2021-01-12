import { TypedToken } from "./Token";
export declare const WS = "ws";
export declare function newWhitespace(string: string): WhitespaceToken;
export declare function isWhitespace(token: any): token is WhitespaceToken;
export interface WhitespaceToken extends TypedToken {
    type: "ws";
}
export declare const singleWhitespaces: {
    " ": boolean;
    "\t": boolean;
    "\r": boolean;
    "\n": boolean;
};
export declare type SingleWhitespace = keyof typeof singleWhitespaces;
export declare function isSingleWhiteSpaceCharacter(c: string): c is SingleWhitespace;
