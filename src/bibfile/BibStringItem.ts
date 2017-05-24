export class BibStringItem {
    readonly type: string;
    /**
     * The brace depth of an item is the number of braces surrounding it
     */
    readonly braceDepth: number;

    constructor(type: string, braceDepth: number) {
        this.type = type;
        this.braceDepth = braceDepth;
    }
}
