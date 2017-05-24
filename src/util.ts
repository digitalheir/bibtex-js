export function isString(data: any): data is string {
    return typeof data === "string";
}
export function mustBeString(str: any, o?: any): string {
    if (typeof str !== "string")
        throw new Error("Expected to be string: " + JSON.stringify(o ? o : str));
    return str;
}

export function isArray(data: any): data is any[] {
    return !!data && data.constructor === Array
}

export function flattenArray(obj: any[]): any[] {
    let newArray: any[] = [];
    obj.forEach((o: any[]) => {
        if (isArray(o)) newArray = newArray.concat(o);
        else newArray.push(o);
    });
    return newArray;
}