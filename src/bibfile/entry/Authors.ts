import {
    BibOuterStringComponent, BibStringData, BibStringDatum, ContiguousSimpleString,
    isContiguousSimpleString, joinContiguousSimpleStrings
} from "../string/BibStringItem";
import {FieldValue} from "./BibEntry";
import {isArray, isNumber, isString} from "../../util";
import Author from "./Author";
import {isStringRef} from "../string/StringRef";
import {isOuterBracedString, isBracedString} from "../string/BracedString";
import {isOuterQuotedString, isQuotedString} from "../string/QuotedString";

export class Authors extends BibOuterStringComponent {
    readonly authors$: any[];

    constructor(fieldValue: FieldValue) {
        const data = isNumber(fieldValue) ? [fieldValue] : fieldValue.data;
        super("authors", data);

        // todo


        const authorNames = determineAuthorNames$(fieldValue);
        this.authors$ = authorNames.map(name => /*new Author*/(name));
    }
}
export function mustBeAuthors(x: any): Authors {
    if (!isAuthors(x)) throw new Error();
    return x;
}
export function isAuthors(x: any): x is Authors {
    return (isArray(x["authors$"]) && x.type === "authors");
}
export function determineAuthorNames$(data: FieldValue): BibStringData[] {
    if (isNumber(data)) {
        return determineAuthorNames([data]);
    } else {
        return determineAuthorNames(data.data, isOuterQuotedString(data));
    }
}

function determineAuthorNames(data: BibStringData, hideQuotes?: boolean): BibStringData[] {
    const globbed = globContiguousStrings(
        flattenQuotedStrings(data, hideQuotes)
    );
    const normalizedString: BibStringData = globbed.map(e => isContiguousSimpleString(e) ? joinContiguousSimpleStrings(e) : e);
    return splitOnAnd(normalizedString);
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

const doubleQuotesArray: BibStringDatum[] = ["\""];

function flattenQuotedString(data: BibStringDatum, hideQuotes?: boolean): BibStringDatum | BibStringData {
    if (isBracedString(data))
        return data;
    if (isQuotedString(data)) {
        const flattenedQuotedString: BibStringData = flattenQuotedStrings(data.data, true);
        if (isArray(flattenedQuotedString)) {
            return hideQuotes
                ? flattenedQuotedString
                : doubleQuotesArray.concat(flattenedQuotedString).concat(doubleQuotesArray);
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

function globContiguousStrings(data: BibStringData): (BibStringDatum | ContiguousSimpleString)[] {
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
    const splitted: BibStringData[] = [];

    let buffer: BibStringData = [];
    for (const datum of data) {
        if (isString(datum)) {
            const authors: string[] = datum.split(/\s+and\s+/g);
            buffer.push(authors[0]);

            for (let i = 1; i < authors.length; i++) {
                splitted.push(buffer);
                buffer = [authors[i]];
            }
        } else {
            buffer.push(datum);
        }
    }

    if (buffer.length > 0)
        splitted.push(buffer);
    return splitted;
}

function parseAuthors(data: BibOuterStringComponent): Author[] {
    const authors: Author[] = [];
    data.data;
    return authors;
}
