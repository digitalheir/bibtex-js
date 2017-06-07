/**
 * @fileoverview LaTeX style structures
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

/**@module */


import {isNumber, mustNotBeUndefined, testProperties} from './Utils'; // object property testing function

import {
  Lexeme, Mode, modes, mustBeMode, mustBeOperationProperties, Operation, OperationProperties,
  State
} from './Latex';


function isArray(x: any): x is any[] {
  return x.constructor === Array
}

function mustBeArray(x: any): any[] {
  if (!isArray(x))throw new Error();
  return x;
}

/**
 * LaTeX style package properties
 * @interface PackageProperties
 * @property {(!Array.<!SymbolProperties>|undefined)} symbols - The symbols of the package in the priority descending order
 * @property {(!Array.<!CommandProperties>|undefined)} commands - The commands of the package in the priority descending order
 * @property {(!Array.<!EnvironmentProperties>|undefined)} environments - The environments of the package
 * @author Kirill Chuvilin <k.chuvilin@texnous.org>
 */
export interface PackageProperties {
  symbols?: SymbolProperties[];
  commands?: CommandProperties[];
  environments?: EnvironmentProperties[];
}

/**
 * LaTeX style collection
 * @class
 * @author Kirill Chuvilin <k.chuvilin@texnous.org>
 */
export default class LatexStyle {
  private environments_: { [name: string]: EnvironmentAndPackage[] };
  private commands_: { [name: string]: CommandAndPackage[] };
  private symbols_: { [name: string]: SymbolAndPackage[] };


