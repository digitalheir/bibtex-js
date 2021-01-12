import { FieldValue } from "../datatype/KeyVal";
import { OuterQuotedString } from "../datatype/string/QuotedString";
import { OuterBracedString } from "../datatype/string/BracedString";
import { BibStringComponent } from "../datatype/string/BibStringComponent";
import { BibStringData } from "../datatype/string/BibStringData";
export declare class BibStringEntry {
    readonly type: string;
    readonly key: string;
    readonly value: FieldValue;
    constructor(key: string, value: FieldValue);
}
export declare function newStringEntry(data: any): BibStringEntry;
export declare function resolveStrings(strings: {
    [key: string]: FieldValue;
}): {
    [key: string]: FieldValue;
};
export declare function resolveStringReferences(o: BibStringComponent, seenBeforeStack: {
    [key: string]: boolean;
}, alreadyResolved: {
    [key: string]: FieldValue;
}, refs: {
    [key: string]: FieldValue;
}): BibStringData;
export declare function resolveStringReference(seenBeforeStack: {
    [key: string]: boolean;
}, alreadyResolved: {
    [p: string]: FieldValue;
}, refs: {
    [p: string]: FieldValue;
}, data: FieldValue): FieldValue;
export declare function copyWithResolvedStringReferences(obj: BibStringComponent, seenBeforeStack: {
    [key: string]: boolean;
}, alreadyResolved: {
    [key: string]: FieldValue;
}, refs: {
    [key: string]: FieldValue;
}): OuterQuotedString | OuterBracedString;
export declare function copyOuterWithResolvedStringReferences(obj: OuterQuotedString | OuterBracedString, seenBeforeStack: {
    [key: string]: boolean;
}, alreadyResolved: {
    [key: string]: FieldValue;
}, refs: {
    [key: string]: FieldValue;
}): OuterQuotedString | OuterBracedString;
