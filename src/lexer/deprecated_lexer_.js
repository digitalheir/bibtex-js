//const LITERAL = 'literal';
//// http://ftp.math.purdue.edu/mirrors/ctan.org/info/bibtex/tamethebeast/ttb_en.pdf
//const modes = {
//  OUTSIDE_ENTRY: 'OUTSIDE_ENTRY',
//  ENTRY_TYPE: 'ENTRY_TYPE',
//  COMMENT_ENTRY: 'COMMENT_ENTRY',
//  BIB_ENTRY: 'BIB_ENTRY',
//  PREAMBULE: 'PREAMBULE',
//  CITATION_KEY: 'CITATION_KEY',
//  FIELD_KEY: 'FIELD_KEY',
//  FIELD_VAL: 'FIELD_VAL',
//};
//
//class TypedToken {
//  constructor(type, string) {
//    this.type = type;
//    this.string = string;
//  }
//}
//
//export default class Lexer {
//  constructor(string) {
//    this.str = string;
//    this.len = string.length;
//    this.pos = 0;
//    this.mode = modes.OUTSIDE_ENTRY;
//  }
//
//  /**
//   * Anything that is not a bibtex object (meaning "@TYPE{...}", is considered a comment and ignored. We suppose
//   * users can escape @ by prefixing a backslash
//   *
//   * A BibTeX tag is specified by its name followed by an equals-sign and the content. The tag's name is not
//   * case-sensitive. The content needs to be enclosed by either curly braces or quotation-marks. Which form
//   * of enclosure is used is depending on the user's taste, and both can be applied together in a single
//   * BibTeX entry, but there is one difference between those two methods: When quotation-marks are used, string
//   * concatenation using # is possible, but not when braces are used.
//   *
//   * @returns TypedToken object or null
//   */
//  readNextToken() {
//    this.skipnontokens();
//    if (this.pos >= this.str.length) return null;
//
//    switch (this.mode) {
//      case modes.OUTSIDE_ENTRY:
//        if (this.str.charAt(this.pos) == '@') {
//          // Start entry type
//          this.mode = modes.ENTRY_TYPE;
//          this.pos++;
//          return new TypedToken('@', '@');
//        } else {
//          // Still comment
//          const chars = [];
//          for (let i = this.pos; i < this.len; i++) {
//            if (this.str.charAt(i) == '\\' && this.str.charAt(i + 1) == '@') {
//              i++;
//            } else if (this.str.charAt(i) == '@') break;
//            this.pos = i;
//            chars.push(this.str.charAt(i));
//          }
//          return new TypedToken(modes.OUTSIDE_ENTRY, chars.join("").trim());
//        }
//      case modes.ENTRY_TYPE:
//        if (this.str.charAt(this.pos) == '{') {
//          // Start intra-entry
//          switch (this.entryType) {
//            case 'preambule':
//              this.mode = modes.PREAMBULE;
//              break;
//            case 'comment':
//              this.mode = modes.COMMENT_ENTRY;
//              break;
//            default:
//              this.mode = modes.CITATION_KEY;
//              break;
//          }
//          // console.log("mode is now " + this.mode);
//          this.pos++;
//          return new TypedToken('{', '{');
//        }
//        // Anything until non-escaped {
//        let str = this.getStringUntilNonEscapedChar('{');
//        this.entryType = str.trim().toLowerCase();
//        return new TypedToken(modes.ENTRY_TYPE, this.entryType);
//      case modes.CITATION_KEY:
//        // Everything until non-escaped comma
//        let charAtCK = this.str.charAt(this.pos);
//        if (charAtCK == '}' || charAtCK == ',') {
//          this.pos++;
//          this.mode = modes.FIELD_KEY;
//          return new TypedToken(charAtCK, charAtCK);
//        } else return new TypedToken(modes.CITATION_KEY, this.getStringUntilNonEscapedChar(',').trim());
//      case modes.FIELD_KEY:
//        // Should be [A-Za-z0-9] but we're lax; we parse until the first =
//        let charAtFK = this.str.charAt(this.pos);
//        if (charAtFK == '}' || charAtFK == '=') {
//          this.pos++;
//          this.mode = charAtFK == '}' ? modes.OUTSIDE_ENTRY : modes.FIELD_VAL;
//          return new TypedToken(charAtFK, charAtFK);
//        } else return new TypedToken(modes.FIELD_KEY, this.getStringUntilNonEscapedChar('=').trim());
//      case modes.FIELD_VAL:
//        let charAtFV = this.str.charAt(this.pos);
//        if (charAtFV == '}' || charAtFV == ',') {
//          this.pos++;
//          this.mode = charAtFV == '}' ? modes.OUTSIDE_ENTRY : modes.FIELD_KEY;
//          return new TypedToken(charAtFV, charAtFV);
//        } else return new TypedToken(modes.FIELD_VAL, this.getStringUntilNonEscapedChar(/[,}]/).trim());
//      case modes.PREAMBULE:
//      case modes.COMMENT_ENTRY:
//        // Everything until non-escaped }
//        if (this.str.charAt(this.pos) == '}') {
//          this.mode = modes.OUTSIDE_ENTRY;
//          this.pos++;
//          return new TypedToken('{', '{');
//        } else {
//          return new TypedToken(modes.COMMENT_ENTRY, this.getStringUntilNonEscapedChar('}'));
//        }
//      case modes.BIB_ENTRY:
//        // Identifier
//        return new TypedToken(modes.COMMENT_ENTRY, "");
//      default:
//        throw new Error();
//    }
//  }
//
//  getStringUntilNonEscapedChar(terminalRegex) {
//    if (typeof terminalRegex === 'string') {
//
//    }
//    const chars = [];
//    for (let i = this.pos; i < this.len; i++) {
//      this.pos = i;
//      if (this.str.charAt(i) == '\\' && this.str.charAt(i + 1).match(terminalRegex)) {
//        i++;
//        this.pos = i;
//      } else if (this.str.charAt(i).match(terminalRegex)) {
//        break;
//      }
//      chars.push(this.str.charAt(i));
//    }
//    return chars.join("");
//  }
//
//
//  readIdChars() {
//    let fromPost = this.pos;
//
//
//  }
//
//  skipnontokens() {
//    while (this.pos < this.len) {
//      var c = this.str.charAt(this.pos);
//      switch (this.mode) {
//        case this.mode.OUTSIDE_ENTRY:
//          // Outside of entries, ignore everything up to the first @
//          if (c == '@') return;
//          else this.pos++;
//          break;
//        default:
//          // Within entries, ignore whitespaces between tokens
//          switch (c) {
//            case ' ':
//            case '\t':
//            case '\r':
//            case '\n':
//              console.log("non-token at " + this.pos);
//              this.pos++;
//              break;
//            default:
//              return;
//            // throw new Error();
//          }
//      }
//    }
//  }
//}
