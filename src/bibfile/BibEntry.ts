import {BibFileNode} from "./BibFileNode";
import {parseNode} from "./parseBibNode";

export class BibEntry implements NonBibComment {
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
  readonly key$;

   /**
    the second transformation applied to a title is to be turned to lower case (except the first character).
The function named change.case$ does this job. But it only applies to letters that are
a brace depth 0, except within a special character. In a special character, brace depth is always
0, and letters are switched to lower case, except LATEX commands, that are left unmodified.
*/
     readonly title$;
 
    constructor(type: string, id: string, fields: EntryFields){
      this.type = type;
      this._id = id;
      this.fields = fields;     
      // TODO implement; see above
      this.key$ = "";
      this.title$ = "";
    }
}


export function parseEntryFields(fields: any): EntryFields {
    const fieldz: EntryFields = {};
    Object.keys(fields).forEach(key => {
        fieldz[key] = parseNode(fields[key]);
    });
    return fieldz;
}



export function parseFieldValue(value: any): FieldValue {
    switch(value.type){
        case "quotedstringwrapper":
            return new OuterQuotedString();
            case "bracedstringwrapper":
            return new OuterBracedString();
        default:
            throw new Error();
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
    return typeof x["@type"] === "string"
        && typeof x["_id"] === "string"
        && !!x["fields"];
}
