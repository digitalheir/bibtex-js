export class StringRef {
    readonly stringref: string;
    readonly braceDepth: number;

    constructor(braceDepth: number, stringref: string) {
        this.braceDepth = braceDepth;
        this.stringref = stringref;
    }
}

export function isStringRef(stringref: any): boolean {
    return typeof stringref.stringref === "string";
}