/**
 * @fileoverview LaTeX style structures
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

/**@module */

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var testProperties = require('./Utils').testProperties; // object property testing function
/**
 * General LaTeX definitions
 * @property Lexeme
 * @property Mode
 * @property OperationProperties
 */
var Latex = require('./Latex');

/**
 * LaTeX style collection
 * @class
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */
module.exports = function () {
  /**
   * LaTeX style package properties
   * @interface PackageProperties
   * @property {(!Array.<!SymbolProperties>|undefined)} symbols -
   *           The symbols of the package in the priority descending order
   * @property {(!Array.<!CommandProperties>|undefined)} commands -
   *           The commands of the package in the priority descending order
   * @property {(!Array.<!EnvironmentProperties>|undefined)} environments -
   *           The environments of the package
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */

  //noinspection JSUnusedGlobalSymbols
  /**
   * Constructor
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  function _class() {
    _classCallCheck(this, _class);

    /**
     * The symbols by the first symbol of the pattern in the priority increasing order
     * @private {!Object.<string,!Array.<!Symbol>>}
     * @name symbols_
     */
    Object.defineProperty(this, 'symbols_', { value: {} });
    /**
     * The commands by the name in the priority increasing order
     * @private {!Object.<string,!Array.<!Command>>}
     * @name commands_
     */
    Object.defineProperty(this, 'commands_', { value: {} });
    /**
     * The environments by the name in the priority increasing order
     * @private {!Object.<string,!Array.<!Environment>>}
     * @name environments_
     */
    Object.defineProperty(this, 'environments_', { value: {} });
  }

  _createClass(_class, [{
    key: 'loadPackage',


    //noinspection JSUnusedGlobalSymbols
    /**
     * Load a package with style definitions
     * @param {string} packageName the name of the style package
     * @param {PackageProperties} stylePackage the style package
     * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
     */
    value: function loadPackage(packageName, stylePackage) {
      if (stylePackage.symbols !== undefined) {
        // if the symbol descriptions are defined
        if (!(stylePackage.symbols instanceof Array)) throw new TypeError('"stylePackage.symbols" isn\'t an Array');
        // for all the symbol descriptions
        for (var iSymbol = stylePackage.symbols.length - 1; iSymbol >= 0; --iSymbol) {
          var symbol = new _Symbol(stylePackage.symbols[iSymbol]); // the symbol description
          if (symbol.pattern) {
            // if the symbol has a pattern
            var symbolPatternFirstChar = symbol.pattern[0]; // the first char of the pattern
            // the symbols with the same pattern first char
            (this.symbols_[symbolPatternFirstChar] || (this.symbols_[symbolPatternFirstChar] = [])).push({ symbol: symbol, packageName: packageName }); // store the symbol and the package name
          }
        }
      }
      if (stylePackage.commands !== undefined) {
        // if the command descriptions are defined
        if (!(stylePackage.commands instanceof Array)) throw new TypeError('"stylePackage.commands" isn\'t an Array');
        // for all the command descriptions
        for (var iCommand = stylePackage.commands.length - 1; iCommand >= 0; --iCommand) {
          var command = new Command(stylePackage.commands[iCommand]); // the command description
          if (command.name) {
            // if the command has a name
            // the commands with the same name
            (this.commands_[command.name] || (this.commands_[command.name] = [])).push({ command: command, packageName: packageName }); // store the command and the package name
          }
        }
      }
      if (stylePackage.environments !== undefined) {
        // if the environment descriptions are defined
        if (!(stylePackage.environments instanceof Array)) throw new TypeError('"stylePackage.environments" isn\'t an Array');
        // for all the environment descriptions
        for (var iEnvironment = stylePackage.environments.length - 1; iEnvironment >= 0; --iEnvironment) {
          // the environment description
          var environment = new Environment(stylePackage.environments[iEnvironment]);
          if (environment.name) {
            // if the environment has a name
            // the environments with the same name
            (this.environments_[environment.name] || (this.environments_[environment.name] = [])).push({ environment: environment, packageName: packageName }); // store the environment and the package name
          }
        }
      }
    }
  }, {
    key: 'unloadPackage',


    //noinspection JSUnusedGlobalSymbols
    /**
     * Unload a package with style definitions
     * @param {string} packageName the name of the style package
     * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
     */
    value: function unloadPackage(packageName) {
      // for all the symbol pattern first chars
      for (var symbolPatternFirstChar in this.symbols_) {
        if (this.symbols_.hasOwnProperty(symbolPatternFirstChar)) {
          // the filtered symbols with the same pattern first char
          var filteredSymbols = this.symbols_[symbolPatternFirstChar].filter(function (styleItem) {
            return styleItem.packageName !== packageName;
          });
          // if there are still some symbols with the same pattern first char
          if (filteredSymbols.length) {
            // store the filtered symbol descriptions
            this.symbols_[symbolPatternFirstChar] = filteredSymbols;
          } else {
            // if there are no the symbols with the same pattern first char
            delete this.symbols_[symbolPatternFirstChar]; // delete the key-value pair
          }
        }
      } // for all the command names
      for (var commandName in this.commands_) {
        if (this.commands_.hasOwnProperty(commandName)) {
          // the filtered commands with the same name
          var filteredCommands = this.commands_[commandName].filter(function (styleItem) {
            return styleItem.packageName !== packageName;
          });
          if (filteredCommands.length) {
            // if there are still some commands with the same name
            this.commands_[commandName] = filteredCommands; // store the filtered command descriptions
          } else {
            // if there are no the commands with the same name
            delete this.commands_[commandName]; // delete the key-value pair
          }
        }
      } // for all the environment names
      for (var environmentName in this.environments_) {
        if (this.environments_.hasOwnProperty(environmentName)) {
          // the filtered environments with the same name
          var filteredEnvironments = this.environments_[environmentName].filter(function (styleItem) {
            return styleItem.packageName !== packageName;
          });
          // if there are still some environments with the same name
          if (filteredEnvironments.length) {
            // store the filtered environment descriptions
            this.environments_[environmentName] = filteredEnvironments;
          } else {
            // if there are no the environments with the same name
            delete this.environments_[environmentName]; // delete the key-value pair
          }
        }
      }
    }
  }, {
    key: 'symbols',


    //noinspection JSUnusedGlobalSymbols
    /**
     * Get symbols
     * @param {!Latex.State} state the state that the symbols must match to
     * @param {string} patternFirstChar the first char of the symbol parameter pattern
     * @return {!Array.<!Symbol>} the list of symbols in the priority descending order
     * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
     */
    value: function symbols(state, patternFirstChar) {
      if (!(state instanceof Latex.State)) throw new SyntaxError('"state" isn\'t a Latex.State instance');
      // all the symbols with the defined first pattern char
      var symbols = this.symbols_[patternFirstChar];
      if (symbols === undefined) return []; // return empty list if there are no such symbols
      var filteredSymbols = []; // the list of the symbols matching to the state
      for (var iSymbol = symbols.length - 1; iSymbol >= 0; --iSymbol) {
        // for all the symbols
        var symbol = symbols[iSymbol].symbol; // the symbol
        // store the symbol if it matches to the state
        //noinspection JSUnresolvedFunction
        if (state.test(symbol.modes)) filteredSymbols.push(symbol);
      }
      return filteredSymbols;
    }
  }, {
    key: 'commands',


    //noinspection JSUnusedGlobalSymbols
    /**
     * Get commands
     * @param {!Latex.State} state the state that the commands must match to
     * @param {!string} name the name of the command
     * @return {Array.<Command>} the list of commands in the priority descending order
     * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
     */
    value: function commands(state, name) {
      if (!(state instanceof Latex.State)) throw new SyntaxError('"state" isn\'t a Latex.State instance');
      var commands = this.commands_[name]; // all the commands with the defined name
      if (!commands) return []; // return empty list if there are no such commands
      var filteredCommands = []; // the list of the commands matching to the state
      for (var iCommand = commands.length - 1; iCommand >= 0; --iCommand) {
        // for all the commands
        var command = commands[iCommand].command; // the command
        // store the command if it matches to the state
        //noinspection JSUnresolvedFunction
        if (state.test(command.modes)) filteredCommands.push(command);
      }
      return filteredCommands;
    }
  }, {
    key: 'environments',


    //noinspection JSUnusedGlobalSymbols
    /**
     * Get environments
     * @param {!Latex.State} state the state that the environments must match to
     * @param {!string} name the name of the environment
     * @return {Array.<Environment>} the list of environments in the priority descending order
     * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
     */
    value: function environments(state, name) {
      if (!(state instanceof Latex.State)) throw new SyntaxError('state isn\'t Latex.State instance');
      var environments = this.environments_[name]; // all the environments with the defined name
      if (!environments) return []; // return empty list if there are no such environments
      var filteredEnvironments = []; // the list of the environments matching to the state
      // for all the environments
      for (var iEnvironment = environments.length - 1; iEnvironment >= 0; --iEnvironment) {
        var environment = environments[iEnvironment].environment; // the environment
        // store the environment if it matches to the state
        //noinspection JSUnresolvedFunction
        if (state.test(environment.modes)) filteredEnvironments.push(environment);
      }
      return filteredEnvironments;
    }
  }]);

  return _class;
}();

