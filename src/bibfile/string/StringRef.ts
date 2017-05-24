export interface StringRef {
    stringref: string;
}

export function newStringRef(stringref: string) {
    return {stringref};
}
export function isStringRef(stringref: any): stringref is StringRef {
    return typeof stringref.stringref === "string";
}