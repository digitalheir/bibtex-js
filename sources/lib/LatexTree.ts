/**
 * @fileoverview LaTeX syntax tree structure elements
 * This file is a part of TeXnous project.
 *
 * @copyright TeXnous project team (http://texnous.org) 2016
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

/** @module */

/** @external LatexStyle*/
import {Command, Environment, isEnvironment, mustBeCommand, Parameter, Symbol} from './LatexStyle'; // LaTeX style structures
/** @external SyntaxTree */
import {SyntaxTree, Node} from './SyntaxTree';
import {Lexeme} from "./Latex";
import {mustNotBeUndefined} from "./Utils";


/**
 * LaTeX syntax tree structure
 * @class
 * @extends SyntaxTree
 * @author Kirill Chuvilin <k.chuvilin@texnous.org>
 */
export default class extends SyntaxTree {

  /**
   * Constructor
   * @param {!Token} rootToken the root token (must have no parent and no tree)
   * @param {string} source the sources text that has this syntax tree
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  constructor(rootToken: Token, source: string) {
    if (!(rootToken instanceof Token))
      throw new TypeError('"rootToken" isn\'t a Token instance');
    super(rootToken, source); // the superclass constructor
  }
};



/**
 * LaTeX syntax tree token base properties
 * @interface TokenProperties
 * @property {(?Token|undefined)} parentToken - The parent token or undefined if there is no parent
 * @property {(!Array.<Token>|undefined)} childTokens - The list of the child tokens
 * @author Kirill Chuvilin <k.chuvilin@texnous.org>
 */
export interface TokenProperties {
  parentToken?: Token;
  childTokens?: Token[];
}


/**
 * LaTeX syntax tree token base structure
 * @class
 * @extends SyntaxTree.Node
 * @property {(Lexeme|undefined)} lexeme - The logical lexeme of the token
 * @author Kirill Chuvilin <k.chuvilin@texnous.org>
 */
export class Token extends Node {
  lexeme?: Lexeme;

  /**
   * Constructor
   * @param {!TokenProperties=} opt_initialProperties the initial property values
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  constructor(opt_initialProperties: TokenProperties = {}) {
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
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  toString(skipNodeClass: boolean = false) {
    return skipNodeClass ? super.toString(true) : 'Token{' + super.toString(true) + '}';
  }
};
Object.defineProperties(Token.prototype, { // default properties
  lexeme: { value: undefined, enumerable: true }, // no lexeme
  parentNodeClass_: { value: Token } // parent node must be an EnvironmentToken instance
});



/**
 * LaTeX symbol token properties
 * @interface SymbolTokenProperties
 * @extends TokenProperties
 * @property {!Symbol|undefined} symbol - The LaTeX symbol or undefined if the symbol is unrecognized
 * @property {string|undefined} pattern - The pattern that corresponds to the unrecognized symbol
 * @author Kirill Chuvilin <k.chuvilin@texnous.org>
 */
export interface SymbolTokenProperties extends TokenProperties {
  symbol?: Symbol;
  pattern?: string;
}


/**
 * LaTeX symbol token structure
 * @class
 * @extends Token
 * @property {?Symbol} symbol - The corresponding LaTeX symbol or undefined if the symbol is unrecognized
 * @property {string} pattern - The symbol LaTeX pattern
 * @author Kirill Chuvilin <k.chuvilin@texnous.org>
 */
export class SymbolToken extends Token {
  symbol?: Symbol;

