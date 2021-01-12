import { StringRef } from "./StringRef";
import { BibStringComponent } from "./BibStringComponent";
import { BibStringData, BibStringDatum } from "./BibStringData";
export declare function isBibStringComponent(x: any): x is BibStringComponent;
export interface ContiguousSimpleString {
    type: "ContiguousSimpleString";
    data: (number | string)[];
}
export declare function isContiguousSimpleString(x: any): x is ContiguousSimpleString;
export declare function joinContiguousSimpleStrings(x: ContiguousSimpleString): string;
export declare function parseStringComponent(braceDepth: number, obj: any): BibStringComponent | string | number | StringRef;
export declare function toStringBibStringDatum(data: BibStringDatum): string;
export declare function toStringBibStringData(data: BibStringData): string;
export declare function flattenQuotedStrings(data: BibStringData, hideQuotes?: boolean): BibStringData;
export declare function globContiguousStrings(data: BibStringData): (BibStringDatum | ContiguousSimpleString)[];
export declare function splitOnAnd(data: BibStringData): BibStringData[];
export declare function splitOnComma(data: BibStringData, limit?: number): BibStringData[];
export declare function splitOnPattern(data: BibStringData, pattern: RegExp, stopAfter?: number): BibStringData[];
