import {BracedString} from "./BracedString";
import {QuotedString} from "./QuotedString";
import {mustBeString, isString, isArray, isNumber} from "../../util";
import {isStringRef, StringRef} from "./StringRef";
import {WhitespaceString} from "./WhitespaceString";
import {isWhitespace} from "../../lexer/WhitespaceToken";
import {isIdToken} from "../../lexer/IdToken";

export type ComplexString = Stringy | Stringy[];

export type Stringy = string | number | QuotedString | BracedString | WhitespaceString | StringRef ;

function flatten(x: any[]): any[] {
    let flattened: any[] = [];
    x.forEach((el: any) => {
        if (isArray(el)) {
            flattened = flattened.concat(flatten(el));
        } else
            flattened.push(el);
    });
    return flattened;
}

export function parseComplexStringOuter(obj: any): Stringy[] {
    if (isString(obj)) return [obj];

    switch (mustBeString(obj.type)) {
        case "quotedstringwrapper":
        case "bracedstringwrapper":
            if (!isArray(obj.data))
                throw new Error("Expect array for data: " + JSON.stringify(obj));

            return obj.data.map(parseStringy);
        default:
            throw new Error("Unexpected complex string type: " + obj.type);
    }
}

export function parseStringy(obj: any): Stringy {
    if (isString(obj)) return obj;
    if (isNumber(obj)) return obj;

    if (isStringRef(obj)) return obj;
    if (isWhitespace(obj)) return obj;
    if (isIdToken(obj)) return obj.string;

    switch (mustBeString(obj.type, obj)) {
        case "quotedstring":
        case "bracedstring":
        case "braced":
            if (!isArray(obj.data)) {
                throw new Error("Expect array for data: " + JSON.stringify(obj));
            }
            return {
                type: obj.type,
                data: flatten(obj.data).map(parseStringy)
            };
        default:
            throw new Error("Unexpected complex string type: " + obj.type);
    }
}