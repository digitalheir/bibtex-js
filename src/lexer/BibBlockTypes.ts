export const bibTypes = {
    string: "@string",
    preamble: "@preamble",
    comment: "@comment",
    bib: "@bib"
};

export type BibType = keyof typeof bibTypes;

export const isBibType = function (c: string): c is BibType {
    return bibTypes.hasOwnProperty(c);
};