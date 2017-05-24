import {BibFileNode} from "./BibFileNode";
import {isArray, mustBeString} from "../util";
import {newStringNode} from "./StringEntry";
import {newPreambleNode} from "./BibPreamble";
import {QuotedString} from "./string/QuotedString";
import {BracedString} from "./string/BracedString";
import {parseComplexStringOuter, Stringy} from "./string/ComplexString";

export function parseNode(data: any): BibFileNode {
    let type = mustBeString(data.type);
    switch (type) {
        case "string":
            return newStringNode(data);
        case "preamble":
            return newPreambleNode(data);
        case "bracedstringwrapper":
            return new BracedString(parseComplexStringOuter(data));
        case "quotedstringwrapper":
            return new QuotedString(parseComplexStringOuter(data));
        case "braced":
        case "quotedstring":

        default:
            throw new Error("Unexpected entry parsed: " + data.type);
    }
}