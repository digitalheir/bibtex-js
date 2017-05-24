import {Stringy} from "./ComplexString";
import {BibFileNode} from "../BibFileNode";

export class QuotedString extends BibFileNode {
    readonly data: Stringy[];

    constructor(data: Stringy[]){
        super("quotedstring");
        this.data=data;
    }
}


export class OuterQuotedString extends BibFileNode {
    readonly data: Stringy[];

    constructor(data: Stringy[]){
        super("quotedstringwrapper");
        this.data=data;
    }
}
