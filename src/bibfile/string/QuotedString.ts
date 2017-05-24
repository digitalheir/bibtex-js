import {BibStringComponent, BibStringData} from "../BibStringItem";

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

// export class DefiniteOuterQuotedString extends BibStringComponent {
//     readonly data: DefiniteStringy[];
//
//     constructor(braceDepth: number, data: DefiniteStringy[]) {
//         super("quotedstringwrapper", braceDepth, data);
//     }
// }
