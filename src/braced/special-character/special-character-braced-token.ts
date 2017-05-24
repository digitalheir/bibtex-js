import {isArray, isString} from "../../../util";
import {Token} from "../../../lexer/TypedToken";

export interface SpecialCharBracedToken extends Token {
    type: "specialChar",
    data: any[],
    unicode: string
}

export function isBracedToken(x: any): x is SpecialCharBracedToken {
    return x.type === "specialChar" && isArray(x.data) && isString(x.unicode);
}

export function newBracedToken(data: any[], unicode: string): SpecialCharBracedToken {
    return {
        type: "specialChar",
        data,
        unicode
    };
}