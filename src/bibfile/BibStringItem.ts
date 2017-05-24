import {StringRef} from "./string/StringRef";

export type BibStringData = (BibStringComponent| string | number | StringRef)[];

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

/**
 * A special character is a
 part of a field starting with a left brace being at brace depth 0 immediately followed with a backslash,
 and ending with the corresponding right brace. For instance, in the above example, there is no special
 character, since \LaTeX is at depth 2. It should be noticed that anything in a special character is
 considered as being at brace depth 0, even if it is placed between another pair of braces.
 */
export class SpecialCharacter extends BibStringComponent {
    constructor(data: BibStringComponent[]) {
        super("specialCharacter", 0, data);
    }
}
