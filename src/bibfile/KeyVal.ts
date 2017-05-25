
import {FieldValue, parseFieldValue} from "./BibEntry";

export interface KeyVal {
    readonly key: string;
    readonly value: FieldValue;
}

export function isKeyVal(data: any): data is KeyVal {
    return typeof data.key === "string"
        && data.value !== undefined;
}

export function newKeyVal(data: any): KeyVal {
    if (isKeyVal(data)) {
        return {
            key: data.key,
            value: parseFieldValue(data.value),
        };
    } else {
        throw new Error("Was not a KeyVal: " + JSON.stringify(data));
    }
}