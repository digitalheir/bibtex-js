import { BibOuterStringComponent, BibStringComponent } from "./BibStringComponent";
import { BibStringData } from "./BibStringData";
export declare class BracedString extends BibStringComponent {
    readonly isSpecialCharacter: boolean;
    constructor(braceDepth: number, data: BibStringData);
}
export declare class OuterBracedString extends BibOuterStringComponent {
    constructor(data: BibStringData);
}
export declare function isOuterBracedString(x: any): x is OuterBracedString;
export declare function isBracedString(x: any): x is BracedString;
