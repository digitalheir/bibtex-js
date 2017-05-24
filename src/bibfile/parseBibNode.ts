import {mustBeString} from "../util";
import {newStringNode} from "./StringEntry";
import {newPreambleNode, Preamble} from "./BibPreamble";
import {OuterQuotedString, QuotedString} from "./string/QuotedString";
import {BracedString, OuterBracedString} from "./string/BracedString";
// todo delete
// export function parseNode(data: any): OuterBracedString | OuterQuotedString | Preamble {
//     let type = mustBeString(data.type);
//     switch (type) {
//         case "string":
//             return newStringNode(data);
//         case "preamble":
//             return newPreambleNode(data);
//         case "bracedstringwrapper":
//             return new BracedString(parseComplexStringOuter(data));
//         case "quotedstringwrapper":
//             return new QuotedString(parseComplexStringOuter(data));
//         case "braced":
//         case "quotedstring":
//
//         default:
//             throw new Error("Unexpected entry parsed: " + data.type);
//     }
// }