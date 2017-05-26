import {StringRef} from "./StringRef";
import {BracedString, OuterBracedString} from "./BracedString";
import {OuterQuotedString, QuotedString} from "./QuotedString";


export type BibStringDatum = (
    BracedString
    | QuotedString
    | OuterQuotedString
    | OuterBracedString
    | string
    | number
    | StringRef);
export type BibStringData = BibStringDatum[];

export class BibStringComponent {
    readonly data: BibStringData;
    readonly type: string;

    /**
     * The brace depth of an item is the number of braces surrounding it (surrounding the field with braces instead of quotes does not modify the brace depth)
     */
    readonly braceDepth: number;

    constructor(type: string, braceDepth: number, data: BibStringData) {
        this.type = type;
        this.braceDepth = braceDepth;
        this.data = data;
    }


}
export class BibOuterStringComponent extends BibStringComponent {
    constructor(type: string, data: BibStringData) {
        super(type, 0, data);
    }
}

export function isBibStringComponent(x: any): x is BibStringComponent {
    return typeof x.braceDepth === "number" && typeof x.type === "string";
}

export interface ContiguousSimpleString = {
    type: "ContiguousSimpleString";
    data: (number | string)[];
}

export function isContiguousSimpleString(x:any): x is ContiguousSimpleString {
    return c.type === "ContiguousSimpleString" && isArray(x.data);
}

export function joinContiguousSimpleStrings(x: ContiguousSimpleString): string {
    return x.data.join("");
}

// TODO
// /**
//  * A special character is a
//  part of a field starting with a left brace being at brace depth 0 immediately followed with a backslash,
//  and ending with the corresponding right brace. For instance, in the above example, there is no special
//  character, since \LaTeX is at depth 2. It should be noticed that anything in a special character is
//  considered as being at brace depth 0, even if it is placed between another pair of braces.
//  */
// export class SpecialCharacter extends BibStringComponent {
//     constructor(data: BibStringData) {
//         super("specialCharacter", 0, data);
//     }
//
//     copyWithResolvedStringReferences(alreadyResolved, refs): BibStringComponent {
//         return new SpecialCharacter(resolveStringReferences(this,(alreadyResolved, refs));
//     }
// }
