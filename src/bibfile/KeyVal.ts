import {ComplexString, parseComplexStringOuter} from "./string/ComplexString";

export interface KeyVal {
    readonly key: string;
    readonly value: ComplexString[];
}

export function isKeyVal(data: any): data is KeyVal {
    return typeof data.key === "string"
        && data.value !== undefined
}

export function newKeyVal(data: any): KeyVal {
    if (isKeyVal(data)) {
        return {
            key: data.key,
            value: parseComplexStringOuter(data.value),
        };
    } else {
        throw new Error("Was not a KeyVal: " + JSON.stringify(data));
    }
}