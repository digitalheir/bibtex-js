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
