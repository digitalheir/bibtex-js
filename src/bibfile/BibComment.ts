import {isArray, isString, mustBeString} from "../util";

export class BibComment {
    readonly type: string;
    readonly data: string[];
    readonly string: string;

    constructor(data: string[]){
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

    constructor(type: string, data: string[]){
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

export function flattenPlainText(data: any[]): string[] {
    return data.map((wrapper: any) => isString(wrapper) ? wrapper
        : typeof wrapper === "number" ? wrapper.toString()
            : mustBeString(wrapper.string)
    );
}