import {flattenPlainText} from "./BibComment";
import {flattenArray, isArray, isString, mustBeArray} from "../util";
import {parseStringComponent} from "./BibEntry";
import {parseBibEntriesAndNonEntries} from "./BibFile";

export class Preamble {
    readonly type: string;
    readonly data: any[];
    readonly string: string;

    // TODO
    constructor(data: any[]) {
        this.type = ("preamble");
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


function parsePreambleContents(data: any) {
    if (isString(data)) return data;
    if (isString(data.type) && data.type === "@bib")
        return "@" + data.string;
    // if (isString(data.type) && data.type === "NON_ENTRY")
    //     return ;
    if (isString(data.string)) return data.string;
    return data;
}
export function newPreambleNode(data: any): Preamble {
    const flattened = parseBibEntriesAndNonEntries(mustBeArray(data.data));
    return new Preamble(flattened);
}