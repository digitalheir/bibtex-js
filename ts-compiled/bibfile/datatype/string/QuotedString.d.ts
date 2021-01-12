import { BibOuterStringComponent, BibStringComponent } from "./BibStringComponent";
import { BibStringData } from "./BibStringData";
export declare class QuotedString extends BibStringComponent {
    constructor(braceDepth: number, data: BibStringData);
}
export declare class OuterQuotedString extends BibOuterStringComponent {
    constructor(data: BibStringData);
}
export declare function isOuterQuotedString(x: any): x is OuterQuotedString;
export declare function isQuotedString(x: any): x is QuotedString;
