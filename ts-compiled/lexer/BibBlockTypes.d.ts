export declare const bibTypes: {
    string: string;
    preamble: string;
    comment: string;
    bib: string;
};
export declare type BibType = keyof typeof bibTypes;
export declare const isBibType: (c: string) => c is "string" | "preamble" | "comment" | "bib";
