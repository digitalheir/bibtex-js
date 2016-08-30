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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Latex = require('./Latex'); // general LaTeX definitions
/** @external LatexStyle*/
var LatexStyle = require('./LatexStyle'); // LaTeX style structures
/** @external SyntaxTree */
var SyntaxTree = require('./SyntaxTree'); // syntax tree structure elements


/**
 * LaTeX syntax tree structure
 * @class
 * @extends SyntaxTree
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */
module.exports = function (_SyntaxTree) {
  _inherits(_class, _SyntaxTree);

  //noinspection JSUnusedGlobalSymbols
  /**
   * Constructor
   * @param {!Token} rootToken the root token (must have no parent and no tree)
   * @param {string} source the sources text that has this syntax tree
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  function _class(rootToken, source) {
    _classCallCheck(this, _class);

    if (!(rootToken instanceof Token)) throw new TypeError('"rootToken" isn\'t a LatexTree.Token instance');
    return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, rootToken, source)); // the superclass constructor
  }

  return _class;
}(SyntaxTree);

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
var Token = module.exports['Token'] = function (_SyntaxTree$Node) {
  _inherits(_class2, _SyntaxTree$Node);

  //noinspection JSUnusedGlobalSymbols
  /**
   * Constructor
   * @param {!TokenProperties=} opt_initialProperties the initial property values
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  function _class2(opt_initialProperties) {
    _classCallCheck(this, _class2);

    if (opt_initialProperties === undefined) {
      // superclass constructor
      var _this2 = _possibleConstructorReturn(this, (_class2.__proto__ || Object.getPrototypeOf(_class2)).call(this)); // if the initial properties are not set

    } else if (opt_initialProperties instanceof Object) {
      // if the initial properties are set
      // superclass constructor
      // superclass initial properties
      var superInitialProperties = Object.create(opt_initialProperties);
      superInitialProperties.parentNode = opt_initialProperties.parentToken;
      superInitialProperties.childNodes = opt_initialProperties.childTokens;

      var _this2 = _possibleConstructorReturn(this, (_class2.__proto__ || Object.getPrototypeOf(_class2)).call(this, superInitialProperties));
    } else {
      // if the initial properties are in unsupported type
      throw new TypeError('"initialProperties" isn\'t an Object instance');
    }
    return _possibleConstructorReturn(_this2);
  }

  /**
   * Get the string representation of this node
   * @param {boolean=false} skipNodeClass
   *        true to not include the node class name into the output, false otherwise
   * @return {string} the sources string
   * @override
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */


  _createClass(_class2, [{
    key: 'toString',
    value: function toString(skipNodeClass) {
      return skipNodeClass ? _get(_class2.prototype.__proto__ || Object.getPrototypeOf(_class2.prototype), 'toString', this).call(this, true) : 'LatexTree.Token{' + _get(_class2.prototype.__proto__ || Object.getPrototypeOf(_class2.prototype), 'toString', this).call(this, true) + '}';
    }
  }]);

  return _class2;
}(SyntaxTree.Node);
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
var SymbolToken = module.exports['SymbolToken'] = function (_Token) {
  _inherits(_class3, _Token);

  //noinspection JSUnusedGlobalSymbols
  /**
   * Constructor
   * @param {!SymbolTokenProperties} initialProperties the initial property values
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  function _class3(initialProperties) {
    _classCallCheck(this, _class3);

    if (!(initialProperties instanceof Object)) throw new TypeError('"initialProperties" isn\'t an Object instance');

    // the superclass constructor
    var _this3 = _possibleConstructorReturn(this, (_class3.__proto__ || Object.getPrototypeOf(_class3)).call(this, initialProperties));

    if (initialProperties.symbol) {
      // if the symbol is defined
      if (!(initialProperties.symbol instanceof LatexStyle.Symbol)) throw new TypeError('"initialProperties.symbol" isn\'t a LatexStyle.Symbol instance');
      // store the symbol
      Object.defineProperty(_this3, 'symbol', { value: initialProperties.symbol, enumerable: true });
    } else {
      // if the symbol isn't defined
      if (typeof initialProperties.pattern !== 'string') throw new TypeError('"initialProperties.pattern" isn\'t a string');
      // store the unrecognized pattern
      Object.defineProperty(_this3, 'pattern', { value: initialProperties.pattern });
    }
    return _this3;
  }

  /**
   * Get the logical lexeme
   * @return {(Latex.Lexeme|null)} the lexeme or null if the lexeme isn't defined
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */


  _createClass(_class3, [{
    key: 'toString',


    /**
     * Get the string representation of this node
     * @param {boolean=false} skipNodeClass
     *        true to not include the node class name into the output, false otherwise
     * @return {string} the sources string
     * @override
     * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
     */
    value: function toString(skipNodeClass) {
      var source = '';
      var iParameter = 0; // the parameter iterator
      //noinspection JSUnresolvedVariable
      var pattern = this.pattern; // LaTeX input pattern
      // for all the pattern chars
      for (var nPatternChars = pattern.length, iPatternChar = 0; iPatternChar < nPatternChars; ++iPatternChar) {
        var patternChar = pattern[iPatternChar]; // the pattern char
        if (patternChar === '#') {
          // if a parameter place
          ++iPatternChar; // go to the next pattern char
          var parameterToken = this.childNode(iParameter++); // try to get the parameter token
          source += parameterToken ? parameterToken.toString(true) : '??';
        } else {
          // if the ordinary pattern char
          source += patternChar;
        }
      }
      return skipNodeClass ? source : 'LatexTree.SymbolToken' + (this.symbol ? '' : '[?]') + '{' + source + '}';
    }
  }, {
    key: 'lexeme',
    get: function get() {
      //noinspection JSUnresolvedVariable
      return this.symbol ? this.symbol.lexeme : null;
    }

    /**
     * Get the symbol LaTeX pattern
     * @return {string} the symbol pattern
     * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
     */

  }, {
    key: 'pattern',
    get: function get() {
      //noinspection JSUnresolvedVariable
      return this.symbol.pattern;
    }
  }]);

  return _class3;
}(Token);
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
var ParameterToken = module.exports['ParameterToken'] = function (_Token2) {
  _inherits(_class4, _Token2);

  //noinspection JSUnusedGlobalSymbols
  /**
   * Constructor
   * @param {!ParameterTokenProperties} initialProperties the initial property values
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  function _class4(initialProperties) {
    _classCallCheck(this, _class4);

    if (!(initialProperties instanceof Object)) throw new TypeError('"initialProperties" isn\'t an Object instance');

    // the superclass constructor
    var _this4 = _possibleConstructorReturn(this, (_class4.__proto__ || Object.getPrototypeOf(_class4)).call(this, initialProperties));

    if (!initialProperties.hasBrackets) // if there are no bounding brackets
      // store this fact
      Object.defineProperty(_this4, 'hasBrackets', { value: false, enumerable: true });
    if (initialProperties.hasSpacePrefix) // if there is a space before
      // store this fact
      Object.defineProperty(_this4, 'hasSpacePrefix', { value: true, enumerable: true });
    return _this4;
  }

  /**
   * Get the logical lexeme
   * @return {(Latex.Lexeme|null)} the lexeme or null if the lexeme isn't defined
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */


  _createClass(_class4, [{
    key: 'toString',


    /**
     * Get the string representation of this node
     * @param {boolean=false} skipNodeClass
     *        true to not include the node class name into the output, false otherwise
     * @return {string} the sources string
     * @override
     * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
     */
    value: function toString(skipNodeClass) {
      var source = this.hasSpacePrefix ? ' ' : '';
      source += this.hasBrackets ? '{' + _get(_class4.prototype.__proto__ || Object.getPrototypeOf(_class4.prototype), 'toString', this).call(this, true) + '}' : _get(_class4.prototype.__proto__ || Object.getPrototypeOf(_class4.prototype), 'toString', this).call(this, true);
      return skipNodeClass ? source : 'LatexTree.ParameterToken{' + source + '}';
    }
  }, {
    key: 'lexeme',
    get: function get() {
      return this.parameter && this.parameter.lexeme;
    }

    /**
     * Get the corresponding LaTeX parameter description
     * @return {?LatexStyle.Parameter}
     *         the LaTeX parameter or null of there is parent symbol or such a parameter
     * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
     */

  }, {
    key: 'parameter',
    get: function get() {
      /** @type {?SymbolToken} */
      var symbolToken = this.parentNode; // get the symbol token
      //noinspection JSUnresolvedFunction
      return symbolToken && symbolToken.symbol.parameter(symbolToken.childIndex(this));
    }
  }]);

  return _class4;
}(Token);
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
var CommandToken = module.exports['CommandToken'] = function (_SymbolToken) {
  _inherits(_class5, _SymbolToken);

  //noinspection JSUnusedGlobalSymbols
  /**
   * Constructor
   * @param {!CommandTokenProperties} initialProperties the initial property values
   */
  function _class5(initialProperties) {
    _classCallCheck(this, _class5);

    if (!(initialProperties instanceof Object)) throw new TypeError('"initialProperties" isn\'t an Object instance');
    // copy the initial properties for the superclass
    var superInitialProperties = Object.create(initialProperties);
    if (initialProperties.command) {
      // if the command is defined
      if (!(initialProperties.command instanceof LatexStyle.Command)) throw new TypeError('"initialProperties.command" isn\'t a LatexStyle.Command instance');
      // the command is the symbol for the superclass
      superInitialProperties.symbol = initialProperties.command;

      // the superclass constructor
      var _this5 = _possibleConstructorReturn(this, (_class5.__proto__ || Object.getPrototypeOf(_class5)).call(this, superInitialProperties));
    } else {
      // if the command isn't defined
      if (typeof initialProperties.name !== 'string') throw new TypeError('"initialProperties.name" isn\'t a string');
      superInitialProperties.pattern = '';

      // the superclass constructor
      // store the unrecognized name
      var _this5 = _possibleConstructorReturn(this, (_class5.__proto__ || Object.getPrototypeOf(_class5)).call(this, superInitialProperties));

      Object.defineProperty(_this5, 'name', { value: initialProperties.name });
    }
    return _possibleConstructorReturn(_this5);
  }

  /**
   * Get the LaTeX command
   * @return {!LatexStyle.Command} the command description
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */


  _createClass(_class5, [{
    key: 'toString',


    /**
     * Get the string representation of this node
     * @param {boolean=false} skipNodeClass
     *        true to not include the node class name into the output, false otherwise
     * @return {string} the sources string
     * @override
     * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
     */
    value: function toString(skipNodeClass) {
      var source = '\\' + this.name + _get(_class5.prototype.__proto__ || Object.getPrototypeOf(_class5.prototype), 'toString', this).call(this, true);
      return skipNodeClass ? source : 'LatexTree.CommandToken' + (this.command ? '' : '[?]') + '{' + source + '}';
    }
  }, {
    key: 'command',
    get: function get() {
      return this.symbol;
    }

    /**
     * Get the LaTeX command name
     * @return {string} the command name
     * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
     */

  }, {
    key: 'name',
    get: function get() {
      return this.command.name;
    }
  }]);

  return _class5;
}(SymbolToken);
Object.defineProperties(CommandToken.prototype, { // make getters and setters enumerable
  command: { enumerable: true },
  name: { enumerable: true }
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
var EnvironmentToken = module.exports['EnvironmentToken'] = function (_Token3) {
  _inherits(_class6, _Token3);

  //noinspection JSUnusedGlobalSymbols
  /**
   * Constructor
   * @param {!EnvironmentTokenProperties} initialProperties the initial property values
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  function _class6(initialProperties) {
    _classCallCheck(this, _class6);

    if (!(initialProperties instanceof Object)) throw new TypeError('"initialProperties" isn\'t an Object instance');

    // the superclass constructor
    var _this6 = _possibleConstructorReturn(this, (_class6.__proto__ || Object.getPrototypeOf(_class6)).call(this, initialProperties));

    if (!(initialProperties.environment instanceof LatexStyle.Environment)) throw new TypeError('"initialProperties.environment" isn\'t a LatexStyle.Environment instance');
    // store the environment
    Object.defineProperty(_this6, 'environment', {
      value: initialProperties.environment,
      enumerable: true
    });
    return _this6;
  }

  /**
   * Get the logical lexeme
   * @return {(Latex.Lexeme|null)} the lexeme or null if the lexeme isn't defined
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */


  _createClass(_class6, [{
    key: 'toString',


    /**
     * Get the string representation of this node
     * @param {boolean=false} skipNodeClass
     *        true to not include the node class name into the output, false otherwise
     * @return {string} the sources string
     * @override
     * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
     */
    value: function toString(skipNodeClass) {
      var beginCommandToken = this.beginCommandToken; // the begin command token
      var endCommandToken = this.endCommandToken; // the end command token
      var bodyToken = this.bodyToken; // the environment body token
      var source = '\\begin{' + this.environment.name + '}';
      source += beginCommandToken ? SymbolToken.prototype.toString.call(beginCommandToken, true) : '??';
      source += bodyToken ? bodyToken.toString(true) : '??';
      source += '\\end{' + this.environment.name + '}';
      source += endCommandToken ? SymbolToken.prototype.toString.call(endCommandToken, true) : '??';
      return skipNodeClass ? source : 'LatexTree.EnvironmentToken{' + source + '}';
    }
  }, {
    key: 'lexeme',
    get: function get() {
      return this.environment.lexeme;
    }

    /**
     * Get the begin command token
     * @return {?CommandToken} the command token or null if there is no begin command
     * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
     */

  }, {
    key: 'beginCommandToken',
    get: function get() {
      var beginCommandToken = this.childNode(0);
      return beginCommandToken instanceof CommandToken ? beginCommandToken : null;
    }

    /**
     * Get the end command token
     * @return {?CommandToken} the command token or null if there is no end command
     * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
     */

  }, {
    key: 'endCommandToken',
    get: function get() {
      var endCommandToken = this.childNode(2);
      return endCommandToken instanceof CommandToken ? endCommandToken : null;
    }

    /**
     * Get the environment body token
     * @return {?EnvironmentBodyToken} the body or null if there is no body
     * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
     */

  }, {
    key: 'bodyToken',
    get: function get() {
      var bodyToken = this.childNode(1);
      return bodyToken instanceof EnvironmentBodyToken ? bodyToken : null;
    }
  }]);

  return _class6;
}(Token);
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
var EnvironmentBodyToken = module.exports['EnvironmentBodyToken'] = function (_Token4) {
  _inherits(_class7, _Token4);

  function _class7() {
    _classCallCheck(this, _class7);

    return _possibleConstructorReturn(this, (_class7.__proto__ || Object.getPrototypeOf(_class7)).apply(this, arguments));
  }

  _createClass(_class7, [{
    key: 'toString',


    /**
     * Get the string representation of this node
     * @param {boolean=false} skipNodeClass
     *        true to not include the node class name into the output, false otherwise
     * @return {string} the sources string
     * @override
     * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
     */
    value: function toString(skipNodeClass) {
      return skipNodeClass ? _get(_class7.prototype.__proto__ || Object.getPrototypeOf(_class7.prototype), 'toString', this).call(this, true) : 'LatexTree.EnvironmentBodyToken{' + _get(_class7.prototype.__proto__ || Object.getPrototypeOf(_class7.prototype), 'toString', this).call(this, true) + '}';
    }
  }, {
    key: 'environment',

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get the LaTeX environment
     * @return {?LatexStyle.Environment} the environment or null if there is no parent environment
     * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
     */
    get: function get() {
      return this.parentNode && this.parentNode.environment;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get the parent environment token
     * @return {?EnvironmentToken} the environment or null if there is no parent environment
     * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
     */

  }, {
    key: 'environmentToken',
    get: function get() {
      return this.parentNode;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get the environment begin command token
     * @return {?CommandToken} the command token or null if there is no begin command
     * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
     */

  }, {
    key: 'beginCommandToken',
    get: function get() {
      return this.parentNode && this.parentNode.beginCommandToken;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get the environment end command token
     * @return {(CommandToken|null)} the command token or null if there is no end command
     * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
     */

  }, {
    key: 'endCommandToken',
    get: function get() {
      return this.parentNode && this.parentNode.endCommandToken;
    }
  }]);

  return _class7;
}(Token);
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
var SpaceToken = module.exports['SpaceToken'] = function (_Token5) {
  _inherits(_class8, _Token5);

  //noinspection JSUnusedGlobalSymbols
  /**
   * Constructor
   * @param {!SpaceTokenProperties} initialProperties the initial property values
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  function _class8(initialProperties) {
    var _this8, _ret;

    _classCallCheck(this, _class8);

    if (initialProperties === undefined) return _ret = (_this8 = _possibleConstructorReturn(this, (_class8.__proto__ || Object.getPrototypeOf(_class8)).call(this)), _this8), _possibleConstructorReturn(_this8, _ret);else if (!(initialProperties instanceof Object)) throw new TypeError('"initialProperties" isn\'t an Object instance');

    // the superclass constructor
    var _this8 = _possibleConstructorReturn(this, (_class8.__proto__ || Object.getPrototypeOf(_class8)).call(this, initialProperties));

    if (initialProperties.lineBreakCount) {
      // if the line break number is defined
      if (!isFinite(initialProperties.lineBreakCount) || initialProperties.lineBreakCount < 0) throw new TypeError('"initialProperties.lineBreakCount" isn\'t a non-negative number');
      // store the line break number
      Object.defineProperty(_this8, 'lineBreakCount', {
        value: initialProperties.lineBreakCount,
        enumerable: true
      });
    }
    return _possibleConstructorReturn(_this8);
  }

  /**
   * Get the logical lexeme
   * @return {(Latex.Lexeme|null)} the lexeme or null if the lexeme isn't defined
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */


  _createClass(_class8, [{
    key: 'toString',


    /**
     * Get the string representation of this node
     * @param {boolean=false} skipNodeClass
     *        true to not include the node class name into the output, false otherwise
     * @return {string} the sources string
     * @override
     * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
     */
    value: function toString(skipNodeClass) {
      if (skipNodeClass) {
        // if the node class name must be skipped
        switch (this.lineBreakCount) {
          case 0:
            return ' ';
          case 1:
            return '\n';
          default:
            return '\n\n';
        }
      } else {
        // if the node class name must be included
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
  }, {
    key: 'lexeme',
    get: function get() {
      //noinspection JSUnresolvedVariable
      return this.lineBreakCount <= 1 ? Latex.Lexeme.SPACE : Latex.Lexeme.PARAGRAPH_SEPARATOR;
    }
  }]);

  return _class8;
}(Token);
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
var SourceToken = module.exports['SourceToken'] = function (_Token6) {
  _inherits(_class9, _Token6);

  //noinspection JSUnusedGlobalSymbols
  /**
   * Constructor
   * @param {!SourceTokenProperties} initialProperties the initial property values
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  function _class9(initialProperties) {
    _classCallCheck(this, _class9);

    if (!(initialProperties instanceof Object)) throw new TypeError('"initialProperties" isn\'t an Object instance');

    // the superclass constructor
    var _this9 = _possibleConstructorReturn(this, (_class9.__proto__ || Object.getPrototypeOf(_class9)).call(this, initialProperties));

    if (!Latex.Lexeme[initialProperties.lexeme]) throw new TypeError('"initialProperties.lexeme" isn\'t known');
    // store the lexeme
    Object.defineProperty(_this9, 'lexeme', { value: initialProperties.lexeme, enumerable: true });
    if (typeof initialProperties.source !== 'string') throw new TypeError('"initialProperties.sources" isn\'t a string');
    // store the sources
    Object.defineProperty(_this9, 'source', { value: initialProperties.source, enumerable: true });
    return _this9;
  }

  /**
   * Get the string representation of this node
   * @param {boolean=false} skipNodeClass
   *        true to not include the node class name into the output, false otherwise
   * @return {string} the sources string
   * @override
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */


  _createClass(_class9, [{
    key: 'toString',
    value: function toString(skipNodeClass) {
      return skipNodeClass ? this.source : 'LatexTree.SourceToken[' + this.lexeme + ']{' + this.source + '}';
    }
  }]);

  return _class9;
}(Token);
//# sourceMappingURL=LatexTree.js.map