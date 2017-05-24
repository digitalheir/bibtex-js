import {KeyVal, isKeyVal, newKeyVal} from "./KeyVal";
import {BibFileNode} from "./BibFileNode";
import {Stringy} from "./string/ComplexString";

export class StringEntry extends BibFileNode {
    readonly key: string;
    readonly value: Stringy[];

    public constructor(key: string, value: Stringy[]) {
        super("string");
        this.key = key;
        this.value = value;
    }
}

export class ResolvedStringEntry extends StringEntry {
    readonly resolvedValue: Stringy[];

    public constructor(key: string, value: Stringy[], resolvedValue: Stringy[]) {
        super("string");
        this.key = key;
        this.value = value;
        this.resolvedValue = resolvedValue;
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

export function resolveStringObjects(
                           seenBeforeStack: {[key: string]: boolean},
                           compiledSoFar: {[key: string]: ResolvedStringEntry},
                           rawStrings: Abbreviations,
                           strObj: any
    ) {
    if (typeof strObj === 'object' && strObj.stringref) {
        const refName = strObj.stringref;
        if (seenBeforeStack[refName])
            throw new Error("Cycle detected: " + refName);
        if (compiledSoFar[refName])
            return compiledSoFar[refName];
        if (!rawStrings[refName])
            throw new Error("Unresolved reference: " + JSON.stringify(strObj));
        //console.log("RESOLVE", refName);
        compiledSoFar[refName] = resolveStringDeclarations(
            Object.assign({}, seenBeforeStack, {[refName]: true}),
            rawStrings[refName],
            compiledSoFar,
            rawStrings
        );
        return compiledSoFar[refName];
    } else if (strObj._raw)
        return strObj;
    else
        return strObj;
}

export function newStringNode(data: any): StringEntry {
    const {key, value}: KeyVal = findKeyVal(data);
    return new StringEntry(key, value);
}