/**
 * LaTeX style item properties
 * @interface ItemProperties
 * @property {(Latex.Lexeme|null|undefined)} lexeme - The logical lexeme
 * @property {(!Object.<Latex.Mode, boolean>|undefined)} modes -
 *           The modes where the item is defined or not
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */

/**
 * LaTeX style item encapsulation
 * @class
 * @property {(Latex.Lexeme|null)} lexeme - The logical lexeme
 * @property {!Object.<Latex.Mode, boolean>} modes - The modes where the item is defined or not
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */
var Item = function () {
  //noinspection JSUnusedGlobalSymbols
  /**
   * Constructor.
   * @param {!ItemProperties=} opt_initialProperties the initial property values
   */
  function Item(opt_initialProperties) {
    _classCallCheck(this, Item);

    // do nothing if there are no initial properties
    if (opt_initialProperties === undefined) return;
    if (!(opt_initialProperties instanceof Object)) throw new TypeError('"initialProperties" isn\'t an Object instance');
    switch (opt_initialProperties.lexeme) {
      case undefined:
        break; // do nothing if no lexeme defined
      case null:
        break; // do nothing if the default lexeme defined
      default:
        var lexeme = Latex.Lexeme[opt_initialProperties.lexeme]; // verify the lexeme
        if (lexeme === undefined) throw new TypeError('"initialProperties.lexeme" isn\'t a Latex.Lexeme option');
        Object.defineProperty(this, 'lexeme', { value: lexeme });
    }
    if (opt_initialProperties.modes !== undefined) {
      // if the mode states are set
      if (!(opt_initialProperties.modes instanceof Object)) throw new TypeError('"initialProperties.modes" isn\'t an Object instance');
      Object.defineProperty(this, 'modes', { value: {} }); // create the mode state storage
      for (var modeKey in opt_initialProperties.modes) {
        // for all the given modes
        //noinspection JSUnfilteredForInLoop
        var mode = Latex.Mode[modeKey]; // verify the mode key
        if (mode === undefined) // if the mode is unknown
          throw new TypeError('"initialProperties.modes[' + modeKey + ']" isn\'t a Latex.Mode option');
        // store the mode state
        //noinspection JSUnfilteredForInLoop
        Object.defineProperty(this.modes, mode, {
          value: opt_initialProperties.modes[modeKey],
          enumerable: true
        });
      }
    }
  }

  /**
   * Compare this item with the other one
   * @param {?Item} other the item to compare with
   * @return {boolean} true if the items are equal, false otherwise
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */


  _createClass(Item, [{
    key: 'equals',
    value: function equals(other) {
      if (!(other instanceof Item)) return false;
      return this.lexeme === other.lexeme && testProperties(this.modes, other.modes, Latex.Mode, false);
    }
  }]);

  return Item;
}();
Object.defineProperties(Item.prototype, { // default property values
  lexeme: { value: null, enumerable: true }, // no lexeme by default
  modes: { value: {}, enumerable: true } // no mode mask by default
});

