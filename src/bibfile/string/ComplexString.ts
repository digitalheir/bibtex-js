import {BracedString, OuterBracedString} from "./BracedString";
import {OuterQuotedString, QuotedString} from "./QuotedString";
import {mustBeString, isString, isArray, isNumber} from "../../util";
import {isStringRef, StringRef} from "./StringRef";
import {WhitespaceString} from "./WhitespaceString";
import {isWhitespace} from "../../lexer/WhitespaceToken";
import {isIdToken} from "../../lexer/IdToken";

// export type ComplexString = Stringy | Stringy[];
// export type DefiniteStringy = string | number | DefiniteQuotedString | DefiniteBracedString | WhitespaceString;
// export type Stringy = DefiniteStringy | QuotedString | BracedString | StringRef ;

