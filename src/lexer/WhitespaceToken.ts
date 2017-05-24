import {TypedToken} from "./Token";

export const WS = "ws";

export function newWhitespace(string: string): WhitespaceToken {
    return {
        type: "ws",
        string
    };
}

export function isWhitespace(token: any): token is WhitespaceToken {
    return typeof token.string === "string" && token.type === WS;
}


export interface WhitespaceToken extends TypedToken {
    type: "ws"
}

export const singleWhitespaces = {
    " ": true,
    "\t": true,
    "\r": true,
    "\n": true
};

export type SingleWhitespace = keyof typeof singleWhitespaces;

export function isSingleWhiteSpaceCharacter(c: string): c is SingleWhitespace {
    return singleWhitespaces.hasOwnProperty(c);
}
