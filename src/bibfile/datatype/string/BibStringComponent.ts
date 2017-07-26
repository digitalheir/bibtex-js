import {BibStringData} from "./BibStringData";

/**
 * A fully formed string (between {braces} or "quotes").
 * Consists of 0 or many BibStringDatum
 */
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