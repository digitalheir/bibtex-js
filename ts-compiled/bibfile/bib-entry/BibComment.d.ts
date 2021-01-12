export declare class BibComment {
    readonly type: string;
    readonly data: string[];
    readonly string: string;
    constructor(data: string[]);
    toString(): string;
}
export declare class CommentEntry {
    readonly type: string;
    readonly data: string[];
    readonly string: string;
    constructor(type: string, data: string[]);
    toString(): string;
}
export declare function isBibComment(n: any): n is BibComment;
export declare function flattenPlainText(data: any[]): string[];
