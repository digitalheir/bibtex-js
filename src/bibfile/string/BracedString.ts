import {Stringy} from "./ComplexString";
import {BibFileNode} from "../BibFileNode";

export interface BracedStringInterface {
    type: "bracedstring" | "braced";
    data: Stringy[];
}

export class BracedString extends BibFileNode implements BracedStringInterface {
    readonly type = "bracedstring";
    readonly data: Stringy[];

    constructor(data: Stringy[]) {
        super("bracedstring");
        this.data = data;
    }
}