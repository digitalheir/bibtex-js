import {Stringy} from "./ComplexString";

export type QuotedString = {
    type: "quotedstring";
    data: Stringy[];
};