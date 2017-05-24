import {BibFileNode} from "./BibFileNode";
import {parseNode} from "./parseBibNode";


export function parseEntryFields(fields: any): EntryFields {
    const fieldz: EntryFields = {};
    Object.keys(fields).forEach(key => {
        fieldz[key] = parseNode(fields[key]);
    });
    return fieldz;
}

export type EntryFields = { [k: string]: BibFileNode };

export function isBibEntry(x: any): x is BibEntry {
    return typeof x["@type"] === "string"
        && typeof x["_id"] === "string"
        && !!x["fields"];
}

export interface BibEntry {
    "@type": string;
    _id: string;
    fields: EntryFields;
}