  /**
   * Constructor
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  constructor() {
    /**
     * The symbols by the first symbol of the pattern in the priority increasing order
     * @private {!Object.<string,!Array.<!Symbol>>}
     * @name symbols_
     */
    this.symbols_ = {};
    /**
     * The commands by the name in the priority increasing order
     * @private {!Object.<string,!Array.<!Command>>}
     * @name commands_
     */
    this.commands_ = {};
    /**
     * The environments by the name in the priority increasing order
     * @private {!Object.<string,!Array.<!Environment>>}
     * @name environments_
     */
    this.environments_ = {};
  };


  /**
   * Load a package with style definitions
   * @param {string} packageName the name of the style package
   * @param {PackageProperties} stylePackage the style package
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  loadPackage(packageName: string, stylePackage: PackageProperties) {
    if (stylePackage.symbols !== undefined) { // if the symbol descriptions are defined
      if (!(stylePackage.symbols instanceof Array))
        throw new TypeError('"stylePackage.symbols" isn\'t an Array');
      // for all the symbol descriptions
      for (let iSymbol = stylePackage.symbols.length - 1; iSymbol >= 0; --iSymbol) {
        let symbol: Symbol = new Symbol(stylePackage.symbols[iSymbol]); // the symbol description
        if (symbol.pattern) { // if the symbol has a pattern
          let symbolPatternFirstChar = symbol.pattern[0]; // the first char of the pattern
          // the symbols with the same pattern first char
          if (!this.symbols_.hasOwnProperty(symbolPatternFirstChar))
            this.symbols_[symbolPatternFirstChar] = [];
          let symbols: SymbolAndPackage[] = this.symbols_[symbolPatternFirstChar];

          symbols.push({symbol, packageName}); // store the symbol and the package name
        }
      }
    }
    if (stylePackage.commands !== undefined) { // if the command descriptions are defined
      if (!(stylePackage.commands instanceof Array))
        throw new TypeError('"stylePackage.commands" isn\'t an Array');
      // for all the command descriptions
      for (let iCommand = stylePackage.commands.length - 1; iCommand >= 0; --iCommand) {
        let command = new Command(stylePackage.commands[iCommand]); // the command description
        if (command.name) { // if the command has a name
          // the commands with the same name
          (this.commands_[command.name] || (this.commands_[command.name] = []))
            .push({command, packageName}); // store the command and the package name
        }
      }
    }
    if (stylePackage.environments !== undefined) { // if the environment descriptions are defined
      if (!(stylePackage.environments instanceof Array))
        throw new TypeError(`"stylePackage.environments" isn't an Array`);
      // for all the environment descriptions
      for (let iEnvironment = stylePackage.environments.length - 1; iEnvironment >= 0;
           --iEnvironment) {
        // the environment description
        let environment: Environment = new Environment(stylePackage.environments[iEnvironment]);
        const envName: string = environment.name;
        if (envName) { // if the environment has a name
          // the environments with the same name
          let storedEnv = this.environments_[envName];
          if (storedEnv === undefined) {
            storedEnv = [];
            this.environments_[envName] = storedEnv;
          }
          storedEnv.push({environment, packageName}); // store the environment and the package name
        }
      }
    }
  };


  /**
   * Unload a package with style definitions
   * @param {string} packageName the name of the style package
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  unloadPackage(packageName: string) {
    // for all the symbol pattern first chars
    for (let symbolPatternFirstChar in this.symbols_)
      if (this.symbols_.hasOwnProperty(symbolPatternFirstChar)) {
        // the filtered symbols with the same pattern first char
        let filteredSymbols = mustBeArray(this.symbols_[symbolPatternFirstChar]).filter(styleItem => {
          return styleItem.packageName !== packageName;
        });
        // if there are still some symbols with the same pattern first char
        if (filteredSymbols.length) {
          // store the filtered symbol descriptions
          this.symbols_[symbolPatternFirstChar] = filteredSymbols;
        } else { // if there are no the symbols with the same pattern first char
          delete this.symbols_[symbolPatternFirstChar]; // delete the key-value pair
        }
      }
    // for all the command names
    for (let commandName in this.commands_) if (this.commands_.hasOwnProperty(commandName)) {
      // the filtered commands with the same name
      let filteredCommands = mustBeArray(this.commands_[commandName]).filter(styleItem => {
        return styleItem.packageName !== packageName;
      });
      if (filteredCommands.length) { // if there are still some commands with the same name
        this.commands_[commandName] = filteredCommands; // store the filtered command descriptions
      } else { // if there are no the commands with the same name
        delete this.commands_[commandName]; // delete the key-value pair
      }
    }
    // for all the environment names
    for (let environmentName in this.environments_)
      if (this.environments_.hasOwnProperty(environmentName)) {
        // the filtered environments with the same name
        let filteredEnvironments = mustBeArray(this.environments_[environmentName]).filter(styleItem => {
          return styleItem.packageName !== packageName;
        });
        // if there are still some environments with the same name
        if (filteredEnvironments.length) {
          // store the filtered environment descriptions
          this.environments_[environmentName] = filteredEnvironments;
        } else { // if there are no the environments with the same name
          delete this.environments_[environmentName]; // delete the key-value pair
        }
      }
  };


  /**
   * Get symbols
   * @param {!State} state the state that the symbols must match to
   * @param {string} patternFirstChar the first char of the symbol parameter pattern
   * @return {!Array.<!Symbol>} the list of symbols in the priority descending order
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  symbols(state: State, patternFirstChar: string) {
    if (!(state instanceof State))
      throw new SyntaxError('"state" isn\'t a State instance');
    // all the symbols with the defined first pattern char
    let symbols = this.symbols_[patternFirstChar];
    if (symbols === undefined) return []; // return empty list if there are no such symbols
    let filteredSymbols = []; // the list of the symbols matching to the state
    for (let iSymbol = mustBeArray(symbols).length - 1; iSymbol >= 0; --iSymbol) { // for all the symbols
      let symbol = symbols[iSymbol].symbol; // the symbol
      // store the symbol if it matches to the state
      //noinspection JSUnresolvedFunction
      if (state.test(symbol.modes)) filteredSymbols.push(symbol);
    }
    return filteredSymbols;
  };


  /**
   * Get commands
   * @param {!State} state the state that the commands must match to
   * @param {!string} name the name of the command
   * @return {Array.<Command>} the list of commands in the priority descending order
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  commands(state: State, name: string): Command[] {
    if (!(state instanceof State))
      throw new SyntaxError('"state" isn\'t a State instance');
    let commands = this.commands_[name]; // all the commands with the defined name
    if (!commands) return []; // return empty list if there are no such commands
    let filteredCommands = []; // the list of the commands matching to the state
    for (let iCommand = mustBeArray(commands).length - 1; iCommand >= 0; --iCommand) { // for all the commands
      let command = commands[iCommand].command; // the command
      // store the command if it matches to the state
      //noinspection JSUnresolvedFunction
      if (state.test(command.modes)) filteredCommands.push(command);
    }
    return filteredCommands;
  };


  /**
   * Get environments
   * @param {!State} state the state that the environments must match to
   * @param {!string} name the name of the environment
   * @return {Array.<Environment>} the list of environments in the priority descending order
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  environments(state: State, name: string): EnvironmentAndPackage[] {
    if (!(state instanceof State)) throw new SyntaxError('state isn\'t State instance');
    let environments: EnvironmentAndPackage[] = this.environments_[name]; // all the environments with the defined name
    if (!environments) return []; // return empty list if there are no such environments

    // store the environment if it matches to the state
    return mustBeArray(environments)
      .filter(env => state.test(env.modes));
  };
};


/**
 * LaTeX style item properties
 * @interface ItemProperties
 * @property {(Lexeme|undefined)} lexeme - The logical lexeme
 * @property {(!Object.<Mode, boolean>|undefined)} modes -
 *           The modes where the item is defined or not
 * @author Kirill Chuvilin <k.chuvilin@texnous.org>
 */
