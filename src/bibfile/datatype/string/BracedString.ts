
import {BibOuterStringComponent, BibStringComponent} from "./BibStringComponent";
import {BibStringData} from "./BibStringData";

/**
 * thisObject = {A string between braces}
 */
export class BracedString extends BibStringComponent {

    /**
     * A special character is a
     * part of a field starting with a left brace being at brace depth 0 immediately followed with a backslash,
     * and ending with the corresponding right brace.
     * It should be noticed that anything in a special character is
     * considered as being at brace depth 0, even if it is placed between another pair of braces.
     */
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