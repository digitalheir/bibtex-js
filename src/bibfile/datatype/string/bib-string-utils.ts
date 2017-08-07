import {isStringRef, StringRef} from "./StringRef";
import {isBracedString, isOuterBracedString, BracedString} from "./BracedString";
import {isOuterQuotedString, isQuotedString, QuotedString} from "./QuotedString";
import {flattenMyArray, isArray, isNumber, isString, mustBeString} from "../../../util";
import {BibStringComponent} from "./BibStringComponent";
import {BibStringData, BibStringDatum} from "./BibStringData";

export function isBibStringComponent(x: any): x is BibStringComponent {
    return typeof x.braceDepth === "number" && typeof x.type === "string";
}

export interface ContiguousSimpleString {
    type: "ContiguousSimpleString";
    data: (number | string)[];
}

export function isContiguousSimpleString(x: any): x is ContiguousSimpleString {
    return x.type === "ContiguousSimpleString" && isArray(x.data);
}

export function joinContiguousSimpleStrings(x: ContiguousSimpleString): string {
    return x.data.join("");
}


export function parseStringComponent(braceDepth: number, obj: any): BibStringComponent | string | number | StringRef {
    if (isNumber(obj) || isString(obj))
        return /*new BibStringComponent(typeof obj, braceDepth, [*/obj/*])*/;

    if (isStringRef(obj))
        return new StringRef(0, obj.stringref);
    // if (isWhitespace(obj)) return obj;
    // if (isIdToken(obj)) return obj.string;

    switch (mustBeString(obj.type, obj)) {
        case "id":
        case "ws":
        case "number":
            return mustBeString(obj.string);
        case "bracedstring":
        case "braced":
            if (!isArray(obj.data)) {
                throw new Error("Expect array for data: " + JSON.stringify(obj));
            }
            return new BracedString(braceDepth, flattenMyArray(obj.data).map(e => parseStringComponent(braceDepth + 1, e)));
        case "quotedstring":
            if (!isArray(obj.data)) {
                throw new Error("Expect array for data: " + JSON.stringify(obj));
            }
            const flattened = flattenMyArray(obj.data);
            return new QuotedString(braceDepth, flattened.map(e => parseStringComponent(braceDepth, e)));
        default:
            throw new Error("Unexpected complex string type: " + obj.type);
    }
}

export function toStringBibStringDatum(data: BibStringDatum): string {
    if (isString(data))
        return data;
    if (isNumber(data))
        return data + "";
    if (
        isBracedString(data)
        || isQuotedString(data)
        || isOuterQuotedString(data)
        || isOuterBracedString(data)
    )
        return toStringBibStringData(data.data);

    throw new Error(JSON.stringify(data));
}

export function toStringBibStringData(data: BibStringData) {
    return data.map(toStringBibStringDatum).join("");
}

export function flattenQuotedStrings(data: BibStringData, hideQuotes?: boolean): BibStringData {
    let result: BibStringData = [];
    for (const datum of data) {
        const flattenned = flattenQuotedString(datum, hideQuotes);
        if (isArray(flattenned)) {
            result = result.concat(flattenned);
        } else {
            result.push(flattenned);
        }
    }
    return result;
}

const doubleQuotes: BibStringDatum[] = ["\""];

function flattenQuotedString(data: BibStringDatum, hideQuotes?: boolean): BibStringDatum | BibStringData {
    if (isBracedString(data))
        return data;
    if (isQuotedString(data)) {
        const flattenedQuotedString: BibStringData = flattenQuotedStrings(data.data, true);
        if (isArray(flattenedQuotedString)) {
            return hideQuotes
                ? flattenedQuotedString
                : doubleQuotes.concat(flattenedQuotedString).concat(doubleQuotes);
        } else if (hideQuotes)
            return flattenedQuotedString;
        else
            return ["\"", flattenedQuotedString, "\""];
    }
    if (isOuterQuotedString(data))
        return flattenQuotedStrings(data.data, true);
    if (isOuterBracedString(data))
        return flattenQuotedStrings(data.data, false);
    if (isString(data) || isNumber(data))
        return data;
    if (isStringRef(data))
        throw new Error("StringRef should be resolved at this point!");
    else
        throw new Error();
}

export function globContiguousStrings(data: BibStringData): (BibStringDatum | ContiguousSimpleString)[] {
    const result: (BibStringDatum | ContiguousSimpleString)[] = [];
    for (const element of data) {
        if (isString(element) || isNumber(element)) {
            if (result.length <= 0) {
                const contiguousSimpleString: ContiguousSimpleString = {
                    type: "ContiguousSimpleString",
                    data: [element]
                };
                result.push(contiguousSimpleString);
            }
            else {
                const lastElement = result[result.length - 1];
                if (isContiguousSimpleString(lastElement)) {
                    lastElement.data.push(element);
                } else {
                    const contiguousSimpleString: ContiguousSimpleString = {
                        type: "ContiguousSimpleString",
                        data: [element]
                    };
                    result.push(contiguousSimpleString);
                }
            }
        } else {
            result.push(element);
        }
    }
    return result;
}

export function splitOnAnd(data: BibStringData): BibStringData[] {
    return splitOnPattern(data, /\s+and\s+/g);
}

export function splitOnComma(data: BibStringData, limit = 2): BibStringData[] {
    return splitOnPattern(data, /\s*,\s*/g, limit);
}

export function splitOnPattern(data: BibStringData, pattern: RegExp, stopAfter?: number): BibStringData[] {
    const splitted: BibStringData[] = [];

    let buffer: BibStringData = [];
    for (const datum of data) {
        if (isString(datum) && (stopAfter === undefined || stopAfter > 0)) {
            let match: RegExpExecArray | null | undefined = pattern.exec(datum);
            let end = 0;
            if (match) {
                do {
                    const prevEnd = end;
                    end = match.index + match[0].length;
                    // if(prevEnd !== match.index)
                    buffer.push(datum.substring(prevEnd, match.index));

                    if (stopAfter === undefined || stopAfter > 0) {
                        splitted.push(buffer);
                        buffer = [];
                        if (stopAfter !== undefined && stopAfter > 0) stopAfter--;
                    }

                    if (stopAfter === undefined || stopAfter > 0)
                        match = pattern.exec(datum);
                    else
                        match = undefined;
                } while (match);

                if (end > 0 && end < datum.length)
                    buffer.push(datum.substring(end));
            } else {
                buffer.push(datum);
            }
        }
        else
            buffer.push(datum);
    }

    if (buffer.length > 0) splitted.push(buffer);
    return splitted;
}

// TODO
// /**
//  * A special character is a
//  part of a field starting with a left brace being at brace depth 0 immediately followed with a backslash,
//  and ending with the corresponding right brace. For instance, in the above example, there is no special
//  character, since \LaTeX is at depth 2. It should be noticed that anything in a special character is
//  considered as being at brace depth 0, even if it is placed between another pair of braces.
//  */
// export class SpecialCharacter extends BibStringComponent {
//     constructor(data: BibStringData) {
//         super("specialCharacter", 0, data);
//     }
//
//     copyWithResolvedStringReferences(alreadyResolved, refs): BibStringComponent {
//         return new SpecialCharacter(resolveStringReferences(this,(alreadyResolved, refs));
//     }
// }
