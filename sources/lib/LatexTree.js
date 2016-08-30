/**
 * @fileoverview LaTeX syntax tree structure elements
 * This file is a part of TeXnous project.
 *
 * @copyright TeXnous project team (http://texnous.com) 2016
 * @license LGPL-3.0
 *
 * This library is free software; you can redistribute it and/or modify it under the terms of the
 * GNU Lesser General Public License as published by the Free Software Foundation; either version 3
 * of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License along with this library;
 * if not, write to the Free Software Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA
 * 02111-1307, USA.
 */

'use strict';

/** @module */


/** @external Latex */
const Latex = require('./Latex'); // general LaTeX definitions
/** @external LatexStyle*/
const LatexStyle = require('./LatexStyle'); // LaTeX style structures
/** @external SyntaxTree */
const SyntaxTree = require('./SyntaxTree'); // syntax tree structure elements


/**
 * LaTeX syntax tree structure
 * @class
 * @extends SyntaxTree
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */
module.exports = class extends SyntaxTree {
  //noinspection JSUnusedGlobalSymbols
  /**
   * Constructor
   * @param {!Token} rootToken the root token (must have no parent and no tree)
   * @param {string} source the sources text that has this syntax tree
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  constructor(rootToken, source) {
    if (!(rootToken instanceof Token))
      throw new TypeError('"rootToken" isn\'t a LatexTree.Token instance');
    super(rootToken, source); // the superclass constructor
  }
};



/**
 * LaTeX syntax tree token base properties
 * @interface TokenProperties
 * @property {(?Token|undefined)} parentToken - The parent token or null if there is no parent
 * @property {(!Array.<Token>|undefined)} childTokens - The list of the child tokens
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */



/**
 * LaTeX syntax tree token base structure
 * @class
 * @extends SyntaxTree.Node
 * @property {(Latex.Lexeme|null)} lexeme - The logical lexeme of the token
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */
const Token = module.exports['Token'] = class extends SyntaxTree.Node {
  //noinspection JSUnusedGlobalSymbols
  /**
   * Constructor
   * @param {!TokenProperties=} opt_initialProperties the initial property values
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  constructor(opt_initialProperties) {
    if (opt_initialProperties === undefined) { // if the initial properties are not set
      super(); // superclass constructor
    } else if (opt_initialProperties instanceof Object) { // if the initial properties are set
      // superclass constructor
      // superclass initial properties
      let superInitialProperties = Object.create(opt_initialProperties);
      superInitialProperties.parentNode = opt_initialProperties.parentToken;
      superInitialProperties.childNodes = opt_initialProperties.childTokens;
      super(superInitialProperties);
    } else { // if the initial properties are in unsupported type
      throw new TypeError('"initialProperties" isn\'t an Object instance');
    }
  }


  /**
   * Get the string representation of this node
   * @param {boolean=false} skipNodeClass
   *        true to not include the node class name into the output, false otherwise
   * @return {string} the sources string
   * @override
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  toString(skipNodeClass) {
    return skipNodeClass ? super.toString(true) : 'LatexTree.Token{' + super.toString(true) + '}';
  }
};
Object.defineProperties(Token.prototype, { // default properties
  lexeme: { value: null, enumerable: true }, // no lexeme
  parentNodeClass_: { value: Token } // parent node must be an EnvironmentToken instance
});



/**
 * LaTeX symbol token properties
 * @interface SymbolTokenProperties
 * @extends TokenProperties
 * @property {!LatexStyle.Symbol|undefined} symbol -
 *           The LaTeX symbol or undefined if the symbol is unrecognized
 * @property {string|undefined} pattern - The pattern that corresponds to the unrecognized symbol
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */



/**
 * LaTeX symbol token structure
 * @class
 * @extends Token
 * @property {?LatexStyle.Symbol} symbol -
 *           The corresponding LaTeX symbol or null if the symbol is unrecognized
 * @property {string} pattern - The symbol LaTeX pattern
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */
const SymbolToken = module.exports['SymbolToken'] = class extends Token {
  //noinspection JSUnusedGlobalSymbols
  /**
   * Constructor
   * @param {!SymbolTokenProperties} initialProperties the initial property values
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  constructor(initialProperties) {
    if (!(initialProperties instanceof Object))
      throw new TypeError ('"initialProperties" isn\'t an Object instance');
    super(initialProperties); // the superclass constructor
    if (initialProperties.symbol) { // if the symbol is defined
      if (!(initialProperties.symbol instanceof LatexStyle.Symbol))
        throw new TypeError('"initialProperties.symbol" isn\'t a LatexStyle.Symbol instance');
      // store the symbol
      Object.defineProperty(this, 'symbol', {value: initialProperties.symbol, enumerable: true});
    } else { // if the symbol isn't defined
      if (typeof initialProperties.pattern !== 'string')
        throw new TypeError('"initialProperties.pattern" isn\'t a string');
      // store the unrecognized pattern
      Object.defineProperty(this, 'pattern', { value: initialProperties.pattern });
    }
  }


  /**
   * Get the logical lexeme
   * @return {(Latex.Lexeme|null)} the lexeme or null if the lexeme isn't defined
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  get lexeme () {
    //noinspection JSUnresolvedVariable
    return this.symbol ? this.symbol.lexeme : null;
  }


  /**
   * Get the symbol LaTeX pattern
   * @return {string} the symbol pattern
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  get pattern () {
    //noinspection JSUnresolvedVariable
    return this.symbol.pattern;
  }


  /**
   * Get the string representation of this node
   * @param {boolean=false} skipNodeClass
   *        true to not include the node class name into the output, false otherwise
   * @return {string} the sources string
   * @override
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  toString(skipNodeClass) {
    let source = '';
    let iParameter = 0; // the parameter iterator
    //noinspection JSUnresolvedVariable
    let pattern = this.pattern; // LaTeX input pattern
    // for all the pattern chars
    for (
      let nPatternChars = pattern.length, iPatternChar = 0;
      iPatternChar < nPatternChars;
      ++iPatternChar
    ) {
      let patternChar = pattern[iPatternChar]; // the pattern char
      if (patternChar === '#') { // if a parameter place
        ++iPatternChar; // go to the next pattern char
        let parameterToken = this.childNode(iParameter++); // try to get the parameter token
        source += parameterToken ? parameterToken.toString(true) : '??';
      } else { // if the ordinary pattern char
        source += patternChar;
      }
    }
    return skipNodeClass ?
      source :
      'LatexTree.SymbolToken' + (this.symbol ? '' : '[?]') + '{' + source + '}';
  }
};
Object.defineProperties(SymbolToken.prototype, { // default properties
  symbol: { value: null, enumerable: true } // no symbol token
});
Object.defineProperties(SymbolToken.prototype, { // make getters and setters enumerable
  pattern: { enumerable: true }
});



/**
 * LaTeX parameter token properties
 * @interface ParameterTokenProperties
 * @extends TokenProperties
 * @property {boolean} hasBrackets -
 *           True if the parameter is bounded by the logical brackets, false otherwise
 * @property {boolean} hasSpacePrefix -
 *           True if the parameter is prefixed by a space, false otherwise
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */



/**
 * LaTeX parameter token structure
 * @class
 * @extends Token
 * @property {boolean} hasBrackets -
 *           True if the parameter is bounded by the logical brackets, false otherwise
 * @property {boolean} hasSpacePrefix -
 *           True if the parameter is prefixed by a space, false otherwise
 * @property {?LatexStyle.Parameter} parameter - The corresponding LaTeX parameter
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */
const ParameterToken = module.exports['ParameterToken'] = class extends Token {
  //noinspection JSUnusedGlobalSymbols
  /**
   * Constructor
   * @param {!ParameterTokenProperties} initialProperties the initial property values
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  constructor(initialProperties) {
    if (!(initialProperties instanceof Object))
      throw new TypeError ('"initialProperties" isn\'t an Object instance');
    super(initialProperties); // the superclass constructor
    if (!initialProperties.hasBrackets) // if there are no bounding brackets
      // store this fact
      Object.defineProperty(this, 'hasBrackets', { value: false, enumerable: true });
    if (initialProperties.hasSpacePrefix) // if there is a space before
      // store this fact
      Object.defineProperty(this, 'hasSpacePrefix', { value: true, enumerable: true });
  }


  /**
   * Get the logical lexeme
   * @return {(Latex.Lexeme|null)} the lexeme or null if the lexeme isn't defined
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  get lexeme () { return this.parameter && this.parameter.lexeme }


  /**
   * Get the corresponding LaTeX parameter description
   * @return {?LatexStyle.Parameter}
   *         the LaTeX parameter or null of there is parent symbol or such a parameter
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  get parameter () {
    /** @type {?SymbolToken} */
    let symbolToken = this.parentNode; // get the symbol token
    //noinspection JSUnresolvedFunction
    return symbolToken && symbolToken.symbol.parameter(symbolToken.childIndex(this));
  }


  /**
   * Get the string representation of this node
   * @param {boolean=false} skipNodeClass
   *        true to not include the node class name into the output, false otherwise
   * @return {string} the sources string
   * @override
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  toString(skipNodeClass) {
    let source = this.hasSpacePrefix ? ' ' : '';
    source += this.hasBrackets ? '{' + super.toString(true) + '}' : super.toString(true);
    return skipNodeClass ? source : 'LatexTree.ParameterToken{' + source + '}';
  }
};
Object.defineProperties(ParameterToken.prototype, { // default properties
  hasBrackets: { value: true, enumerable: true }, // there are bounding brackets
  hasSpacePrefix: { value: false, enumerable: true }, // there is no space before
  parentNodeClass_: { value: SymbolToken } // parent node must be a SymbolToken instance
});
Object.defineProperties(ParameterToken.prototype, { // make getters and setters enumerable
  parameter: { enumerable: true }
});



/**
 * LaTeX command token properties
 * @interface CommandTokenProperties
 * @extends TokenProperties
 * @property {!LatexStyle.Command|undefined} command -
 *           The LaTeX command or undefined if the command is unrecognized
 * @property {string|undefined} name - The name that corresponds to the unrecognized command
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */



/**
 * LaTeX command token structure
 * @class
 * @extends SymbolToken
 * @property {!LatexStyle.Command} command -
 *           The corresponding LaTeX command or null if the command is unrecognized
 * @property {string|undefined} name - The LaTeX command name
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */
const CommandToken = module.exports['CommandToken'] = class extends SymbolToken {
  //noinspection JSUnusedGlobalSymbols
  /**
   * Constructor
   * @param {!CommandTokenProperties} initialProperties the initial property values
   */
  constructor(initialProperties) {
    if (!(initialProperties instanceof Object))
      throw new TypeError ('"initialProperties" isn\'t an Object instance');
    // copy the initial properties for the superclass
    let superInitialProperties = Object.create(initialProperties);
    if (initialProperties.command) { // if the command is defined
      if (!(initialProperties.command instanceof LatexStyle.Command))
        throw new TypeError('"initialProperties.command" isn\'t a LatexStyle.Command instance');
      // the command is the symbol for the superclass
      superInitialProperties.symbol = initialProperties.command;
      super(superInitialProperties); // the superclass constructor
    } else { // if the command isn't defined
      if (typeof initialProperties.name !== 'string')
        throw new TypeError('"initialProperties.name" isn\'t a string');
      superInitialProperties.pattern = '';
      super(superInitialProperties); // the superclass constructor
      // store the unrecognized name
      Object.defineProperty(this, 'name', { value: initialProperties.name });
    }
  }


  /**
   * Get the LaTeX command
   * @return {!LatexStyle.Command} the command description
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  get command () { return this.symbol }


  /**
   * Get the LaTeX command name
   * @return {string} the command name
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  get name () { return this.command.name }

  /**
   * Get the string representation of this node
   * @param {boolean=false} skipNodeClass
   *        true to not include the node class name into the output, false otherwise
   * @return {string} the sources string
   * @override
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  toString(skipNodeClass) {
   let source = '\\' + this.name + super.toString(true);
   return skipNodeClass ?
     source :
     'LatexTree.CommandToken' + (this.command ? '' : '[?]') + '{' + source + '}';
  }
};
Object.defineProperties(CommandToken.prototype, { // make getters and setters enumerable
  command: { enumerable: true },
  name: {enumerable: true }
});



/**
 * LaTeX environment token properties
 * @interface EnvironmentTokenProperties
 * @extends TokenProperties
 * @property {!LatexStyle.Environment} environment - The LaTeX environment
 * @property
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */



/**
 * LaTeX environment token structure
 * @class
 * @extends Token
 * @property {!LatexStyle.Environment} environment - The corresponding LaTeX environment
 * @property {?CommandToken} beginCommandToken -
 *           The environment begin command token or null is there is no such a token
 * @property {?CommandToken} endCommandToken -
 *           The environment end command token or null is there is no such a token
 * @property {?EnvironmentBodyToken} bodyToken -
 *           The environment body token or null is there is no such a token
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */
const EnvironmentToken = module.exports['EnvironmentToken'] = class extends Token {
  //noinspection JSUnusedGlobalSymbols
  /**
   * Constructor
   * @param {!EnvironmentTokenProperties} initialProperties the initial property values
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  constructor(initialProperties) {
    if (!(initialProperties instanceof Object))
      throw new TypeError ('"initialProperties" isn\'t an Object instance');
    super(initialProperties); // the superclass constructor
    if (!(initialProperties.environment instanceof LatexStyle.Environment))
      throw new TypeError(
        '"initialProperties.environment" isn\'t a LatexStyle.Environment instance');
    // store the environment
    Object.defineProperty(this, 'environment', {
      value: initialProperties.environment,
      enumerable: true
    });
  }


  /**
   * Get the logical lexeme
   * @return {(Latex.Lexeme|null)} the lexeme or null if the lexeme isn't defined
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  get lexeme () { return this.environment.lexeme }


  /**
   * Get the begin command token
   * @return {?CommandToken} the command token or null if there is no begin command
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  get beginCommandToken () {
    let beginCommandToken = this.childNode(0);
    return beginCommandToken instanceof CommandToken ? beginCommandToken : null;
  }


  /**
   * Get the end command token
   * @return {?CommandToken} the command token or null if there is no end command
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  get endCommandToken () {
    let endCommandToken = this.childNode(2);
    return endCommandToken instanceof CommandToken ? endCommandToken : null;
  }



  /**
   * Get the environment body token
   * @return {?EnvironmentBodyToken} the body or null if there is no body
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  get bodyToken () {
    let bodyToken = this.childNode(1);
    return bodyToken instanceof EnvironmentBodyToken ? bodyToken : null;
  }


  /**
   * Get the string representation of this node
   * @param {boolean=false} skipNodeClass
   *        true to not include the node class name into the output, false otherwise
   * @return {string} the sources string
   * @override
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  toString(skipNodeClass) {
    let beginCommandToken = this.beginCommandToken; // the begin command token
    let endCommandToken = this.endCommandToken; // the end command token
    let bodyToken = this.bodyToken; // the environment body token
    let source = '\\begin{' + this.environment.name + '}';
    source += beginCommandToken ?
      SymbolToken.prototype.toString.call(beginCommandToken, true) :
      '??';
    source += bodyToken ? bodyToken.toString(true) : '??';
    source += '\\end{' + this.environment.name + '}';
    source += endCommandToken ? SymbolToken.prototype.toString.call(endCommandToken, true) : '??';
    return skipNodeClass ? source : 'LatexTree.EnvironmentToken{' + source + '}';
  }
};
Object.defineProperties(EnvironmentToken.prototype, { // make getters and setters enumerable
  beginToken: { enumerable: true },
  endToken: { enumerable: true }
});



/**
 * LaTeX environment body token structure
 * @class
 * @extends Token
 * @property {?LatexStyle.Environment} environment -
 *           The LaTeX environment or null if there is no parent environment
 * @property {?EnvironmentToken} environmentToken - The parent environment token
 * @property {?CommandToken} beginCommandToken -
 *           The environment begin command token or null is there is no such a token
 * @property {?CommandToken} endCommandToken -
 *           The environment end command token or null is there is no such a token
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */
const EnvironmentBodyToken = module.exports['EnvironmentBodyToken'] = class extends Token {
  //noinspection JSUnusedGlobalSymbols
  /**
   * Get the LaTeX environment
   * @return {?LatexStyle.Environment} the environment or null if there is no parent environment
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  get environment () { return this.parentNode && this.parentNode.environment }


  //noinspection JSUnusedGlobalSymbols
  /**
   * Get the parent environment token
   * @return {?EnvironmentToken} the environment or null if there is no parent environment
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  get environmentToken () { return this.parentNode }


  //noinspection JSUnusedGlobalSymbols
  /**
   * Get the environment begin command token
   * @return {?CommandToken} the command token or null if there is no begin command
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  get beginCommandToken () { return this.parentNode && this.parentNode.beginCommandToken }


  //noinspection JSUnusedGlobalSymbols
  /**
   * Get the environment end command token
   * @return {(CommandToken|null)} the command token or null if there is no end command
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  get endCommandToken () { return this.parentNode && this.parentNode.endCommandToken }


  /**
   * Get the string representation of this node
   * @param {boolean=false} skipNodeClass
   *        true to not include the node class name into the output, false otherwise
   * @return {string} the sources string
   * @override
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  toString(skipNodeClass) {
    return skipNodeClass ?
      super.toString(true) :
      'LatexTree.EnvironmentBodyToken{' + super.toString(true) + '}';
  }
};
Object.defineProperties(EnvironmentBodyToken.prototype, { // default properties
  parentNodeClass_: { value: EnvironmentToken } // parent node must be an EnvironmentToken instance
});



/**
 * LaTeX space token properties
 * @interface SpaceTokenProperties
 * @extends TokenProperties
 * @property {number|undefined} lineBreakCount - The number of line breaks
 * @property
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */



/**
 * LaTeX space token structure
 * @class
 * @extends Token
 * @property {number} lineBreakCount - The number of line breaks
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */
const SpaceToken = module.exports['SpaceToken'] = class extends Token {
  //noinspection JSUnusedGlobalSymbols
  /**
   * Constructor
   * @param {!SpaceTokenProperties} initialProperties the initial property values
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  constructor(initialProperties) {
    if (initialProperties === undefined)
      return super();
    else if (!(initialProperties instanceof Object))
      throw new TypeError ('"initialProperties" isn\'t an Object instance');
    super(initialProperties); // the superclass constructor
    if (initialProperties.lineBreakCount) { // if the line break number is defined
      if (!isFinite(initialProperties.lineBreakCount) || initialProperties.lineBreakCount < 0)
        throw new TypeError('"initialProperties.lineBreakCount" isn\'t a non-negative number');
      // store the line break number
      Object.defineProperty(this, 'lineBreakCount', {
        value: initialProperties.lineBreakCount,
        enumerable: true
      });
    }
  }


  /**
   * Get the logical lexeme
   * @return {(Latex.Lexeme|null)} the lexeme or null if the lexeme isn't defined
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  get lexeme () {
    //noinspection JSUnresolvedVariable
    return  this.lineBreakCount <= 1 ? Latex.Lexeme.SPACE : Latex.Lexeme.PARAGRAPH_SEPARATOR;
  }


  /**
   * Get the string representation of this node
   * @param {boolean=false} skipNodeClass
   *        true to not include the node class name into the output, false otherwise
   * @return {string} the sources string
   * @override
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  toString(skipNodeClass) {
    if (skipNodeClass) { // if the node class name must be skipped
      switch (this.lineBreakCount) {
      case 0:
        return ' ';
      case 1:
        return '\n';
      default:
        return '\n\n';
      }
    } else { // if the node class name must be included
      switch (this.lineBreakCount) {
      case 0:
        return 'LatexTree.SpaceToken{ }';
      case 1:
        return 'LatexTree.SpaceToken{\n}';
      default:
        return 'LatexTree.SpaceToken{\n\n}';
      }
    }
  }
};
//noinspection JSUnresolvedVariable
Object.defineProperties(SpaceToken.prototype, { // default properties
  lineBreakCount: { value: 0, enumerable: true } // line break number
});



/**
 * LaTeX source fragment token properties
 * @interface SourceTokenProperties
 * @extends TokenProperties
 * @property {Latex.Lexeme} lexeme - The logical lexeme
 * @property {string} source - The source fragment
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */



/**
 * LaTeX source fragment token structure
 * @class
 * @extends Token
 * @property {string} source - The source fragment
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */
const SourceToken = module.exports['SourceToken'] = class extends Token {
  //noinspection JSUnusedGlobalSymbols
  /**
   * Constructor
   * @param {!SourceTokenProperties} initialProperties the initial property values
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  constructor(initialProperties) {
    if (!(initialProperties instanceof Object))
      throw new TypeError ('"initialProperties" isn\'t an Object instance');
    super(initialProperties); // the superclass constructor
    if (!Latex.Lexeme[initialProperties.lexeme])
      throw new TypeError('"initialProperties.lexeme" isn\'t known');
    // store the lexeme
    Object.defineProperty(this, 'lexeme', { value: initialProperties.lexeme, enumerable: true });
    if (typeof initialProperties.source !== 'string')
      throw new TypeError('"initialProperties.sources" isn\'t a string');
    // store the sources
    Object.defineProperty(this, 'source', { value: initialProperties.source, enumerable: true });
  }


  /**
   * Get the string representation of this node
   * @param {boolean=false} skipNodeClass
   *        true to not include the node class name into the output, false otherwise
   * @return {string} the sources string
   * @override
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  toString(skipNodeClass) {
    return skipNodeClass ? this.source : 'LatexTree.SourceToken[' + this.lexeme + ']{' + this.source + '}';
  }
};
