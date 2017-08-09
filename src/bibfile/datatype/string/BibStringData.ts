import {StringRef} from "./StringRef";
import {BracedString, OuterBracedString} from "./BracedString";
import {OuterQuotedString, QuotedString} from "./QuotedString";

/**
 * A piece or whole of a string in BiBTeX
 */
export type BibStringDatum = (
    BracedString
    | QuotedString
    | OuterQuotedString
    | OuterBracedString
    | string
    | number
    | StringRef
    );


export type BibStringData = BibStringDatum[];

export const ar = [];