  /**
   * Constructor
   * @param {!SymbolTokenProperties} initialProperties the initial property values
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  constructor(initialProperties: SymbolTokenProperties) {
    if (!(initialProperties instanceof Object))
      throw new TypeError ('"initialProperties" isn\'t an Object instance');
    super(initialProperties); // the superclass constructor
    if (initialProperties.symbol) { // if the symbol is defined
      if (!(initialProperties.symbol instanceof Symbol))
        throw new TypeError('"initialProperties.symbol" isn\'t a Symbol instance');
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
   * @return {(Lexeme|undefined)} the lexeme or undefined if the lexeme isn't defined
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  get lexeme (): Lexeme | undefined {
    
    return this.symbol ? this.symbol.lexeme : undefined;
  }


  /**
   * Get the symbol LaTeX pattern
   * @return {string} the symbol pattern
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  get pattern (): string {
    return mustNotBeUndefined(this.symbol).pattern;
  }


  /**
   * Get the string representation of this node
   * @param {boolean=false} skipNodeClass
   *        true to not include the node class name into the output, false otherwise
   * @return {string} the sources string
   * @override
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  toString(skipNodeClass: boolean = false) {
    let source = '';
    let iParameter = 0; // the parameter iterator
    
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
      'SymbolToken' + (this.symbol ? '' : '[?]') + '{' + source + '}';
  }
};
Object.defineProperties(SymbolToken.prototype, { // default properties
  symbol: { value: undefined, enumerable: true } // no symbol token
});
Object.defineProperties(SymbolToken.prototype, { // make getters and setters enumerable
  pattern: { enumerable: true }
});



/**
 * LaTeX parameter token properties
 * @interface ParameterTokenProperties
 * @extends TokenProperties
 * @property {boolean} hasBrackets - True if the parameter is bounded by the logical brackets, false otherwise
 * @property {boolean} hasSpacePrefix - True if the parameter is prefixed by a space, false otherwise
 * @author Kirill Chuvilin <k.chuvilin@texnous.org>
 */
export interface ParameterTokenProperties extends TokenProperties {
  hasBrackets: boolean;
  hasSpacePrefix: boolean;
}


/**
 * LaTeX parameter token structure
 * @class
 * @extends Token
 * @property {boolean} hasBrackets -
 *           True if the parameter is bounded by the logical brackets, false otherwise
 * @property {boolean} hasSpacePrefix -
 *           True if the parameter is prefixed by a space, false otherwise
 * @property {?LatexStyle.Parameter} parameter - The corresponding LaTeX parameter
 * @author Kirill Chuvilin <k.chuvilin@texnous.org>
 */
export class ParameterToken extends Token {
  public parentNode: SymbolToken;

  private hasBrackets: boolean;
  hasSpacePrefix: boolean;

  /**
   * Constructor
   * @param {!ParameterTokenProperties} initialProperties the initial property values
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  constructor(initialProperties: ParameterTokenProperties) {
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
   * @return {(Lexeme|undefined)} the lexeme or undefined if the lexeme isn't defined
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  get lexeme (): Lexeme | undefined {
    if(this.parameter && this.parameter.lexeme) return this.parameter.lexeme;
  }


  /**
   * Get the corresponding LaTeX parameter description
   * @return {?LatexStyle.Parameter}
   *         the LaTeX parameter or undefined of there is parent symbol or such a parameter
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  get parameter (): Parameter | undefined {
    /** @type {?SymbolToken} */
    let symbolToken = this.parentNode; // get the symbol token
    let symbol = mustNotBeUndefined(symbolToken.symbol);
    let parameterIndex = symbolToken.childIndex(this);
    if(symbolToken !== undefined && parameterIndex !== undefined && parameterIndex >= 0)
      return symbol.parameter(parameterIndex);
  }


  /**
   * Get the string representation of this node
   * @param {boolean=false} skipNodeClass
   *        true to not include the node class name into the output, false otherwise
   * @return {string} the sources string
   * @override
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  toString(skipNodeClass: boolean = false) {
    let source = this.hasSpacePrefix ? ' ' : '';
    source += this.hasBrackets ? '{' + super.toString(true) + '}' : super.toString(true);
    return skipNodeClass ? source : 'ParameterToken{' + source + '}';
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
 * @author Kirill Chuvilin <k.chuvilin@texnous.org>
 */
export interface CommandTokenProperties extends TokenProperties {
  command?: Command;
  name?: string;
}


/**
 * LaTeX command token structure
 * @class
 * @extends SymbolToken
 * @property {!LatexStyle.Command} command -
 *           The corresponding LaTeX command or undefined if the command is unrecognized
 * @property {string|undefined} name - The LaTeX command name
 * @author Kirill Chuvilin <k.chuvilin@texnous.org>
 */
export class CommandToken extends SymbolToken {

