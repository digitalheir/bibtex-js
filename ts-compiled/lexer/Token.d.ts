export declare type Token = TypedToken | string | number;
export interface TypedToken {
    type: string;
    string?: string;
}
export declare function newToken(type: string, string: string): TypedToken;
export declare const specialChars: {
    "@": boolean;
    "(": boolean;
    ")": boolean;
    "{": boolean;
    "}": boolean;
    "#": boolean;
    "=": boolean;
    ",": boolean;
    "\\": boolean;
    "\"": boolean;
};
export declare type SpecialChar = keyof typeof specialChars;
export declare function isSpecialChar(c: string): c is SpecialChar;
export declare const escapableChars: {
    "\\": boolean;
    "@": boolean;
    "{": boolean;
    "}": boolean;
};
export declare type EscapableChar = keyof typeof escapableChars;
export declare function isEscapableChar(c: string): c is EscapableChar;
