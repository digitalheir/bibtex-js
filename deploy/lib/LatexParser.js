/**
 * @fileoverview LaTeX parser class
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

'use strict';

/**@module */

/** @external Latex */

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Latex = require('./Latex'); // general LaTeX definitions
/** @external LatexStyle */
var LatexStyle = require('./LatexStyle'); // LaTeX style structures
/** @external LatexTree */
var LatexTree = require('./LatexTree'); // LaTeX tree structure elements


/**
 * LaTeX parser structure
 * @class
 * @property {!LatexStyle} latexStyle - The LaTeX style description to be used for parsing
 * @author Kirill Chuvilin <k.chuvilin@texnous.org>
 */
module.exports = function () {
  //noinspection JSUnusedGlobalSymbols
  /**
   * Constructor
   * @param {!LatexStyle} latexStyle LaTeX style description to be used for parsing
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  function _class(latexStyle) {
    _classCallCheck(this, _class);

    if (!(latexStyle instanceof LatexStyle)) throw new TypeError('"latexStyle" isn\'t a LatexStyle instance');
    // store the style description
    Object.defineProperty(this, 'latexStyle', { value: latexStyle, enumerable: true });
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Parse LaTeX sources
   * @param {string} source the sources to parse
   * @param {(!Context|undefined)} opt_context the parsing context
   * @return {!Array.<!LatexTree.Token>} the list of the parsed tokens
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */


  _createClass(_class, [{
    key: 'parse',
    value: function parse(source, opt_context) {
      if (typeof source !== 'string') throw new TypeError('"sources" isn\'t a string');
      var context = void 0;
      if (opt_context === undefined) {
        // if the parsing context isn't defined
        context = new Context(source); // create the context
      } else if (opt_context instanceof Context) {
        // if the parsing context is defined
        context = opt_context;
        context.source += source; // update the sources
      } else {
        // if unexpected context type
        throw new TypeError('"context" isn\'t a LatexParser.Context instance');
      }
      var parsedTokens = []; // the list of the parsed tokens
      while (true) {
        var parsedToken = this.parseToken_(context);
        if (parsedToken === null) break; // stop when cannot parse a token
        parsedTokens.push(parsedToken); // store the parsed token
      }
      return parsedTokens;
    }

    /**
     * Parse the next token
     * @param {!Context} context the parsing context
     * @return {?LatexTree.Token} the parsed token or null if the token cannot be parsed
     * @private
     * @author Kirill Chuvilin <k.chuvilin@texnous.org>
     */

  }, {
    key: 'parseToken_',
    value: function parseToken_(context) {
      var token = this.parseSpaceToken_(context); // collect comments and try to parse a space token
      if (!token) {
        // if cannot parse a space token
        if (context.position >= context.source.length) return null;
        var contextBackup = context.copy(); // backup the current context
        if (!(token = this.parseEnvironmentToken_(context))) {
          // if cannot parse an environment token
          contextBackup.copy(context); // restore the context
          if (!(token = this.parseCommandToken_(context))) {
            // if cannot parse a command token
            contextBackup.copy(context); // restore the context
            if (!(token = this.parseSymbolsToken_(context))) {
              // if cannot parse a symbol token
              return null; // no token can be parsed
            }
          }
        }
      }
      //noinspection JSCheckFunctionSignatures
      this.processParsedToken_(context, token);
      //noinspection JSValidateTypes
      return token; // return the parsed token
    }

    /**
     * Parse a parameter token
     * @param {!Context} context the parsing context
     * @param {!Array.<!LatexStyle.Parameter>} parameter the symbol or command parameter description
     * @param {string=} opt_endLabel
     *        the parameter end label or undefined if there should be a single token
     * @return {?LatexTree.ParameterToken} the parsed parameter token or null if cannot parse
     * @private
     * @author Kirill Chuvilin <k.chuvilin@texnous.org>
     */

  }, {
    key: 'parseParameterToken_',
    value: function parseParameterToken_(context, parameter, opt_endLabel) {
      var currentTokenBackup = context.currentToken; // store the current token
      //noinspection JSUnresolvedFunction,JSUnresolvedVariable
      context.updateState(parameter.operations); // update the LaTeX state
      if (opt_endLabel === undefined) {
        // if the parameter must be parsed as a single token
        // has the param space prefix or not
        var spacePrefixState = this.parseSpaceToken_(context) !== null;
        if (context.source[context.position] === '{') {
          // if the parameter is bounded by brackets
          // create the parameter token
          context.currentToken = new LatexTree.ParameterToken({ hasBrackets: true, hasSpacePrefix: spacePrefixState });
          ++context.position; // go to the sources next char
          ++context.charNumber; // go to the current line next char
          // exit if cannot parse until the closing bracket
          //noinspection JSUnresolvedVariable
          if (!this.parseUntilLabel_(context, '}', parameter.lexeme)) return null;
          ++context.position; // skip the bracket in the sources
          ++context.charNumber; // skip the bracket in the current line
        } else {
          // if the parameter is't bounded by brackets
          // create the parameter token
          context.currentToken = new LatexTree.ParameterToken({ hasBrackets: false, hasSpacePrefix: spacePrefixState });
          // exit if cannot parse a parameter token
          if (this.parseToken_(context) === null) return null;
        }
      } else {
        // if the parameter must be parsed until the end label
        // create the parameter token
        context.currentToken = new LatexTree.ParameterToken({ hasBrackets: false, hasSpacePrefix: false });
        //noinspection JSUnresolvedVariable
        // return if cannot parse
        if (!this.parseUntilLabel_(context, opt_endLabel, parameter.lexeme)) return null;
      }
      var parameterToken = context.currentToken; // the parsed parameter token
      context.currentToken = currentTokenBackup; // restore the current token
      //noinspection JSCheckFunctionSignatures
      this.processParsedToken_(context, parameterToken);
      //noinspection JSValidateTypes
      return parameterToken;
    }

    /**
     * Fill the parsed token position, comments and parent
     * @param {!Context} context the parsing context
     * @param {!LatexTree.Token} token the token to process
     * @private
     * @author Kirill Chuvilin <k.chuvilin@texnous.org>
     */

  }, {
    key: 'processParsedToken_',
    value: function processParsedToken_(context, token) {
      // TODO process comments and position
      if (context.currentToken) {
        // if there is a current token
        //noinspection JSUnresolvedFunction
        context.currentToken.insertChildSubtree(token); // store this token as a child of the current
      }
    }

    /**
     * Parse a comment line
     * @param {!Context} context the parsing context
     * @return {boolean} true if there was a comment line, false otherwise
     * @private
     * @author Kirill Chuvilin <k.chuvilin@texnous.org>
     */

  }, {
    key: 'parseCommentLine_',
    value: function parseCommentLine_(context) {
      // try to find a comment int the sources tail
      var commentMatch = context.source.substring(context.position).match(/^%([^\n]*)(\n[ \t]*)?/);
      if (commentMatch === null) return false; // return if there is no comment at this position
      context.comments.push(commentMatch[1]); // store the comment string
      context.position += commentMatch[0].length; // position just after the comment
      if (commentMatch[2] === undefined) {
        // if there were no line breaks
        context.charNumber += commentMatch[0].length; // go to the last char
      } else {
        // if there was a line break
        ++context.lineNumber; // one more line
        context.charNumber = commentMatch[2].length - 1; // skip all the space chars in the new line
      }
      return true;
    }

    /**
     * Parse space for a token (space or paragraph separator)
     * @param {!Context} context the parsing context
     * @return {?LatexTree.SpaceToken} the parsed token or null if cannot parse a space token
     * @private
     * @author Kirill Chuvilin <k.chuvilin@texnous.org>
     */

  }, {
    key: 'parseSpaceToken_',
    value: function parseSpaceToken_(context) {
      var isSpace = false; // true is the sources fragment is a space token, false otherwise
      var nLineBreaks = 0; // number of parsed line breaks
      while (context.position < context.source.length) {
        // while there is something to parse
        // go to the next iteration if there was a comment
        if (this.parseCommentLine_(context)) continue;
        switch (context.source[context.position]) {// depend on the sources current character
          case ' ':case '\t':
            // if a space or a tabular
            isSpace = true; // and one more parsed char
            ++context.position; // go to the next sources char
            ++context.charNumber; // the next char of the sources line
            continue;
          case '\n':
            // if a line break
            isSpace = true; // and one more parsed char
            ++nLineBreaks; // one more parsed line
            ++context.position; // go to the next sources char
            ++context.lineNumber; // the next sources line
            context.charNumber = 0; // the first char of the line
            continue; // go to the next iteration
        }
        break; // stop if not a space char
      }
      // create a space token if needed
      return isSpace ? new LatexTree.SpaceToken({ lineBreakCount: nLineBreaks }) : null;
    }

    /**
     * Parse an environment token
     * @param {!Context} context the parsing context
     * @return {?LatexTree.EnvironmentToken} the parsed token or null if cannot parse
     * @private
     * @author Kirill Chuvilin <k.chuvilin@texnous.org>
     */

  }, {
    key: 'parseEnvironmentToken_',
    value: function parseEnvironmentToken_(context) {
      if (!context.source.startsWith('\\begin', context.position)) return null;
      context.position += 6; // just after "\begin"
      this.parseSpaceToken_(context); // skip spaces
      // try to obtain the environment name
      var nameMatch = context.source.substring(context.position).match(/^{([\w@]+\*?)}/);
      if (nameMatch === null) return null; // exit if cannot bet the environment name
      var name = nameMatch[1]; // the environment name
      context.position += nameMatch[0].length; // skip the environment name in the sources
      context.charNumber += nameMatch[0].length; // skip the environment name in the current line
      var currentTokenBackup = context.currentToken; // store the current token
      // try to get the corresponding environment
      var environment = this.latexStyle.environments(context.currentState, name)[0];
      var environmentToken = context.currentToken = environment ? // the environment token
      new LatexTree.EnvironmentToken({ environment: environment }) : new LatexTree.EnvironmentToken({ name: name });
      // TODO unknown environment notification
      // try to parse the environment begin command
      var beginCommandToken = this.parsePatterns_(context, this.latexStyle.commands(context.currentState, name));
      if (beginCommandToken === null) {
        // if cannot parse a command
        // TODO notification about the unrecognized command
        // generate unrecognized command token
        beginCommandToken = new LatexTree.CommandToken({ name: name });
      }
      //noinspection JSCheckFunctionSignatures
      this.processParsedToken_(context, beginCommandToken);
      var environmentBodyToken = context.currentToken = new LatexTree.EnvironmentBodyToken();
      var endFound = this.parseUntilLabel_(context, '\\end{' + name + '}'); // try to get to the end
      context.currentToken = environmentToken;
      this.processParsedToken_(context, environmentBodyToken); // process the body token
      var endCommandToken = null; // the environment end command token
      if (endFound) {
        // if the environment end was reached
        context.position += name.length + 6; // skip the environment name in the sources
        context.charNumber += name.length + 6; // skip the environment name in the current line
        endCommandToken = this.parsePatterns_(context, this.latexStyle.commands(context.currentState, 'end' + name));
      } else {// if cannot find the end of the environment
        // TODO no environment end notification
      }
      if (endCommandToken === null) {
        // if cannot parse a command
        // TODO notification about the unrecognized command
        // generate unrecognized command token
        endCommandToken = new LatexTree.CommandToken({ name: 'end' + name });
      }
      this.processParsedToken_(context, endCommandToken); // process the end command token
      context.currentToken = currentTokenBackup; // restore the current token
      return environmentToken;
    }

    /**
     * Parse a command token
     * @param {!Context} context the parsing context
     * @return {?LatexTree.CommandToken} the parsed token or null if cannot parse
     * @private
     * @author Kirill Chuvilin <k.chuvilin@texnous.org>
     */

  }, {
    key: 'parseCommandToken_',
    value: function parseCommandToken_(context) {
      // try to find a command name
      var commandNameMatch = context.source.substring(context.position).match(/^\\([\w@]+\*?)/);
      if (commandNameMatch === null) return null; // exit if cannot find a command name
      context.position += commandNameMatch[0].length; // set position just after the command name
      context.charNumber += commandNameMatch[0].length; // skip all the command name chars
      // try to parse a command token
      var token = this.parsePatterns_(context, this.latexStyle.commands(context.currentState, commandNameMatch[1]));
      if (token === null) {
        // if cannot parse a command token
        // TODO notification about the unrecognized command
        // generate unrecognized command token
        token = new LatexTree.CommandToken({ name: commandNameMatch[1] });
      }
      //noinspection JSValidateTypes
      return token;
    }

    /**
     * Parse symbols for a token
     * @param {!Context} context the parsing context
     * @return {?LatexTree.Token} the parsed token or null if cannot parse
     * @private
     * @author Kirill Chuvilin <k.chuvilin@texnous.org>
     */

  }, {
    key: 'parseSymbolsToken_',
    value: function parseSymbolsToken_(context) {
      // get the available symbols
      var sourceCharacter = context.source[context.position]; // the current sources character
      // get the symbols started with the current sources character
      //noinspection JSValidateTypes
      var token = this.parsePatterns_(context, this.latexStyle.symbols(context.currentState, sourceCharacter));
      if (token === null) {
        // if cannot parse a symbol token
        // TODO notification about the unrecognized symbol
        ++context.position; // go to the next sources character
        // go to the next line character (the line is the same, \n was parsed for a space token)
        ++context.charNumber;
        // generate unrecognized symbol token
        token = new LatexTree.SymbolToken({ pattern: sourceCharacter });
      } else {// if the token was parsed
        // TODO parse words and numbers
      }
      return token;
    }

    /**
     * Try to parse a symbol pattern
     * @param {!Context} context the parsing context// generate unrecognized symbol token
     * @param {!Array.<!LatexStyle.Symbol>} symbols
     *        the symbol or command descriptions in the priority descending order
     * @return {?LatexTree.Token} the parsed symbol or command token or null if cannot parse
     * @private
     * @author Kirill Chuvilin <k.chuvilin@texnous.org>
     */

  }, {
    key: 'parsePatterns_',
    value: function parsePatterns_(context, symbols) {
      var _this = this;

      var contextBackup = context.copy(); // backup the current context
      var token = null; // the parsed token
      symbols.some(function (symbol) {
        // for all the symbols until the parsing success
        // stop if the token was parsed
        if (token = _this.parsePattern_(context, symbol)) return true;
        contextBackup.copy(context); // restore the context
        return false; // go to the next symbol
      });
      return token;
    }

    /**
     * Try to parse a symbol pattern
     * @param {!Context} context the parsing context
     * @param {!Array.<!LatexStyle.Symbol>} symbol the symbol or command description
     * @return {?LatexTree.Token} the parsed symbol or command token or null if cannot parse
     * @private
     * @author Kirill Chuvilin <k.chuvilin@texnous.org>
     */

  }, {
    key: 'parsePattern_',
    value: function parsePattern_(context, symbol) {
      var currentTokenBackup = context.currentToken; // store the current token
      // if a command description is given
      context.currentToken = symbol instanceof LatexStyle.Command ? new LatexTree.CommandToken({ command: symbol }) : // generate a command token
      new LatexTree.SymbolToken({ symbol: symbol }); // generate a symbol token
      //noinspection JSUnresolvedVariable
      var patternComponents = symbol.patternComponents; // the symbol pattern components
      var nPatternComponents = patternComponents.length; // the pattern componen number
      var iPatternComponent = 0; // the pattern component iterator
      // for all the pattern components
      for (; iPatternComponent < nPatternComponents; ++iPatternComponent) {
        var patternComponent = patternComponents[iPatternComponent]; // the pattern component
        switch (typeof patternComponent === 'undefined' ? 'undefined' : _typeof(patternComponent)) {
          case 'number':
            {
              // if a parameter is expected
              //noinspection JSUnresolvedFunction
              var parameter = symbol.parameter(patternComponent); // the parameter description
              // try to get the end label for the parameter
              var parameterEndLabel = patternComponents[iPatternComponent + 1];
              if (typeof parameterEndLabel === 'string') {
                // if there is a end label
                // if can parse the parameter token
                if (this.parseParameterToken_(context, parameter, parameterEndLabel)) {
                  // exit if there is no the end label at the positions
                  if (!context.source.startsWith(parameterEndLabel, context.position)) return null;
                  context.position += parameterEndLabel.length; // skip the end label in the sources
                  context.charNumber += parameterEndLabel.length; // skip the end label in the line
                  ++iPatternComponent; // skip the end label in the pattern
                  continue; // go to the next pattern component
                }
              } else {
                // if there is no a end label
                // go to the next pattern char if can parse the parameter token
                if (this.parseParameterToken_(context, parameter)) continue;
              }
            }
            break; // stop parsing if cannot parse a parameter token
          case 'string':
            //
            while (this.parseCommentLine_(context)) {} // skip all the comments
            // if the sources fragment is equal the pattern component
            if (context.source.startsWith(patternComponent, context.position)) {
              context.position += patternComponent.length; // skip the pattern component in the sources
              context.charNumber += patternComponent.length; // skip the pattern component in the line
              continue; // go to the next pattern component
            }
            break;
          default:
            // if a space is expected
            // go to the next pattern component if can parse a space
            if (this.parseSpaceToken_(context)) continue;
        }
        break; // stop parsing if there was no continue call
      }
      // return if the pattern parsing was broken
      if (iPatternComponent < nPatternComponents) return null;
      var parsedToken = context.currentToken; // the parsed token to return
      context.currentToken = currentTokenBackup; // restore the current token
      //noinspection JSUnresolvedFunction,JSUnresolvedVariable
      context.updateState(symbol.operations); // update the LaTeX state
      return parsedToken;
    }

    /**
     * Parse tokens until the label
     * @param {!Context} context the parsing context
     * @param {string} endLabel the label to parse until
     * @param {Latex.Lexeme=} opt_lexeme the lexeme of the single token to parse
     * @return {boolean} true if the parsing was successful, false otherwise
     * @private
     * @author Kirill Chuvilin <k.chuvilin@texnous.org>
     */

  }, {
    key: 'parseUntilLabel_',
    value: function parseUntilLabel_(context, endLabel, opt_lexeme) {
      switch (opt_lexeme) {
        // TODO parse special lexemes
        default:
          {
            // while not reached the label
            while (!context.source.startsWith(endLabel, context.position)) {
              if (context.position >= context.source.length) {
                // if there is no more sources
                // TODO notification about unexpected sources end
                return false;
              }
              this.parseToken_(context);
            }
            return true;
          }}
    }
  }]);

  return _class;
}();

