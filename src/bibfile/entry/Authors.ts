import {BibOuterStringComponent, BibStringData, BibStringDatum} from "../string/BibStringItem";
import {EntryFields, FieldValue} from "./BibEntry";
import {isArray, isNumber, isString} from "../../util";
import Author from "./Author";
import {isStringRef} from "../string/StringRef";
import {isOuterBracedString, isBracedString} from "../string/BracedString";
import {isOuterQuotedString, isQuotedString} from "../string/QuotedString";

export class Authors extends BibOuterStringComponent {
    constructor(data: FieldValue) {
        super("authors", isNumber(data) ? [data] : data.data);

        // todo

        // if (!isNumber(data)) {
        //     this.authors = parseAuthors(data.data);
        // }

        // const authorz = splitOn(fieldValue.data, (o: any) => );
        // data.forEach((el, i) =>
        // if (el === "and") {
        //     console.log(i);
        // });
    }
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

function parseAuthors(data: BibOuterStringComponent): Author[] {
    const authors: Author[] = [];
    data.data;
    return authors;
}