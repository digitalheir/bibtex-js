import { StringRef } from "./StringRef";
import { BracedString, OuterBracedString } from "./BracedString";
import { OuterQuotedString, QuotedString } from "./QuotedString";
export declare type BibStringDatum = (BracedString | QuotedString | OuterQuotedString | OuterBracedString | string | number | StringRef);
export declare type BibStringData = BibStringDatum[];
