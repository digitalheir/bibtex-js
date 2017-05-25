import {BibStringComponent, BibStringData, resolveStringReferences} from "./BibStringItem";
import {FieldValue} from "../BibEntry";

export class QuotedString extends BibStringComponent {
    constructor(braceDepth: number, data: BibStringData) {
        super("quotedstring", braceDepth, data);
    }
}


export class OuterQuotedString extends BibStringComponent {
    constructor(data: BibStringData) {
        super("quotedstringwrapper", 0, data);
    }
}

export function isOuterQuotedString(x: any): x is OuterQuotedString {
    return x.type === "quotedstringwrapper";
}

export function isQuotedString(x: any): x is OuterQuotedString {
    return x.type === "quotedstring";
}

// export class DefiniteOuterQuotedString extends BibStringComponent {
//     readonly data: DefiniteStringy[];
//
//     constructor(braceDepth: number, data: DefiniteStringy[]) {
//         super("quotedstringwrapper", braceDepth, data);
//     }
// }
