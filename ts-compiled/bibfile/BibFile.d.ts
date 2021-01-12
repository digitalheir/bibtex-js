import { FieldValue } from "./datatype/KeyVal";
import { BibEntry } from "./bib-entry/BibEntry";
import { BibComment, CommentEntry } from "./bib-entry/BibComment";
import { Preamble } from "./bib-entry/BibPreamble";
import { BibStringEntry } from "./bib-entry/BibStringEntry";
export declare type NonBibComment = BibEntry | CommentEntry | BibStringEntry | Preamble;
export declare class BibFilePresenter {
    readonly content: (NonBibComment | BibComment)[];
    readonly comments: BibComment[];
    readonly entries_raw: BibEntry[];
    readonly entries$: {
        [key: string]: BibEntry;
    };
    readonly preambles_raw: Preamble[];
    readonly preamble$: string;
    readonly strings_raw: {
        [k: string]: FieldValue;
    };
    readonly strings$: {
        [k: string]: FieldValue;
    };
    constructor(content: (NonBibComment | BibComment)[]);
    getEntry(id: string): BibEntry | undefined;
}
export declare const parseBibEntriesAndNonEntries: (parse: any) => (BibEntry | CommentEntry | BibStringEntry | Preamble | BibComment)[];
export declare function parseBibFile(input: string): BibFilePresenter;
