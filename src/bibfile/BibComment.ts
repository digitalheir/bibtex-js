import {isArray, isString, mustBeString} from "../util";
import {BibFileNode} from "./BibFileNode";

export class BibComment extends BibFileNode {
    readonly data: string[];
    readonly string: string;

    constructor(data: string[]){
        super("comment");
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