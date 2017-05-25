import {KeyVal, isKeyVal, newKeyVal} from "../KeyVal";
import {FieldValue} from "../BibEntry";
import {BibStringComponent, BibStringData, isBibStringComponent} from "./BibStringItem";
import {isStringRef, StringRef} from "./StringRef";
import {isOuterQuotedString, isQuotedString, OuterQuotedString, QuotedString} from "./QuotedString";
import {BracedString, isBracedString, isOuterBracedString, OuterBracedString} from "./BracedString";
import {isNumber, isString} from "../../util";

export class StringEntry {
    readonly type: string;

    readonly key: string;
    readonly value: FieldValue;

    public constructor(key: string, value: FieldValue) {
        this.type = "string";
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


export function resolveStrings(strings: { [key: string]: FieldValue }): { [key: string]: FieldValue } {
    const resolved: { [key: string]: FieldValue } = {};
    Object.keys(strings).forEach(key => {
        if (!resolved[key])
            resolved[key] = resolveStringReference({}, resolved, strings, strings[key]);
    });
    return resolved;
}
// function resolveStringDeclarations(wrapper: FieldValue,
//                                    compiledSoFar: { [key: string]: FieldValue },
//                                    rawStrings: { [key: string]: FieldValue }) {
//     if (isNumber(wrapper))
//         return wrapper;
//
//     return copyWithResolvedStringReferences(wrapper, compiledSoFar, rawStrings);
//
//     //  else
//     //    throw new Error("Unexpected object to resolve: " + JSON.stringify(wrapper));
// }


export function newStringNode(data: any): StringEntry {
    const {key, value}: KeyVal = findKeyVal(data);
    return new StringEntry(key, value);
}


export function resolveStringReferences(o: BibStringComponent, seenBeforeStack: { [key: string]: boolean },
                                        alreadyResolved: { [key: string]: /*Resolved*/FieldValue },
                                        refs: { [key: string]: FieldValue }): BibStringData {
    return o.data.map(datum => {
        if (isString(datum) || isNumber(datum)) return datum;
        else if (isStringRef(datum)) return resolveStringRef(seenBeforeStack, refs, datum, alreadyResolved);
        else if (isBibStringComponent(datum)) return copyWithResolvedStringReferences(datum, seenBeforeStack, alreadyResolved, refs);
        else throw new Error();
    });
}

export function resolveStringReference(seenBeforeStack: { [key: string]: boolean },
                                       alreadyResolved: { [p: string]: FieldValue },
                                       refs: { [p: string]: FieldValue },
                                       data: FieldValue): FieldValue {
    if (isNumber(data)) {
        return data;
    } else if (isOuterBracedString(data) || isOuterQuotedString(data)) {
        return copyOuterWithResolvedStringReferences(data, seenBeforeStack, alreadyResolved, refs);
    }
    if (isStringRef(data)) {
        return resolveStringRef(seenBeforeStack, refs, data, alreadyResolved);
    }

    // else if (isBibStringComponent(data))
    //     return data.copyWithResolvedStringReferences(alreadyResolved, refs);
    // else throw new Error();
    return data;
}


export function copyWithResolvedStringReferences(obj: BibStringComponent,
                                                 seenBeforeStack: { [key: string]: boolean },
                                                 alreadyResolved: { [key: string]: /*Resolved*/FieldValue },
                                                 refs: { [key: string]: FieldValue }): OuterQuotedString | OuterBracedString {
    const newData = resolveStringReferences(obj, seenBeforeStack, alreadyResolved, refs);

    const braceDepth: number = obj.braceDepth;
    if (isQuotedString(obj))
        return new QuotedString(braceDepth, newData);
    if (isBracedString(obj))
        return new BracedString(braceDepth, newData);
    if (isOuterQuotedString(obj))
        return new OuterQuotedString(newData);
    if (isOuterBracedString(obj))
        return new OuterBracedString(newData);
    else
        throw new Error();
}

export function copyOuterWithResolvedStringReferences(obj: OuterQuotedString | OuterBracedString,
                                                      seenBeforeStack: { [key: string]: boolean },
                                                      alreadyResolved: { [key: string]: /*Resolved*/FieldValue },
                                                      refs: { [key: string]: FieldValue }): OuterQuotedString | OuterBracedString {
    const copied = copyWithResolvedStringReferences(
        obj,
        seenBeforeStack,
        alreadyResolved,
        refs
    );
    if (!isOuterBracedString(copied) && !isOuterQuotedString(copied)) throw new Error();
    return copied;
}

function resolveStringRef(seenBeforeStack: { [key: string]: boolean },
                          refs: { [key: string]: FieldValue },
                          data: StringRef,
                          alreadyResolved: { [key: string]: FieldValue }): FieldValue {
    const refName = data.stringref;
    if (seenBeforeStack[refName])
        throw new Error("Cycle detected: " + refName);
    if (alreadyResolved[refName]) {
        return alreadyResolved[refName];
    }
    if (!refs[refName])
        throw new Error("Unresolved reference: " + JSON.stringify(data));

    alreadyResolved[refName] = resolveStringReference(
        Object.assign({}, seenBeforeStack, {[refName]: true}),
        alreadyResolved,
        refs,
        refs[refName]
    );
    return alreadyResolved[refName];
}