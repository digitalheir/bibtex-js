import {flatten, isArray, isString, mustBeString} from "../util";

export class BibComment {
    readonly type: string;
    readonly data: string[];
    readonly string: string;

    constructor(data: string[]) {
        this.type = "comment";
        this.data = data;
        this.string = data.join("");
    }

    toString() {
        return this.string;
    }
}

export class CommentEntry {
    readonly type: string;
    readonly data: string[];
    readonly string: string;

    constructor(type: string, data: string[]) {
        this.type = type;
        this.data = data;
        this.string = data.join("");
    }

    toString() {
        return this.string;
    }
}

export function isBibComment(n: any): n is BibComment {
    return n.type === "comment" && isArray(n.data);
}

const flattenO = (wrapper: any): string => isString(wrapper) ? wrapper
    : typeof wrapper === "number" ? wrapper.toString()
        // : (isString(wrapper.type) && wrapper.type === "@bib" && isString(wrapper.string)) ? "@" + wrapper.string
        : wrapper["type"] === "@bib" ? "@" + mustBeString(wrapper.string)
            : wrapper["type"] === "escapedEntry" ? "\\" + flattenO(wrapper.data)
                : mustBeString(wrapper.string)
;

export function flattenPlainText(data: any[]): string[] {
    return flatten(data).map(flattenO);
}