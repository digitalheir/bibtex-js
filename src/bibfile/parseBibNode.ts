import {BibFileNode} from "./BibFileNode";
import {mustBeString} from "../util";
import {newStringNode} from "./StringEntry";
import {newPreambleNode} from "./BibPreamble";

export function parseNode(data: any): BibFileNode {
    let type = mustBeString(data.type);
    switch (type) {
        case "string":
            return newStringNode(data);
        case "preamble":
            return newPreambleNode(data);
        case "braced":
        case "bracedstringwrapper":
        case "quotedstring":
        case "quotedstringwrapper":
        default:
            throw new Error("Unexpected entry parsed: " + data.type);
    }
}