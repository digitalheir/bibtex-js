import {BibStringComponent, BibStringData} from "../BibStringItem";


export class BracedString extends BibStringComponent {
    readonly type = "bracedstring";

    constructor(braceDepth: number, data: BibStringComponent[]) {
        super("bracedstring", braceDepth, data);
    }
}
export class OuterBracedString extends BibStringComponent {
    readonly type = "bracedstringwrapper";

    constructor(data: BibStringData) {
        super("bracedstring", 0, data);
    }
}

// TODO extends?
// export class DefiniteBracedString extends BibStringComponent {
//     readonly type = "bracedstring";
//     readonly data: DefiniteStringy[];
//
//     constructor(braceDepth: number, data: DefiniteStringy[]) {
//         super("bracedstring", braceDepth, data);
//     }
// }
