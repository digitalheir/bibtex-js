import {OuterQuotedString} from "./string/QuotedString";
import {OuterBracedString} from "./string/BracedString";
import {flatten, isArray, isNumber, isString, mustBeArray, mustBeString} from "../util";
import {BibStringComponent} from "./BibStringItem";
import {isStringRef, StringRef} from "./string/StringRef";
import {isNum} from "../lexer/NumericToken";

export class BibEntry {
    readonly type: string;
    readonly _id: string;
    readonly fields: EntryFields;
    /**
     * When sorting, BibTEX computes a string, named
     sort.key$, for each entry. The sort.key$ string is an (often long) string defining the order
     in which entries will be sorted. To avoid any ambiguity, sort.key$ should only contain alphanumeric
     characters. Classical non-alphanumeric characters23, except special characters, will
     be removed by a BibTEX function named purify$. For special characters, purify$ removes
     spaces and LATEX commands (strings beginning with a backslash), even those placed between
     brace pairs. Everything else is left unmodified. For instance, t\^ete, t{\^e}te and t{\^{e}}te
     are transformed into tete, while tête gives tête; Bib{\TeX} gives Bib and Bib\TeX becomes
     BibTeX. There are thirteen LATEX commands that won’t follow the above rules: \OE, \ae, \AE,
     \aa, \AA, \o, \O, \l, \L, \ss. Those commands correspond to ı, , œ, Œ, æ, Æ, å, Å, ø, Ø, ł, Ł,
     ß, and purify$ transforms them (if they are in a special character, in i, j, oe, OE, ae, AE, aa,
     AA, o, O, l, L, ss, respectively.
     */
    readonly sortkey$: string;

    /**
     the second transformation applied to a title is to be turned to lower case (except the first character).
     The function named change.case$ does this job. But it only applies to letters that are
     a brace depth 0, except within a special character. In a special character, brace depth is always
     0, and letters are switched to lower case, except LATEX commands, that are left unmodified.
     */
    readonly title$: string;

    constructor(type: string, id: string, fields: EntryFields) {
        this.type = type;
        this._id = id;
        this.fields = fields;
        // TODO implement; see above
        this.sortkey$ = "";
        this.title$ = "";
    }

    getField(key: string): FieldValue | undefined {
        return this.fields[key.toLowerCase()];
    }
}


export function parseEntryFields(fields: any): EntryFields {
    const fieldz: EntryFields = {};
    Object.keys(fields).forEach(key => {
        fieldz[key] = parseFieldValue(fields[key]);
    });
    return fieldz;
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
            return new BibStringComponent(obj.type, braceDepth, flatten(obj.data).map(e => parseStringComponent(braceDepth+1, e)));
// TODO
        case "quotedstring":
            if (!isArray(obj.data)) {
                throw new Error("Expect array for data: " + JSON.stringify(obj));
            }
            const flattened = flatten(obj.data);
            return new BibStringComponent(obj.type, braceDepth, flattened.map(e => parseStringComponent(braceDepth, e)));
        default:
            throw new Error("Unexpected complex string type: " + obj.type);
    }
}


// export function parseComplexStringOuter(obj: any): OuterQuotedString | OuterBracedString | number {
//     if (isString(obj)) return [obj];
//
//     switch (mustBeString(obj.type)) {
//         case "quotedstringwrapper":
//         case "bracedstringwrapper":
//             if (!isArray(obj.data))
//                 throw new Error("Expect array for data: " + JSON.stringify(obj));
//
//             return obj.data.map(parseStringy);
//         default:
//             throw new Error("Unexpected complex string type: " + obj.type);
//     }
// }

export function parseFieldValue(value: any): FieldValue {
    if (isNumber(value)) {
        return value;
    }
    let data = mustBeArray(value.data);
    switch (value.type) {
        case "quotedstringwrapper":
            if(data.length === 1 && isNumber(data[0]))
                // A single number is in a quoted string wrapper because the parser considered it part of a concatenated string
                return data[0];

            return new OuterQuotedString(data.map(e => parseStringComponent(0, e)));
        case "bracedstringwrapper":
            return new OuterBracedString(data.map(e => parseStringComponent(0, e)));
        default:
            throw new Error("Unexpected value: " + JSON.stringify(value));
    }
}


/**
 * Values (i.e. right hand sides of each assignment) can be either between curly braces or between
 * double quotes. The main difference is that you can write double quotes in the first case, and not
 * in the second case.
 *
 * For numerical values, curly braces and double quotes can be omitted.
 */
export type FieldValue = number | OuterQuotedString | OuterBracedString;


export type EntryFields = { [k: string]: FieldValue };

export function isBibEntry(x: any): x is BibEntry {
    return typeof x["type"] === "string"
        && typeof x["_id"] === "string"
        && !!x["fields"];
}