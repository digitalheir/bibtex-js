import {isArray} from "../../util";
import {Token} from "../../lexer/TypedToken";

export interface BracedToken extends Token {
    type: "braced",
    data: any[]
}

export function isBracedToken(x: any): x is BracedToken {
    return x.type === "braced" && isArray(x.data);
}
