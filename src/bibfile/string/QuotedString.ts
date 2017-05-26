import {BibOuterStringComponent, BibStringComponent, BibStringData} from "./BibStringItem";

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

// export class DefiniteOuterQuotedString extends BibStringComponent {
//     readonly data: DefiniteStringy[];
//
//     constructor(braceDepth: number, data: DefiniteStringy[]) {
//         super("quotedstringwrapper", braceDepth, data);
//     }
// }
