import { BibOuterStringComponent } from "./string/BibStringComponent";
export interface KeyVal {
    readonly key: string;
    readonly value: FieldValue;
}
export declare function isKeyVal(data: any): data is KeyVal;
export declare function newKeyVal(data: any): KeyVal;
export declare function parseFieldValue(value: any): FieldValue;
export declare type FieldValue = number | BibOuterStringComponent;
export declare function normalizeFieldValue(field?: FieldValue): string | number | undefined;
