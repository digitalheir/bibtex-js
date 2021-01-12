"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Token_1 = require("./Token");
var WhitespaceToken_1 = require("./WhitespaceToken");
var NumericToken_1 = require("./NumericToken");
var IdToken_1 = require("./IdToken");
var BibBlockTypes_1 = require("./BibBlockTypes");
var Lexer = (function () {
    function Lexer(string) {
        this.str = string;
        this.len = string.length;
        this.pos = 0;
    }
    Lexer.prototype.getStringUntilNonEscapedChar = function (terminalRegex) {
        var chars = [];
        for (var i = this.pos; i < this.len + 1; i++) {
            this.pos = i;
            if (this.str.charAt(i) == "\\" && this.str.charAt(i + 1).match(terminalRegex)) {
                i++;
                this.pos = i;
            }
            else if (this.str.charAt(i).match(terminalRegex)) {
                break;
            }
            chars.push(this.str.charAt(i));
        }
        return chars.join("");
    };
    Lexer.prototype.readTokens = function () {
        var tokens = [];
        var nextToken;
        while (nextToken = this.readNextToken())
            tokens.push(nextToken);
        return tokens;
    };
    Lexer.prototype.readNextToken = function () {
        if (this.pos >= this.str.length)
            return undefined;
        var currentChar = this.str.charAt(this.pos);
        if (WhitespaceToken_1.isSingleWhiteSpaceCharacter(currentChar))
            return this.eatWhiteSpace();
        else if (Token_1.isSpecialChar(currentChar)) {
            return this.eatSpecialChars(currentChar);
        }
        else if (NumericToken_1.isNum(currentChar)) {
            return this.eatNumericString(currentChar);
        }
        else {
            return this.eatIdString();
        }
    };
    Lexer.prototype.eatIdString = function () {
        var chars = [];
        var pos2 = this.pos;
        for (var i = pos2; i < this.len + 1; i++) {
            this.pos = i;
            var charAtI = this.str.charAt(i);
            if (!IdToken_1.isIdChar(charAtI)) {
                break;
            }
            else {
                chars.push(charAtI);
            }
        }
        return IdToken_1.newIdToken(chars.join("").trim());
    };
    Lexer.prototype.eatNumericString = function (startAt) {
        var nums = [startAt];
        var nextPos = this.pos + 1;
        for (var newPos = nextPos; newPos < this.len + 1; newPos++) {
            this.pos = newPos;
            var newChar = this.str.charAt(newPos);
            if (NumericToken_1.isNum(newChar))
                nums.push(newChar);
            else
                break;
        }
        var numericString = nums.join("");
        if (nums[0] === "0")
            return NumericToken_1.newNumber(numericString);
        else {
            var number = Number.parseInt(numericString);
            return Number.isFinite(number) ? number : NumericToken_1.newNumber(numericString);
        }
    };
    Lexer.prototype.eatSpecialChars = function (startAt) {
        this.pos++;
        if (startAt === "@") {
            var type = this.getStringUntilNonEscapedChar("{").trim().toLowerCase();
            if (BibBlockTypes_1.isBibType(type))
                return Token_1.newToken(BibBlockTypes_1.bibTypes[type], type);
            else
                return Token_1.newToken("@bib", type);
        }
        return startAt;
    };
    Lexer.prototype.eatWhiteSpace = function () {
        var chars = [];
        while (this.pos < this.len + 1) {
            var c = this.str.charAt(this.pos);
            if (WhitespaceToken_1.isSingleWhiteSpaceCharacter(c)) {
                chars.push(c);
                this.pos++;
            }
            else
                break;
        }
        return WhitespaceToken_1.newWhitespace(chars.join(""));
    };
    return Lexer;
}());
exports.default = Lexer;
//# sourceMappingURL=Lexer.js.map