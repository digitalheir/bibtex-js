import {BibOuterStringComponent, BibStringComponent, BibStringData} from "./BibStringItem";

export class BracedString extends BibStringComponent {
    readonly isSpecialCharacter: boolean;
    
    constructor(braceDepth: number, data: BibStringData) {
        super("bracedstring", braceDepth, data);
        
        // TODO braced strings inside a special character is treated as if it has brace depth 0. Maybe it's a good idea to mark these nested braces?
        this.isSpecialCharacter = braceDepth === 0 && data[0] === "\\";
    }

}
export class OuterBracedString extends BibOuterStringComponent {
    constructor(data: BibStringData) {
        super("bracedstringwrapper", data);
    }
}

export function isOuterBracedString(x: any): x is OuterBracedString {
    return x.type === "bracedstringwrapper";
}

export function isBracedString(x: any): x is BracedString {
    return x.type === "bracedstring";
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
