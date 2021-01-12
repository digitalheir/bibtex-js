import { BibStringData } from "../../datatype/string/BibStringData";
export declare class AuthorName {
    readonly firstNames$: BibStringData[];
    readonly initials: string[];
    readonly vons$: BibStringData[];
    readonly lastNames$: BibStringData[];
    readonly jrs$: BibStringData[];
    readonly firstNames: string[];
    readonly vons: string[];
    readonly lastNames: string[];
    readonly jrs: string[];
    readonly id: string;
    constructor(firstNames: BibStringData[], vons: BibStringData[], lastNames: BibStringData[], jrs: BibStringData[]);
}
export declare function parseAuthorName(normalizedFieldValue: BibStringData): AuthorName;
