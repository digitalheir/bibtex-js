import {BibStringData, BibStringDatum} from "./BibStringData";
import {isNumber, isString} from "../../../util";

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


    private static isBibStringComponent(x: any): x is BibStringComponent {
        return typeof x.braceDepth === "number" && typeof x.type === "string";
    }

    private static stringifyDatum(datum: BibStringDatum): string {
        if (isString(datum)) return datum;
        if (isNumber(datum)) return datum.toString();
        if (BibStringComponent.isBibStringComponent(datum)) return datum.stringify();
        // if (isStringRef(datum)) throw new Error("Unexpected state");
        else throw new Error("Unexpected state");
    }

    stringify(): string {
        return this.data.map(BibStringComponent.stringifyDatum).join("");
    }
}

export class BibOuterStringComponent extends BibStringComponent {
    constructor(type: string, data: BibStringData) {
        super(type, 0, data);
    }
}