import {KeyVal, isKeyVal, newKeyVal} from "./KeyVal";
import {BibFileNode} from "./BibFileNode";
import {ComplexString} from "./string/ComplexString";

export class StringEntry extends BibFileNode {
    readonly key: string;
    readonly value: ComplexString[];

    public constructor(key: string, value: ComplexString[]) {
        super("string");
        this.key = key;
        this.value = value;
    }
}

function findKeyVal(data: any): KeyVal {
    if (isKeyVal(data)) {
        return newKeyVal(data);
    } else {
        if (data.type !== "string") {
            throw new Error("Unexpected node: " + JSON.stringify(data));
        }
        return findKeyVal(data.data);
    }
}

export function newStringNode(data: any): StringEntry {
    const {key, value}: KeyVal = findKeyVal(data);
    return new StringEntry(key, value);
}