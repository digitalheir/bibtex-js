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

    public constructor(key: string, value: Stringy[], resolvedValue: DefiniteStringy[]) {
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

function resolveStringObjects(
                           seenBeforeStack: {[key: string]: boolean},
                           compiledSoFar: {[key: string]: ResolvedStringEntry},
                           rawStrings: {[key: string]: StringEntry},
                           strObj: any
    ) {
    if (isStringRef(strObj)) {
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
    }
    else
        return strObj;
}

function resolveStringDeclarations(referenceStack: {[key: string]: boolean},
                                   wrapper: ParsedTokensWrapper,
                                   compiledSoFar: {[key: string]: StringEntry},
                                   rawStrings: Abbreviations) {
    if (wrapper.type === "quotedstringwrapper") {
        return new StringValue({
            type: wrapper.type,
            data: wrapper.data.map(obj => parseStringObject(
                referenceStack,
                compiledSoFar,
                rawStrings,
                obj))
        });
    }
    else if (wrapper.type === "bracedstringwrapper")
        return new StringValue(wrapper);
    else
        throw new Error("Unexpected object to resolve: " + JSON.stringify(wrapper));
}

export function resolveStringEntries(keyvals: {[key: string]: StringEntry): {[key: string]: ResolvedStringEntry}{
    const refs: {[key: string]: ResolvedStringEntry} = {};
    Object.keys(keyvals).forEach(key => {
        if (!refs[key])
            refs[key] = resolveStringDeclarations({}, keyvals[key], refs, keyvals);
    }
    return refs;
}

export function newStringNode(data: any): StringEntry {
    const {key, value}: KeyVal = findKeyVal(data);
    return new StringEntry(key, value);
}
