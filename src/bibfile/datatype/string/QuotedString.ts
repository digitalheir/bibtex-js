import {
    BibOuterStringComponent,
    BibStringComponent
} from "./BibStringComponent";

import {BibStringData} from "./BibStringData";

/**
 * thisObject = "A string between quotes"
 */
export class QuotedString extends BibStringComponent {
    constructor(braceDepth: number, data: BibStringData) {
        super("quotedstring", braceDepth, data);
    }
}

export class OuterQuotedString extends BibOuterStringComponent {
    constructor(data: BibStringData) {
        super("quotedstringwrapper", data);
    }
}

export function isOuterQuotedString(x: any): x is OuterQuotedString {
    return x.type === "quotedstringwrapper";
}

export function isQuotedString(x: any): x is QuotedString {
    return x.type === "quotedstring";
}