/**
 * The parsing context
 * @struct
 * @property {string} source - The source to parse
 * @property {number} position - The current position in the source
 * @property {?LatexTree.Token} currentToken - The currently parsing token
 * @property {!Latex.State} currentState - The current LaTeX state
 * @property {!Array.<!Latex.State>} stateStack - The stack of LaTeX sates
 * @property {!Array.<string>} comments - The comment list for the nex token
 * @property {number} lineNumber - The current line number
 * @property {number} charNumber - The current char number in the current line
 * @property {function} copy
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */
var Context = module.exports['Context'] = function () {
  //noinspection JSUnusedGlobalSymbols
  /**
   * Constructor
   * @param {string=} opt_source the sources to parse (empty string by default)
   */
  function _class2(opt_source) {
    _classCallCheck(this, _class2);

    this.source = opt_source || ''; // store the sources
    this.position = 0; // start from the beginning
    this.lineNumber = 0; // start from the line 0
    this.charNumber = 0; // start from the char 0
    this.currentToken = null; // no tokens were parsed
    this.currentState = new Latex.State(); // initial LaTeX state
    this.stateStack = []; // no stored states
    this.comments = []; // no comments for the next token
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Copy this context
   * @param {!Context=} opt_target the context to copy to or undefined to create a new one
   * @return {!Context} the context copy
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */


  _createClass(_class2, [{
    key: 'copy',
    value: function copy(opt_target) {
      var target = opt_target || new Context(); // the context to copy this context in
      target.source = this.source;
      target.position = this.position;
      target.lineNumber = this.lineNumber;
      target.charNumber = this.charNumber;
      target.currentToken = this.currentToken;
      target.currentState = this.currentState.copy();
      target.stateStack = this.stateStack.slice();
      target.comments = this.comments.slice();
      return target;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Update the LaTeX state
     * @param {!Array.<!Latex.Operation>} operations the LaTeX operation list
     * @author Kirill Chuvilin <k.chuvilin@texnous.org>
     */

  }, {
    key: 'updateState',
    value: function updateState(operations) {
      var _this2 = this;

      if (!(operations instanceof Array)) throw new TypeError('"operations" isn\'t an Array instance');
      var newModeStates = {}; // the modes to update
      operations.forEach(function (operation) {
        //noinspection JSUnresolvedVariable
        switch (operation.directive) {
          case Latex.Directive.BEGIN:
            //noinspection JSUnresolvedVariable
            switch (operation.operand) {
              case Latex.GROUP:
                _this2.currentState.update(newModeStates); // store the mode states
                newModeStates = {}; // no more states to update
                _this2.stateStack.push(_this2.currentState.copy()); // store the current state
                break;
              default:
                //noinspection JSUnresolvedVariable
                newModeStates[operation.operand] = true; // turn the state on
            }
            break;
          case Latex.Directive.END:
            //noinspection JSUnresolvedVariable
            switch (operation.operand) {
              case Latex.GROUP:
                newModeStates = {}; // no need to store the states
                if (_this2.stateStack.length < 1) throw new Error('state stack is empty');
                _this2.currentState = _this2.stateStack.pop(); // restore the current state
                break;
              default:
                //noinspection JSUnresolvedVariable
                newModeStates[operation.operand] = false; // turn the state off
            }
            break;
        }
      });
      this.currentState.update(newModeStates); // store the mode states
    }
  }]);

  return _class2;
}();
//# sourceMappingURL=LatexParser.js.map