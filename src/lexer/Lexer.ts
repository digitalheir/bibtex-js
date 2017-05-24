import {TypedToken, isSpecialChar, newToken, Token} from "./Token";
import {isSingleWhiteSpaceCharacter, WhitespaceToken, SingleWhitespace, newWhitespace} from "./WhitespaceToken";
import {isNum, NumericChar, NumberToken, newNumber} from "./NumericToken";
import {IdToken, isIdChar, newIdToken} from "./IdToken";
import {isBibType, bibTypes} from "./BibBlockTypes";

export default class Lexer {
    private str: string;
    private len: number;
    private pos: number;

    constructor(string: string) {
        this.str = string;
        this.len = string.length;
        this.pos = 0;
    }

    getStringUntilNonEscapedChar(terminalRegex: RegExp | string): string {
        // if (typeof terminalRegex === 'string') {
        // }
        const chars = [];
        for (let i = this.pos; i < this.len + 1; i++) {
            this.pos = i;
            if (this.str.charAt(i) == '\\' && this.str.charAt(i + 1).match(terminalRegex)) {
                i++;
                this.pos = i;
            } else if (this.str.charAt(i).match(terminalRegex)) {
                break;
            }
            chars.push(this.str.charAt(i));
        }
        return chars.join("");
    }

    readTokens(): Token[] {
        const tokens: Token[] = [];
        let nextToken;
        while (nextToken = this.readNextToken())
            tokens.push(nextToken);
        return tokens;
    }

    readNextToken(): Token | undefined {
        if (this.pos >= this.str.length)
            return undefined;

        let currentChar: string = this.str.charAt(this.pos);

        if (isSingleWhiteSpaceCharacter(currentChar))
            return this.eatWhiteSpace();
        else if (isSpecialChar(currentChar)) {
            return this.eatSpecialChars(currentChar);
        } else if (isNum(currentChar)) {
            return this.eatNumericString(currentChar);
        } else {
            return this.eatIdString();
        }
    }

    // NOTE: not needed? delete?
    // isEscapeChar(i: number): boolean {
    //     if (this.str.charAt(i) == '\\') {
    //         // Might be an escaped character
    //         const nextChar = this.str.charAt(i + 1);
    //
    //         // We've escaped a special character
    //         return isEscapableChar(nextChar);
    //     } else return false;
    // }

    private eatIdString(): IdToken {
        // id
        let chars = [];
        const pos2 = this.pos;
        for (let i = pos2; i < this.len + 1; i++) {
            this.pos = i;
            // console.log(this.pos, i);
            // console.log(this.pos, this.str.charAt(i));
            const charAtI = this.str.charAt(i);
            if (!isIdChar(charAtI)) {
                break;
                //else if (charAtI == '\\' && (this.str.charAt(i + 1) == '\\' || isSpecialChar(this.str.charAt(i + 1)))) {
                //  i++;
                //  this.pos = i;
                //  chars.push(this.str.charAt(i));
            } else {
                chars.push(charAtI);
            }
        }

        return newIdToken(chars.join("").trim());
    }

    private eatNumericString(startAt: NumericChar): number | NumberToken {
        const nums: NumericChar[] = [startAt];

        const nextPos = this.pos + 1;
        for (let newPos = nextPos; newPos < this.len + 1; newPos++) {
            this.pos = newPos;

            const newChar = this.str.charAt(newPos);
            if (isNum(newChar))
                nums.push(newChar);
            else
                break;
        }

        const numericString: string = nums.join("");

        if (nums[0] === "0")  // If it starts with 0, return as a string
            return newNumber(numericString);
        else {
            const number = Number.parseInt(numericString);
            return Number.isFinite(number) ? number : newNumber(numericString);
        }
    }

    private eatSpecialChars(startAt: string): string | TypedToken {
        this.pos++;
        if (startAt === "@") {
            const type = this.getStringUntilNonEscapedChar("{").trim().toLowerCase();
            if (isBibType(type))
                return newToken(bibTypes[type], type);
            else
                return newToken("@bib", type);
        }
        return startAt;
    }

    private eatWhiteSpace(): WhitespaceToken {
        const chars: SingleWhitespace[] = [];
        while (this.pos < this.len + 1) {
            const c = this.str.charAt(this.pos);
            // ignore whitespaces
            if (isSingleWhiteSpaceCharacter(c)) {
                chars.push(c);
                this.pos++;
            } else break;
        }
        return newWhitespace(chars.join(""));
    }
}