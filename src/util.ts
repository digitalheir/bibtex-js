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
    if (t === undefined)
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

export const flattenMyArray = function (arr: any[], result?: any[]): any[] {
    if (!result) result = [];
    for (let i = 0, length = arr.length; i < length; i++) {
        const value: any = arr[i];
        if (Array.isArray(value)) {
            for (let i = 0, length = value.length; i < length; i++) {
                const value2: any = value[i];
                if (Array.isArray(value2)) {
                    flattenMyArray(value2, result);
                } else {
                    result.push(value2);
                }
            }
        } else {
            result.push(value);
        }
    }
    return result;
};