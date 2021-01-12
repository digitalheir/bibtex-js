import { Authors } from "./bibliographic-entity/Authors";
import { FieldValue } from "../datatype/KeyVal";
export declare class BibEntry {
    readonly type: string;
    readonly _id: string;
    readonly fields: EntryFields;
    readonly fields$: EntryFields;
    readonly sortkey$: string;
    readonly title$: string;
    constructor(type: string, id: string, fields: EntryFields);
    getField(key: string): FieldValue | undefined;
    getFieldAsString(key: string): string | number | undefined;
    getAuthors(): Authors | undefined;
}
export interface EntryFields {
    [k: string]: FieldValue;
}
export declare function parseEntryFields(fields: any): EntryFields;
export declare function isBibEntry(x: any): x is BibEntry;
export declare function processEntry(entry: BibEntry, strings$: {
    [p: string]: FieldValue;
}): BibEntry;