  /**
   * Constructor
   * @param {!CommandTokenProperties} initialProperties the initial property values
   */
  constructor(initialProperties: CommandTokenProperties) {
    if (!(initialProperties instanceof Object))
      throw new TypeError ('"initialProperties" isn\'t an Object instance');
    // copy the initial properties for the superclass
    let superInitialProperties = Object.create(initialProperties);
    if (initialProperties.command) { // if the command is defined
      if (!(initialProperties.command instanceof Command))
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
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  get command (): Command { return mustBeCommand(this.symbol) }


  /**
   * Get the LaTeX command name
   * @return {string} the command name
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  get name (): string { return this.command.name }

  /**
   * Get the string representation of this node
   * @param {boolean=false} skipNodeClass
   *        true to not include the node class name into the output, false otherwise
   * @return {string} the sources string
   * @override
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  toString(skipNodeClass: boolean = false) {
   let source = '\\' + this.name + super.toString(true);
   return skipNodeClass ?
     source :
     'CommandToken' + (this.command ? '' : '[?]') + '{' + source + '}';
  }
};

Object.defineProperties(CommandToken.prototype, { // make getters and setters enumerable
  command: { enumerable: true },
  name: {enumerable: true }
});

export function isCommandToken(x: any): x is CommandToken {
  return x && x instanceof CommandToken;
}


/**
 * LaTeX environment token properties
 * @interface EnvironmentTokenProperties
 * @extends TokenProperties
 * @property {!LatexStyle.Environment} environment - The LaTeX environment
 * @property
 * @author Kirill Chuvilin <k.chuvilin@texnous.org>
 */

export interface EnvironmentTokenPropertiesWithEnvironment
  extends EnvironmentTokenProperties {
  environment: Environment;
  name: undefined;
}

export interface EnvironmentTokenPropertiesWithName
  extends EnvironmentTokenProperties {
  environment: undefined;
  name: string;
}

export interface EnvironmentTokenProperties
  extends TokenProperties {
  environment?: Environment;
  name?: string;
}

/**
 * LaTeX environment token structure
 * @class
 * @extends Token
 * @property {!Environment} environment - The corresponding LaTeX environment
 * @property {?CommandToken} beginCommandToken -
 *           The environment begin command token or undefined is there is no such a token
 * @property {?CommandToken} endCommandToken -
 *           The environment end command token or undefined is there is no such a token
 * @property {?EnvironmentBodyToken} bodyToken -
 *           The environment body token or undefined is there is no such a token
 * @author Kirill Chuvilin <k.chuvilin@texnous.org>
 */
export class EnvironmentToken extends Token {
  environment: Environment;

  /**
   * Constructor
   * @param {!EnvironmentTokenProperties} initialProperties the initial property values
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  constructor(initialProperties: EnvironmentTokenProperties) {
    if (!(initialProperties instanceof Object))
      throw new TypeError ('"initialProperties" isn\'t an Object instance');
    super(initialProperties); // the superclass constructor
    if (!(initialProperties.environment instanceof Environment))
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
   * @return {(Lexeme|undefined)} the lexeme or undefined if the lexeme isn't defined
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  get lexeme () { return this.environment.lexeme }


  /**
   * Get the begin command token
   * @return {?CommandToken} the command token or undefined if there is no begin command
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  get beginCommandToken () {
    let beginCommandToken = this.childNode(0);
    return beginCommandToken instanceof CommandToken ? beginCommandToken : undefined;
  }


  /**
   * Get the end command token
   * @return {?CommandToken} the command token or undefined if there is no end command
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  get endCommandToken () {
    let endCommandToken = this.childNode(2);
    return endCommandToken instanceof CommandToken ? endCommandToken : undefined;
  }



  /**
   * Get the environment body token
   * @return {?EnvironmentBodyToken} the body or undefined if there is no body
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  get bodyToken () {
    let bodyToken = this.childNode(1);
    return bodyToken instanceof EnvironmentBodyToken ? bodyToken : undefined;
  }


  /**
   * Get the string representation of this node
   * @param {boolean=false} skipNodeClass
   *        true to not include the node class name into the output, false otherwise
   * @return {string} the sources string
   * @override
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  toString(skipNodeClass:boolean=false) {
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
    return skipNodeClass ? source : 'EnvironmentToken{' + source + '}';
  }
};
Object.defineProperties(EnvironmentToken.prototype, { // make getters and setters enumerable
  beginToken: { enumerable: true },
  endToken: { enumerable: true }
});

export function mustBeEnvironmentToken(x: any): EnvironmentToken {
  if(!isEnvironmentToken(x)) throw new Error();
  return x;
}

export function isEnvironmentToken(x: any): x is EnvironmentToken {
  return x instanceof EnvironmentToken;
}


function getBeginCommandToken(x: any): CommandToken | undefined {
  if(isCommandToken(x.beginCommandToken))
    return x.beginCommandToken;
}

function getEndCommandToken(x: any): CommandToken | undefined {
  if(isCommandToken(x.endCommandToken))
    return x.endCommandToken;
}

function getEnvironment(x: any): Environment | undefined {
  if(x.environment && isEnvironment(x.environment))
    return x.environment;
}

/**
 * LaTeX environment body token structure
 * @class
 * @extends Token
 * @property {?LatexStyle.Environment} environment -
 *           The LaTeX environment or undefined if there is no parent environment
 * @property {?EnvironmentToken} environmentToken - The parent environment token
 * @property {?CommandToken} beginCommandToken -
 *           The environment begin command token or undefined is there is no such a token
 * @property {?CommandToken} endCommandToken -
 *           The environment end command token or undefined is there is no such a token
 * @author Kirill Chuvilin <k.chuvilin@texnous.org>
 */
export class EnvironmentBodyToken extends Token {

  /**
   * Get the LaTeX environment
   * @return {?LatexStyle.Environment} the environment or undefined if there is no parent environment
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  get environment (): Environment | undefined { return this.parentNode && getEnvironment(this.parentNode) }



  //noinspection JSUnusedGlobalSymbols
  /**
   * Get the parent environment token
   * @return {?EnvironmentToken} the environment or undefined if there is no parent environment
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  get environmentToken (): EnvironmentToken | undefined { return this.parentNode && mustBeEnvironmentToken(this.parentNode); }



  /**
   * Get the environment begin command token
   * @return {?CommandToken} the command token or undefined if there is no begin command
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  get beginCommandToken () { return this.parentNode && getBeginCommandToken(this.parentNode) }



  /**
   * Get the environment end command token
   * @return {(CommandToken|undefined)} the command token or undefined if there is no end command
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  get endCommandToken () { return this.parentNode && getEndCommandToken(this.parentNode) }


  /**
   * Get the string representation of this node
   * @param {boolean=false} skipNodeClass
   *        true to not include the node class name into the output, false otherwise
   * @return {string} the sources string
   * @override
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  toString(skipNodeClass: boolean = false) {
    return skipNodeClass ?
      super.toString(true) :
      'EnvironmentBodyToken{' + super.toString(true) + '}';
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
 * @author Kirill Chuvilin <k.chuvilin@texnous.org>
 */
export interface SpaceTokenProperties
  extends TokenProperties {
  lineBreakCount?: number;
}

/**
 * LaTeX space token structure
 * @class
 * @extends Token
 * @property {number} lineBreakCount - The number of line breaks
 * @author Kirill Chuvilin <k.chuvilin@texnous.org>
 */
export class SpaceToken extends Token {
  lineBreakCount: number;


  /**
   * Constructor
   * @param {!SpaceTokenProperties} initialProperties the initial property values
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  constructor(initialProperties: SpaceTokenProperties) {
    if (initialProperties === undefined) {
      super();
      return;
    }
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
   * @return {(Lexeme|undefined)} the lexeme or undefined if the lexeme isn't defined
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  get lexeme (): Lexeme {
    return this.lineBreakCount <= 1 ? "SPACE" : "PARAGRAPH_SEPARATOR";
  }


  /**
   * Get the string representation of this node
   * @param {boolean=false} skipNodeClass
   *        true to not include the node class name into the output, false otherwise
   * @return {string} the sources string
   * @override
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  toString(skipNodeClass: boolean = false): string {
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
        return 'SpaceToken{ }';
      case 1:
        return 'SpaceToken{\n}';
      default:
        return 'SpaceToken{\n\n}';
      }
    }
  }
};

Object.defineProperties(SpaceToken.prototype, { // default properties
  lineBreakCount: { value: 0, enumerable: true } // line break number
});



/**
 * LaTeX source fragment token properties
 * @interface SourceTokenProperties
 * @extends TokenProperties
 * @property {Lexeme} lexeme - The logical lexeme
 * @property {string} source - The source fragment
 * @author Kirill Chuvilin <k.chuvilin@texnous.org>
 */
export interface SourceTokenProperties
  extends TokenProperties {
  lexeme: Lexeme;
  source: string;
}

/**
 * LaTeX source fragment token structure
 * @class
 * @extends Token
 * @property {string} source - The source fragment
 * @author Kirill Chuvilin <k.chuvilin@texnous.org>
 */
export class SourceToken extends Token {
  private source: string;

  /**
   * Constructor
   * @param {!SourceTokenProperties} initialProperties the initial property values
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  constructor(initialProperties: SourceTokenProperties) {
    if (!(initialProperties instanceof Object))
      throw new TypeError ('"initialProperties" isn\'t an Object instance');
    super(initialProperties); // the superclass constructor
    if (!Lexeme[initialProperties.lexeme])
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
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  toString(skipNodeClass: boolean = false) {
    return skipNodeClass ? this.source : 'SourceToken[' + this.lexeme + ']{' + this.source + '}';
  }
};
