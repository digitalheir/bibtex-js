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

        const normalizedString = globContiguousStrings(
            flattenQuotedStrings(data.data)
        ).map(e => isContiguousSimpleString(e) ? joinContiguousSimpleStrings(e): e);
        const authorNames: BibStringData[] = splitOnAnd(normalizedString);
        this.authors$ = authorNames.map(name => new Author(name));
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

function globContiguousStrings(data: BibStringData): BibStringData {
    const result: BibStringData = [];
    for (const element of data) {
      if(isString(element) || isNumber(element)){
         if(result.length <= 0)
             result.push(
                 {
                    type: "ContiguousSimpleString",
                    data: [element]
                }
             );
         else {
             const lastElement = result
             (if(isContiguousSimpleString(lastElement)){
                 lastElement.data.push(element);
             }else{
                 result.push(
                     {
                        type: "ContiguousSimpleString",
                        data: [element]
                      }
                  );
             }
        }
      }
    }
}

export function splitOnAnd(data: BibStringData): BibStringData {
    const splitted: BibStringData[] = [];
    
    let buffer: BibStringData = [];
    for(const datum of data) {
        if(isString(datum)) {
            const authors: string[] = datum.split(/\s+and\s+/g);
            buffer.push(authors[0]);
            
            for(let i=1; i < authors.length; i++) {
                splitted.push(buffer);
                buffer = [authors[i]];
            }
        }else{
            buffer.push(datum);
        }
    }
    
    return splitted;
}

function parseAuthors(data: BibOuterStringComponent): Author[] {
    const authors: Author[] = [];
    data.data;
    return authors;
}
