import {BibFileNode} from "./BibFileNode";
import {flattenPlainText} from "./BibComment";
import {flattenArray} from "../util";

export class Preamble extends BibFileNode {
    readonly data: string[];
    readonly string: string;

    constructor(data: string[]) {
        super("preamble");
        this.data = data;
        this.string = data.join("");
    }

    toString() {
        return this.string;
    }
}

export function isPreamble(x: any): x is Preamble {
    return x.type === "preamble" && !!x.data;
}

export function newPreambleNode(data: any): Preamble {
    return new Preamble(flattenPlainText(flattenArray(data.data)));
}