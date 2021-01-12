export declare class StringRef {
    readonly stringref: string;
    readonly braceDepth: number;
    constructor(braceDepth: number, stringref: string);
}
export declare function isStringRef(stringref: any): stringref is StringRef;
