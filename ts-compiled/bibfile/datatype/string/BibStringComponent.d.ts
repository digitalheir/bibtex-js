import { BibStringData, BibStringDatum } from "./BibStringData";
export declare class BibStringComponent {
    readonly data: BibStringData;
    readonly type: string;
    readonly braceDepth: number;
    constructor(type: string, braceDepth: number, data: BibStringData);
    stringify(): string;
}
export declare function stringifyDatum(datum: BibStringDatum): string;
export declare class BibOuterStringComponent extends BibStringComponent {
    constructor(type: string, data: BibStringData);
}
