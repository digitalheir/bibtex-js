export type Token = TypedToken | string | number;

export interface TypedToken {
    type: string;
    string?: string;
}

export function newToken(type: string, string: string): TypedToken {
    return {
        type,
        string
    };
}


export const specialChars = {
    "@": true,
    "(": true,
    ")": true,
    "{": true,
    "}": true,
    "#": true,
    "=": true,
    ",": true,
    "\\": true,
    "\"": true,
};

export type SpecialChar = keyof typeof specialChars;

export function isSpecialChar(c: string): c is SpecialChar {
    return specialChars.hasOwnProperty(c);
}


export const escapableChars = {
    "\\": true,
    "@": true,
    "{": true,
    "}": true
};

export type EscapableChar = keyof typeof escapableChars;

export function isEscapableChar(c: string): c is EscapableChar {
    return escapableChars.hasOwnProperty(c);
}
