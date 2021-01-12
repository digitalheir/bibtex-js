import { AuthorName } from "./Author";
import { BibOuterStringComponent } from "../../datatype/string/BibStringComponent";
import { BibStringData } from "../../datatype/string/BibStringData";
import { FieldValue } from "../../datatype/KeyVal";
export declare class Authors extends BibOuterStringComponent {
    readonly authors$: AuthorName[];
    constructor(fieldValue: FieldValue);
}
export declare function determineAuthorNames$(data: FieldValue): BibStringData[];
export declare function mustBeAuthors(x: any): Authors;
export declare function isAuthors(x: any): x is Authors;
