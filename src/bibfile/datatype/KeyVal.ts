import {OuterBracedString} from "./string/BracedString";
import {OuterQuotedString} from "./string/QuotedString";
import {isNumber, mustBeArray} from "../../util";
import {parseStringComponent} from "./string/bib-string-utils";
import {BibOuterStringComponent} from "./string/BibStringComponent";

/**
 * A key to value mapping such as `field = {name}`.
 */
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

export function parseFieldValue(value: any): FieldValue {
    if (isNumber(value)) {
        return value;
    }

    const data = mustBeArray(value.data);
    switch (value.type) {
        case "quotedstringwrapper":
            if (data.length === 1 && isNumber(data[0]))
            // A single number is in a quoted string wrapper
            // because the parser considered it part of a
            // concatenated string
                return data[0];

            return new OuterQuotedString(data.map(e => parseStringComponent(0, e)));

        case "bracedstringwrapper":
            return new OuterBracedString(data.map(e => parseStringComponent(0, e)));

        default:
            throw new Error("Unexpected value: " + JSON.stringify(value));
    }
}

/**
 * Values (i.e. right hand sides of each assignment) can be either between curly braces or between
 * double quotes. The main difference is that you can write double quotes in the first case, and not
 * in the second case.
 *
 * For numerical values, curly braces and double quotes can be omitted.
 */
export type FieldValue = number | BibOuterStringComponent;

export function normalizeFieldValue(field?: FieldValue): string | number | undefined {
    if(!field) return undefined;
    if(isNumber(field)) return field;
    else return field.stringify();
}