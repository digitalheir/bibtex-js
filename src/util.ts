export function isString(data: any): data is string {
    return typeof data === "string";
}

export function isNumber(data: any): data is number {
    return typeof data === "number";
}

export function mustBeString(str: any, o?: any): string {
    if (typeof str !== "string")
        throw new Error("Expected to be string: " + JSON.stringify(o ? o : str));
    return str;
}

export function mustBeDefined<T>(t?: T, o?: any): T {
    if (t === undefined || t === null)
        throw new Error("Expected to be defined: " + JSON.stringify(o ? o : t));
    return t;
}
export function mustBeArray(str: any, o?: any): any[] {
    if (!isArray(str))
        throw new Error("Expected to be array: " + JSON.stringify(o ? o : str));
    return str;
}

export function isArray(data: any): data is any[] {
    return !!data && data.constructor === Array;
}

export function flattenArray(obj: any[]): any[] {
    return flatten(obj);
}

export function flatten(x: any[]): any[] {
    let flattened: any[] = [];
    x.forEach((el: any) => {
        if (isArray(el)) {
            flattened = flattened.concat(flatten(el));
        } else
            flattened.push(el);
    });
    return flattened;
}