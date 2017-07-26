/**
 * A named reference to a string, eg. `{string1} # stringRef # {string2}`
 */
export class StringRef {
    readonly stringref: string;
    readonly braceDepth: number;

    constructor(braceDepth: number, stringref: string) {
        this.braceDepth = braceDepth;
        this.stringref = stringref;
    }
}

export function isStringRef(stringref: any): stringref is StringRef {
    return typeof stringref.stringref === "string";
}