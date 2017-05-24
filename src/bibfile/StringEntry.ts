import {KeyVal, isKeyVal, newKeyVal} from "./KeyVal";
import {FieldValue} from "./BibEntry";
import {isStringRef} from "./string/StringRef";

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

// todo
// export class ResolvedStringEntry extends StringEntry {
//     readonly resolvedValue: Stringy[];
//
//     public constructor(key: string, value: Stringy[], resolvedValue: DefiniteStringy[]) {
//         super("string");
//         this.key = key;
//         this.value = value;
//         this.resolvedValue = resolvedValue;
//     }
// }

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

function resolveStringObjects(seenBeforeStack: { [key: string]: boolean },
                              compiledSoFar: { [key: string]: /*Resolved*/StringEntry },
                              rawStrings: { [key: string]: StringEntry },
                              strObj: any) {
    if (isStringRef(strObj)) {
        const refName = strObj.stringref;
        if (seenBeforeStack[refName])
            throw new Error("Cycle detected: " + refName);
        if (compiledSoFar[refName])
            return compiledSoFar[refName];
        if (!rawStrings[refName])
            throw new Error("Unresolved reference: " + JSON.stringify(strObj));
        //console.log("RESOLVE", refName);

        // TODO
        // compiledSoFar[refName] = resolveStringDeclarations(
        //     Object.assign({}, seenBeforeStack, {[refName]: true}),
        //     rawStrings[refName],
        //     compiledSoFar,
        //     rawStrings
        // );
        return compiledSoFar[refName];
    }
    else
        return strObj;
}


// todo
// function resolveStringDeclarations(referenceStack: { [key: string]: boolean },
//                                    wrapper: FieldValue,
//                                    compiledSoFar: { [key: string]: StringEntry },
//                                    rawStrings: Abbreviations) {
//     if (isNumber(wrapper))
//         return wrapper;
//
//     if (wrapper.type === "quotedstringwrapper") {
//         return new StringValue({
//             type: wrapper.type,
//             data: wrapper.data.map(obj => parseStringObject(
//                 referenceStack,
//                 compiledSoFar,
//                 rawStrings,
//                 obj))
//         });
//     }
//     else if (wrapper.type === "bracedstringwrapper")
//         return new StringValue(wrapper);
//     else
//         throw new Error("Unexpected object to resolve: " + JSON.stringify(wrapper));
// }

//
// export function resolveStringEntries(keyvals: { [key: string]: StringEntry): { [key: string]: ResolvedStringEntry } {
//     const refs: { [key: string]: ResolvedStringEntry } = {};
//     Object.keys(keyvals).forEach(key => {
//         if (!refs[key])
//             refs[key] = resolveStringDeclarations({}, keyvals[key], refs, keyvals);
//     }
//     return refs;
// }

export function newStringNode(data: any): StringEntry {
    const {key, value}: KeyVal = findKeyVal(data);
    return new StringEntry(key, value);
}
