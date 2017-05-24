export class BibStringItem {
    readonly type: string;
    /**
     * The brace depth of an item is the number of braces surrounding it (surrounding the field with braces instead of quotes does not modify the brace depth)
     */
    readonly braceDepth: number;

    constructor(type: string, braceDepth: number) {
        this.type = type;
        this.braceDepth = braceDepth;
    }
}

/**
 * A special character is a
part of a field starting with a left brace being at brace depth 0 immediately followed with a backslash,
and ending with the corresponding right brace. For instance, in the above example, there is no special
character, since \LaTeX is at depth 2. It should be noticed that anything in a special character is
considered as being at brace depth 0, even if it is placed between another pair of braces.
 */
export class SpecialCharacter extends BibStringItem {
    constructor(type: string, braceDepth: number) {
        super("specialCharacter", 0)
    }
}