/**
 * LaTeX symbol or command parameter properties
 * @interface ParameterProperties
 * @extends ItemProperties
 * @property {(!Array.<!Latex.Operation|!Latex.OperationProperties>|undefined)} operations -
 *           The LaTeX operations that are performed before the parameter
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */

/**
 * LaTeX symbol or command parameter encapsulation
 * @class
 * @extends Item
 * @property {!Array.<!Latex.Operation>} operations -
 *           The LaTeX operations that are performed before this parameter
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */
var Parameter = module.exports['Parameter'] = function (_Item) {
  _inherits(_class2, _Item);

  //noinspection JSUnusedGlobalSymbols
  /**
   * Constructor
   * @param {!ParameterProperties=} opt_initialProperties the initial property values
   */
  function _class2(opt_initialProperties) {
    _classCallCheck(this, _class2);

    // the superclass constructor
    // do nothing if there are no initial properties
    var _this = _possibleConstructorReturn(this, (_class2.__proto__ || Object.getPrototypeOf(_class2)).call(this, opt_initialProperties));

    if (opt_initialProperties === undefined) return _possibleConstructorReturn(_this);
    if (opt_initialProperties.operations !== undefined) {
      // if the operation list is set
      if (!(opt_initialProperties.operations instanceof Array)) throw new TypeError('"initialProperties.operations" isn\'t an Array instance');
      Object.defineProperty(_this, 'operations_', { // generate and store the operations list
        value: opt_initialProperties.operations.map(function (operation) {
          return new Latex.Operation(operation);
        })
      });
    }
    return _this;
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Get the LaTeX operations that are performed before this parameter
   * @return {!Array.<!Latex.Operation>} the operation list
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */


  _createClass(_class2, [{
    key: 'equals',


    //noinspection JSUnusedGlobalSymbols
    /**
     * Compare this parameter with the other one
     * @param {?Parameter} other the parameter to compare with
     * @return {boolean} true if the parameters are equal, false otherwise
     * @override
     * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
     */
    value: function equals(other) {
      if (!(other instanceof Parameter)) return false; // type test
      if (!_get(_class2.prototype.__proto__ || Object.getPrototypeOf(_class2.prototype), 'equals', this).call(this, other)) return false; // superclass test
      //noinspection JSUnresolvedVariable
      if (this.operations_.length !== other.operations_.length) return false;
      // test all the operations
      //noinspection JSUnresolvedVariable,JSUnresolvedFunction
      return this.operations_.every(function (operation, iOperation) {
        return operation.equals(other.operations_[iOperation]);
      });
    }
  }, {
    key: 'operations',
    get: function get() {
      return this.operations_.slice();
    }
  }]);

  return _class2;
}(Item);
Object.defineProperties(Parameter.prototype, { // make getters and setters enumerable
  operations: { enumerable: true }
});
Object.defineProperties(Parameter.prototype, { // default property values
  operations_: { value: [], enumerable: false } // empty operation list by default
});

/**
 * LaTeX symbol properties
 * @interface SymbolProperties
 * @extends ItemProperties
 * @property {(!Array.<!Latex.Operation|!Latex.OperationProperties>|undefined)} operations -
 *           The LaTeX operations that
 * @property {(!Array.<!Parameter|!ParameterProperties>|undefined)} parameters -
 *           The parameters description list
 * @property {(string|undefined)} pattern - The LaTeX input pattern
 * @property {(string|undefined)} html - The HTML output pattern
 * are performed after the symbol
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */

/**
 * LaTeX symbol encapsulation
 * @class
 * @extends Item
 * @property {!Array.<!Latex.Operation>} operations -
 *           The LaTeX operations that are performed after this symbol
 * @property {!Array.<!Parameter>} parameters - The parameters description list
 * @property {!Array.<null|string|number>} patternComponents - The LaTeX input pattern components
 * @property {string} pattern - The LaTeX input pattern
 * @property {string} html - The HTML output pattern
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */
var _Symbol = module.exports['Symbol'] = function (_Item2) {
  _inherits(_class3, _Item2);

  //noinspection JSUnusedGlobalSymbols
  /**
   * Constructor
   * @param {!SymbolProperties=} opt_initialProperties the initial property values
   */
  function _class3(opt_initialProperties) {
    _classCallCheck(this, _class3);

    // the superclass constructor
    // do nothing if there are no initial properties
    var _this2 = _possibleConstructorReturn(this, (_class3.__proto__ || Object.getPrototypeOf(_class3)).call(this, opt_initialProperties));

    if (opt_initialProperties === undefined) return _possibleConstructorReturn(_this2);
    if (opt_initialProperties.operations !== undefined) {
      // if the operation list is set
      if (!(opt_initialProperties.operations instanceof Array)) throw new TypeError('"initialProperties.operations" isn\'t an Array instance');
      Object.defineProperty(_this2, 'operations_', { // generate and store the operations list
        value: opt_initialProperties.operations.map(function (operation) {
          return new Latex.Operation(operation);
        })
      });
    }
    if (opt_initialProperties.parameters !== undefined) {
      // if the parameters list is set
      if (!(opt_initialProperties.parameters instanceof Array)) throw new TypeError('"initialProperties.parameters" isn\'t an Array instance');
      Object.defineProperty(_this2, 'parameters_', { // generate and store the parameters list
        value: opt_initialProperties.parameters.map(function (parameter) {
          return new Parameter(parameter);
        })
      });
    }
    if (opt_initialProperties.pattern !== undefined) {
      // if the LaTeX pattern is set
      if (typeof opt_initialProperties.pattern !== 'string') throw new TypeError('"initialProperties.pattern" isn\'t a string');
      // try to parse the pattern
      var patternComponents = opt_initialProperties.pattern.match(/([ \t]+|#\d+|[^ \t#]+)/g);
      if (patternComponents !== null) {
        // if there is a non-trivial pattern
        Object.defineProperty(_this2, 'patternComponents_', { // store the pattern components
          value: patternComponents.map(function (patternPart) {
            switch (patternPart[0]) {
              case ' ':case '\t':
                // if a space part
                return null; // null is a mark for spaces
              case '#':
                // if a parameter part
                var parameterIndex = Number(patternPart.substring(1)) - 1; // the index of a parameter
                if (!_this2.parameters_[parameterIndex]) throw new TypeError('"initialProperties.pattern" contains the incorrect parameter number ' + patternPart.substring(1));
                return parameterIndex;
              default:
                // raw pattern part
                return patternPart;
            }
          })
        });
      }
    }
    if (opt_initialProperties.html !== undefined) {
      // if the LaTeX pattern is set
      if (typeof opt_initialProperties.html !== 'string') throw new TypeError('"initialProperties.html" isn\'t a string');
      // store the pattern
      Object.defineProperty(_this2, 'html', { value: opt_initialProperties.html, enumerable: true });
    }
    return _this2;
  }

  _createClass(_class3, [{
    key: 'parameter',


    //noinspection JSUnusedGlobalSymbols
    /**
     * Get the parameter description
     * @param {number} parameterIndex the index of the parameter
     * @return {?Latex.Parameter} the parameter or null if there is no parameter with such an index
     * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
     */
    value: function parameter(parameterIndex) {
      return this.parameters_[parameterIndex] || null;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get the pattern components
     * @return {!Array.<!Latex.Parameter>} the pattern component list
     * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
     */

  }, {
    key: 'equals',


    /**
     * Compare this symbol with the other one
     * @param {?Symbol} other the symbol to compare with
     * @return {boolean} true if the symbols are equal, false otherwise
     * @override
     * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
     */
    value: function equals(other) {
      if (!(other instanceof _Symbol)) return false; // type test
      if (!_get(_class3.prototype.__proto__ || Object.getPrototypeOf(_class3.prototype), 'equals', this).call(this, other)) return false; // superclass test
      //noinspection JSUnresolvedVariable
      if (this.operations_.length !== other.operations_.length) return false;
      // test all the operations
      //noinspection JSUnresolvedVariable,JSUnresolvedFunction
      if (!this.operations_.every(function (operation, iOperation) {
        return operation.equals(other.operations_[iOperation]);
      })) return false;
      //noinspection JSUnresolvedVariable
      if (this.parameters_.length !== other.parameters_.length) return false;
      // test all the parameters
      //noinspection JSUnresolvedVariable,JSUnresolvedFunction
      if (!this.parameters_.every(function (parameter, iParameter) {
        return parameter.equals(other.parameters_[iParameter]);
      })) return false;
      return this.html === other.html;
    }
  }, {
    key: 'operations',


    //noinspection JSUnusedGlobalSymbols
    /**
     * Get the LaTeX operations that are performed after this symbol
     * @return {!Array.<!Latex.Operation>} the operation list
     * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
     */
    get: function get() {
      return this.operations_.slice();
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get the parameters description list
     * @return {!Array.<!Latex.Parameter>} the parameter list
     * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
     */

  }, {
    key: 'parameters',
    get: function get() {
      return this.parameters_.slice();
    }
  }, {
    key: 'patternComponents',
    get: function get() {
      return this.patternComponents_.slice();
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get the pattern
     * @return {string} the LaTeX input pattern
     * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
     */

  }, {
    key: 'pattern',
    get: function get() {
      return this.patternComponents_.map(function (patternComponent) {
        switch (typeof patternComponent === 'undefined' ? 'undefined' : _typeof(patternComponent)) {
          case 'number':
            return '#' + (patternComponent + 1);
          case 'string':
            return patternComponent;
          default:
            return ' ';
        }
      }).join('');
    }
  }]);

  return _class3;
}(Item);
Object.defineProperties(_Symbol.prototype, { // make getters and setters enumerable
  operations: { enumerable: true },
  parameters: { enumerable: true },
  patternComponents: { enumerable: true },
  pattern: { enumerable: true }
});
Object.defineProperties(_Symbol.prototype, { // default property values
  operations_: { value: [], enumerable: false }, // empty operation list
  parameters_: { value: [], enumerable: false }, // empty parameter list
  patternComponents_: { value: [], enumerable: false }, // empty pattern
  html: { value: '', enumerable: true } // empty HTML pattern
});

/**
 * LaTeX command properties
 * @interface CommandProperties
 * @extends SymbolProperties
 * @property {(string|undefined)} name - The command name (a sequence of letters and optional star)
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */

/**
 * LaTeX command encapsulation
 * @class
 * @extends Symbol
 * @property {string} name - The command name (a sequence of letters and optional star)
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */
var Command = module.exports['Command'] = function (_Symbol2) {
  _inherits(_class4, _Symbol2);

  //noinspection JSUnusedGlobalSymbols
  /**
   * Constructor
   * @param {!CommandProperties=} opt_initialProperties the initial property values
   */
  function _class4(opt_initialProperties) {
    _classCallCheck(this, _class4);

    // the superclass constructor
    // do nothing if there are no initial properties
    var _this3 = _possibleConstructorReturn(this, (_class4.__proto__ || Object.getPrototypeOf(_class4)).call(this, opt_initialProperties));

    if (opt_initialProperties === undefined) return _possibleConstructorReturn(_this3);
    if (opt_initialProperties.name !== undefined) {
      // if the name is set
      if (typeof opt_initialProperties.name !== 'string') throw new TypeError('"initialProperties.name" isn\'t a string');
      // store the name
      Object.defineProperty(_this3, 'name', { value: opt_initialProperties.name });
    }
    return _this3;
  }

  _createClass(_class4, [{
    key: 'equals',


    //noinspection JSUnusedGlobalSymbols
    /**
     * Compare this command with the other one
     * @param {?Command} other the command to compare with
     * @return {boolean} true if the commands are equal, false otherwise
     * @override
     * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
     */
    value: function equals(other) {
      if (!(other instanceof Command)) return false; // type test
      if (!_get(_class4.prototype.__proto__ || Object.getPrototypeOf(_class4.prototype), 'equals', this).call(this, other)) return false; // superclass test
      return this.name === other.name;
    }
  }]);

  return _class4;
}(_Symbol);
Object.defineProperties(Command.prototype, { // default property values
  name: { value: '', enumerable: true } // empty name
});

/**
 * LaTeX command properties
 * @interface EnvironmentProperties
 * @extends ItemProperties
 * @property {(string|undefined)} name - The command name (a sequence of letters and optional star)
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */

/**
 * LaTeX environment encapsulation
 * @class
 * @extends Item
 * @property {string} name - The environment name (a sequence of letters and optional star)
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */
var Environment = module.exports['Environment'] = function (_Item3) {
  _inherits(_class5, _Item3);

  //noinspection JSUnusedGlobalSymbols
  /**
   * Constructor
   * @param {!EnvironmentProperties=} opt_initialProperties the initial property values
   */
  function _class5(opt_initialProperties) {
    _classCallCheck(this, _class5);

    // the superclass constructor
    // do nothing if there are no initial properties
    var _this4 = _possibleConstructorReturn(this, (_class5.__proto__ || Object.getPrototypeOf(_class5)).call(this, opt_initialProperties));

    if (opt_initialProperties === undefined) return _possibleConstructorReturn(_this4);
    if (opt_initialProperties.name !== undefined) {
      // if the name is set
      if (typeof opt_initialProperties.name !== 'string') throw new TypeError('"initialProperties.name" isn\'t a string');
      // store the name
      Object.defineProperty(_this4, 'name', { value: opt_initialProperties.name });
    }
    return _this4;
  }

  _createClass(_class5, [{
    key: 'equals',


    //noinspection JSUnusedGlobalSymbols
    /**
     * Compare this environment with the other one
     * @param {?Environment} other the environment to compare with
     * @return {boolean} true if the environments are equal, false otherwise
     * @override
     * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
     */
    value: function equals(other) {
      if (!(other instanceof Environment)) return false; // type test
      if (!_get(_class5.prototype.__proto__ || Object.getPrototypeOf(_class5.prototype), 'equals', this).call(this, other)) return false; // superclass test
      return this.name === other.name;
    }
  }]);

  return _class5;
}(Item);
Object.defineProperties(Environment.prototype, { // default property values
  name: { value: '', enumerable: true } // empty name
});
//# sourceMappingURL=LatexStyle.js.map