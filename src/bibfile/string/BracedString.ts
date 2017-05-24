import {Stringy} from "./ComplexString";

export type BracedString = {
    type: "bracedstring" | "braced";
    data: Stringy[];
};