export interface ItemProperties {
  lexeme?: Lexeme;
  modes?: { [mode: string]: boolean };
}


/**
 * LaTeX style item encapsulation
 * @class
 * @property {(?Lexeme)} lexeme - The logical lexeme
 * @property {!Object.<Mode, boolean>} modes - The modes where the item is defined or not
 * @author Kirill Chuvilin <k.chuvilin@texnous.org>
 */
export class Item {
  lexeme?: Lexeme;
  modes: { [mode: string]: boolean };

  /**
   * Constructor.
   * @param {!ItemProperties=} opt_initialProperties the initial property values
   */
  constructor(opt_initialProperties: ItemProperties = {}) {
    // do nothing if there are no initial properties
    if (opt_initialProperties === undefined) return;
    if (!(opt_initialProperties instanceof Object))
      throw new TypeError('"initialProperties" isn\'t an Object instance');
    switch (opt_initialProperties.lexeme) {
      case undefined:
        break; // do nothing if no lexeme defined
      case null:
        break; // do nothing if the default lexeme defined
      default:
        let lexeme = Lexeme[opt_initialProperties.lexeme]; // verify the lexeme
        if (lexeme === undefined)
          throw new TypeError('"initialProperties.lexeme" isn\'t a Lexeme option');
        Object.defineProperty(this, 'lexeme', {value: lexeme});
    }
    if (opt_initialProperties.modes !== undefined) {// if the mode states are set
      if (!(opt_initialProperties.modes instanceof Object))
        throw new TypeError('"initialProperties.modes" isn\'t an Object instance');
      Object.defineProperty(this, 'modes', {value: {}}); // create the mode state storage
      for (let modeKey in opt_initialProperties.modes) { // for all the given modes // TODO better loop
        let mode: Mode = mustBeMode(modeKey); // verify the mode key
        if (mode === undefined) // if the mode is unknown
          throw new TypeError('"initialProperties.modes[' + modeKey +
            ']" isn\'t a Mode option');
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
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  equals(other: any) {
    if (!(other instanceof Item)) return false;
    return this.lexeme === other.lexeme &&
      testProperties(this.modes, other.modes, modes, false);
  }
}
;
Object.defineProperties(Item.prototype, { // default property values
  lexeme: {value: undefined, enumerable: true}, // no lexeme by default
  modes: {value: {}, enumerable: true} // no mode mask by default
});


/**
 * LaTeX symbol or command parameter properties
 * @interface ParameterProperties
 * @extends ItemProperties
 * @property {(!Array.<!Operation|!OperationProperties>|undefined)} operations -
 *           The LaTeX operations that are performed before the parameter
 * @author Kirill Chuvilin <k.chuvilin@texnous.org>
 */
export interface ParameterProperties extends ItemProperties {
  operations?: (Operation | OperationProperties)[];
}

export function isParameterProperties(ignored: any): ignored is ParameterProperties {
  return true; // todo fields are all optional
}

export function mustBeParameterProperties(x: any): ParameterProperties {
  if (!isParameterProperties) throw new Error();
  return x;
}

/**
 * LaTeX symbol or command parameter encapsulation
 * @class
 * @extends Item
 * @property {!Array.<!Operation>} operations -
 *           The LaTeX operations that are performed before this parameter
 * @author Kirill Chuvilin <k.chuvilin@texnous.org>
 */
export class Parameter extends Item {
  //noinspection JSMismatchedCollectionQueryUpdate TODO
  private operations_: Operation[];


  /**
   * Constructor
   * @param {!ParameterProperties=} opt_initialProperties the initial property values
   */
  constructor(opt_initialProperties: ParameterProperties = {}) {
    super(opt_initialProperties); // the superclass constructor
    // do nothing if there are no initial properties
    if (opt_initialProperties === undefined) return;
    if (opt_initialProperties.operations !== undefined) { // if the operation list is set
      if (!(opt_initialProperties.operations instanceof Array))
        throw new TypeError('"initialProperties.operations" isn\'t an Array instance');
      Object.defineProperty(this, 'operations_', { // generate and store the operations list
        value: opt_initialProperties.operations.map(operation => new Operation(operation))
      });
    }
  }


  /**
   * Get the LaTeX operations that are performed before this parameter
   * @return {!Array.<!Operation>} the operation list
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  get operations(): Operation[] {
    return this.operations_.slice()
  }


  /**
   * Compare this parameter with the other one
   * @param {?Parameter} other the parameter to compare with
   * @return {boolean} true if the parameters are equal, false otherwise
   * @override
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  equals(other: any) {
    if (!(other instanceof Parameter)) return false; // type test
    if (!super.equals(other)) return false; // superclass test

    if (this.operations_.length !== other.operations_.length) return false;
    // test all the operations

    return this.operations_.every((operation, iOperation) =>
      operation.equals(other.operations_[iOperation]));
  }
}
;
Object.defineProperties(Parameter.prototype, { // make getters and setters enumerable
  operations: {enumerable: true}
});
Object.defineProperties(Parameter.prototype, { // default property values
  operations_: {value: [], enumerable: false} // empty operation list by default
});


/**
 * LaTeX symbol properties
 * @interface SymbolProperties
 * @extends ItemProperties
 * @property {(!Array.<!Operation|!OperationProperties>|undefined)} operations - The LaTeX operations that
 * @property {(!Array.<!Parameter|!ParameterProperties>|undefined)} parameters - The parameters description list
 * @property {(string|undefined)} pattern - The LaTeX input pattern
 * @property {(string|undefined)} html - The HTML output pattern
 * are performed after the symbol
 * @author Kirill Chuvilin <k.chuvilin@texnous.org>
 */
export interface SymbolProperties extends ItemProperties {
  operations?: (Operation | OperationProperties)[];
  parameters?: (Parameter | ParameterProperties)[];
  pattern?: string;
  html?: string;
}

export interface SymbolAndPackage {
  symbol: Symbol;
  packageName: string;
}

/**
 * LaTeX symbol encapsulation
 * @class
 * @extends Item
 * @property {!Array.<!Operation>} operations -
 *           The LaTeX operations that are performed after this symbol
 * @property {!Array.<!Parameter>} parameters - The parameters description list
 * @property {!Array.<undefined|string|number>} patternComponents - The LaTeX input pattern components
 * @property {string} pattern - The LaTeX input pattern
 * @property {string} html - The HTML output pattern
 * @author Kirill Chuvilin <k.chuvilin@texnous.org>
 */
export class Symbol extends Item {
  //noinspection JSMismatchedCollectionQueryUpdate // TODO
  private operations_: Operation[];
  //noinspection JSMismatchedCollectionQueryUpdate // TODO
  private parameters_: Parameter[];
  //noinspection JSMismatchedCollectionQueryUpdate // TODO
  private patternComponents_: (undefined | string | number)[];

  html: string;


  /**
   * Constructor
   * @param {!SymbolProperties=} opt_initialProperties the initial property values
   */
  constructor(opt_initialProperties: SymbolProperties = {}) {
    super(opt_initialProperties); // the superclass constructor
    // do nothing if there are no initial properties
    if (opt_initialProperties === undefined) return;
    if (opt_initialProperties.operations !== undefined) { // if the operation list is set
      if (!(opt_initialProperties.operations instanceof Array))
        throw new TypeError('"initialProperties.operations" isn\'t an Array instance');
      Object.defineProperty(this, 'operations_', { // generate and store the operations list
        value: opt_initialProperties.operations.map(operation => new Operation(mustBeOperationProperties(operation)))
      });
    }
    if (opt_initialProperties.parameters !== undefined) { // if the parameters list is set
      if (!(opt_initialProperties.parameters instanceof Array))
        throw new TypeError('"initialProperties.parameters" isn\'t an Array instance');
      // generate and store the parameters list
      this.parameters_ = opt_initialProperties.parameters.map(parameter => new Parameter(mustBeParameterProperties(parameter)));
    }
    if (opt_initialProperties.pattern !== undefined) { // if the LaTeX pattern is set
      if (typeof opt_initialProperties.pattern !== 'string')
        throw new TypeError('"initialProperties.pattern" isn\'t a string');
      // try to parse the pattern
      const patternComponents = opt_initialProperties.pattern.match(/([ \t]+|#\d+|[^ \t#]+)/g);
      if (!!patternComponents) { // if there is a non-trivial pattern

        // store the pattern components
        this.patternComponents_ = patternComponents.map((patternPart: string): string | undefined | number => {
          switch (patternPart[0]) {
            case ' ':
            case '\t': // if a space part
              return undefined; // undefined is a mark for spaces
            case '#': // if a parameter part
              let parameterIndex = Number(patternPart.substring(1)) - 1; // the index of a parameter
              if (!this.parameters_[parameterIndex])
                throw new TypeError(
                  '"initialProperties.pattern" contains the incorrect parameter number ' +
                  patternPart.substring(1)
                );
              return parameterIndex;
            default: // raw pattern part
              return patternPart;
          }
        });
      }
    }
    if (opt_initialProperties.html !== undefined) { // if the LaTeX pattern is set
      if (typeof opt_initialProperties.html !== 'string')
        throw new TypeError('"initialProperties.html" isn\'t a string');
      // store the pattern
      Object.defineProperty(this, 'html', {value: opt_initialProperties.html, enumerable: true});
    }
  };

  /**
   * Get the LaTeX operations that are performed after this symbol
   * @return {!Array.<!Operation>} the operation list
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  get operations(): Operation[] {
    return this.operations_.slice()
  }

  /**
   * Get the parameters description list
   * @return {!Array.<!Latex.Parameter>} the parameter list
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  get parameters(): Parameter[] {
    return this.parameters_.slice()
  }

  /**
   * Get the parameter description
   * @param {number} parameterIndex the index of the parameter
   * @return {?Latex.Parameter} the parameter or undefined if there is no parameter with such an index
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  parameter(parameterIndex: number): Parameter | undefined {
    return this.parameters_[parameterIndex] || undefined
  }

  /**
   * Get the pattern components
   * @return {!Array.<!Latex.Parameter>} the pattern component list
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  get patternComponents(): any[] {
    return mustNotBeUndefined(this.patternComponents_.slice())
  }


  /**
   * Get the pattern
   * @return {string} the LaTeX input pattern
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  get pattern() {
    return this.patternComponents_.map(patternComponent => {
      if (isNumber(patternComponent)) {
        return '#' + (patternComponent + 1);
      }
      switch (typeof patternComponent) {
        case 'string':
          return patternComponent;
        default:
          return ' ';
      }
    }).join('');
  }

  /**
   * Compare this symbol with the other one
   * @param {?Symbol} other the symbol to compare with
   * @return {boolean} true if the symbols are equal, false otherwise
   * @override
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  equals(other: any): boolean {
    if (!(other instanceof Symbol)) return false; // type test
    if (!super.equals(other)) return false; // superclass test

    if (this.operations_.length !== other.operations_.length) return false;
    // test all the operations

    if (!this.operations_.every((operation, iOperation) =>
        operation.equals(other.operations_[iOperation])))
      return false;

    if (this.parameters_.length !== other.parameters_.length) return false;
    // test all the parameters

    if (!this.parameters_.every((parameter, iParameter) =>
        parameter.equals(other.parameters_[iParameter])))
      return false;
    return this.html === other.html;
  }
}
;
Object.defineProperties(Symbol.prototype, { // make getters and setters enumerable
  operations: {enumerable: true},
  parameters: {enumerable: true},
  patternComponents: {enumerable: true},
  pattern: {enumerable: true}
});

Object.defineProperties(Symbol.prototype, { // default property values
  operations_: {value: [], enumerable: false, writable: true}, // empty operation list
  parameters_: {value: [], enumerable: false, writable: true}, // empty parameter list
  patternComponents_: {value: [], enumerable: false, writable: true}, // empty pattern
  html: {value: '', enumerable: true, writable: true} // empty HTML pattern
});


/**
 * LaTeX command properties
 * @interface CommandProperties
 * @extends SymbolProperties
 * @property {(string|undefined)} name - The command name (a sequence of letters and optional star)
 * @author Kirill Chuvilin <k.chuvilin@texnous.org>
 */
export interface CommandProperties extends SymbolProperties {
  name?: string;
}

export interface CommandAndPackage {
  command: Command;
  packageName: string;
}

/**
 * LaTeX command encapsulation
 * @class
 * @extends Symbol
 * @property {string} name - The command name (a sequence of letters and optional star)
 * @author Kirill Chuvilin <k.chuvilin@texnous.org>
 */
export class Command extends Symbol {
  name: string;


  /**
   * Constructor
   * @param {!CommandProperties=} opt_initialProperties the initial property values
   */
  constructor(opt_initialProperties: CommandProperties = {}) {
    super(opt_initialProperties); // the superclass constructor
    // do nothing if there are no initial properties
    if (opt_initialProperties === undefined) return;
    if (opt_initialProperties.name !== undefined) { // if the name is set
      if (typeof opt_initialProperties.name !== 'string')
        throw new TypeError('"initialProperties.name" isn\'t a string');
      // store the name
      Object.defineProperty(this, 'name', {value: opt_initialProperties.name});
    }
  };


  /**
   * Compare this command with the other one
   * @param {?Command} other the command to compare with
   * @return {boolean} true if the commands are equal, false otherwise
   * @override
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  equals(other: any) {
    if (!(other instanceof Command)) return false; // type test
    if (!super.equals(other)) return false; // superclass test
    return this.name === other.name;
  }
}
;
Object.defineProperties(Command.prototype, { // default property values
  name: {value: '', enumerable: true} // empty name
});
export function isCommand(c: any): c is Command {
  return c instanceof Command;
}
export function mustBeCommand(c: any): Command {
  if (!isCommand(c)) throw new Error();
  return c;
}


/**
 * LaTeX command properties
 * @interface EnvironmentProperties
 * @extends ItemProperties
 * @property {(string|undefined)} name - The command name (a sequence of letters and optional star)
 * @author Kirill Chuvilin <k.chuvilin@texnous.org>
 */
export interface EnvironmentProperties extends ItemProperties {
  name?: string;
}

export interface EnvironmentAndPackage {
  environment: Environment;
  packageName?: string;
}

/**
 * LaTeX environment encapsulation
 * @class
 * @extends Item
 * @property {string} name - The environment name (a sequence of letters and optional star)
 * @author Kirill Chuvilin <k.chuvilin@texnous.org>
 */
export class Environment extends Item {
  name: string;


  /**
   * Constructor
   * @param {!EnvironmentProperties=} opt_initialProperties the initial property values
   */
  constructor(opt_initialProperties: EnvironmentProperties = {}) {
    super(opt_initialProperties); // the superclass constructor
    // do nothing if there are no initial properties
    if (opt_initialProperties === undefined) return;
    if (opt_initialProperties.name !== undefined) { // if the name is set
      if (typeof opt_initialProperties.name !== 'string')
        throw new TypeError('"initialProperties.name" isn\'t a string');
      // store the name
      Object.defineProperty(this, 'name', {value: opt_initialProperties.name});
    }
  };


  /**
   * Compare this environment with the other one
   * @param {?Environment} other the environment to compare with
   * @return {boolean} true if the environments are equal, false otherwise
   * @override
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  equals(other: any) {
    if (!(other instanceof Environment)) return false; // type test
    if (!super.equals(other)) return false; // superclass test
    return this.name === other.name;
  }
}
;
Object.defineProperties(Environment.prototype, { // default property values
  name: {value: '', enumerable: true} // empty name
});
export function isEnvironment(x: any): x is Environment {
  return x instanceof Environment;
}