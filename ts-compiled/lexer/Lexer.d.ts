import { Token } from "./Token";
export default class Lexer {
    private str;
    private len;
    private pos;
    constructor(string: string);
    getStringUntilNonEscapedChar(terminalRegex: RegExp | string): string;
    readTokens(): Token[];
    readNextToken(): Token | undefined;
    private eatIdString();
    private eatNumericString(startAt);
    private eatSpecialChars(startAt);
    private eatWhiteSpace();
}
