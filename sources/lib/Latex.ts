/**
 * @fileoverview General LaTeX definitions
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



/**
 * LaTeX lexeme
 * @enum {string}
 * @author Kirill Chuvilin <k.chuvilin@texnous.org>
 */
export const Lexeme = {
  BINARY_OPERATOR:     'BINARY_OPERATOR',     // mathematical binary operator
  BRACKETS:            'BRACKETS',            // logical brackets
  CELL_SEPARATOR:      'CELL_SEPARATOR',      // table cell separator
  CHAR:                'CHAR',                // character
  DIGIT:               'DIGIT',               // digit
  DIRECTIVE:           'DIRECTIVE',           // LaTeX directive
  DISPLAY_EQUATION:    'DISPLAY_EQUATION',    // mathematical equation for display mode
  FILE_PATH:           'FILE_PATH',           // file system path
  FLOATING_BOX:        'FLOATING_BOX',        // floating box
  HORIZONTAL_SKIP:     'HORIZONTAL_SKIP',     // any type of horizontal skip but not space
  INLINE_EQUATION:     'INLINE_EQUATION',     // mathematical equation for inline mode
  LABEL:               'LABEL',               // label identifier
  LENGTH:              'LENGTH',              // linear dimension
  LETTER:              'LETTER',              // word letter
  LINE_BREAK:          'LINE_BREAK',          // text line break
  LIST_ITEM:           'LIST_ITEM',           // list item
  LIST:                'LIST',                // list of items
  NUMBER:              'NUMBER',              // sequence of digits
  PARAGRAPH_SEPARATOR: 'PARAGRAPH_SEPARATOR', // paragraph separator
  PICTURE:             'PICTURE',             // picture
  POST_OPERATOR:       'POST_OPERATOR',       // mathematical post-operator
  PRE_OPERATOR:        'PRE_OPERATOR',        // mathematical pre-operator
  RAW:                 'RAW',                 // unprocessable or raw sources
  SPACE:               'SPACE',               // any type of space equivalent
  SUBSCRIPT:           'SUBSCRIPT',           // subscript text
  SUPERSCRIPT:         'SUPERSCRIPT',         // subscript text
  TABLE:               'TABLE',               // table
  TABULAR_PARAMETERS:  'TABULAR_PARAMETERS',  // LaTeX tabular parameters
  TAG:                 'TAG',                 // formatting tag
  UNKNOWN:             'UNKNOWN',             // unrecognized element
  VERTICAL_SKIP:       'VERTICAL_SKIP',       // any type of vertical skip
  WORD:                'WORD',                // sequence of letters
  WRAPPER:             'WRAPPER'              // wrapper for something
};
export type Lexeme = keyof typeof Lexeme;

/**
 * LaTeX modes
 * @enum {string}
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */
export const modes = {
  LIST:     'LIST',    // list of items
  MATH:     'MATH',    // mathematical expressionLatex
  PICTURE:  'PICTURE', // picture
  TABLE:    'TABLE',   // LaTeX tabular
  TEXT:     'TEXT',    // general text
  VERTICAL: 'VERTICAL' // vertical spacing
};

export type Mode = keyof typeof modes;

export function isMode(x: any): x is Mode {
  return modes.hasOwnProperty(x);
}

export function mustBeMode(x: any): Mode {
  if(!isMode(x)) throw new Error();
  return x;
}

export type ModeStates = {[mode: string]: boolean};
/**
 * LaTeX state encapsulation
 * @class
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */
export class State {
  private modeStates_: ModeStates;


  /**
   * Constructor
   * @param {!Object.<Mode,boolean>=} opt_initialModeStates the initial mode states
   * @constructor
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  constructor(opt_initialModeStates: ModeStates = {}) {
    Object.defineProperty(this, 'modeStates_', { value: { }, enumerable: false });

    this.modeStates_[modes.LIST]     = false;

    this.modeStates_[modes.MATH]     = false;

    this.modeStates_[modes.PICTURE]  = false;

    this.modeStates_[modes.TABLE]    = false;

    this.modeStates_[modes.TEXT]     = true;
    //noinspection JSUnresolvedVariable
    this.modeStates_[modes.VERTICAL] = false;
    // update the mode states
    if (opt_initialModeStates !== undefined) this.update(opt_initialModeStates);
  }



  /**
   * Create a copy of this state.
   * @return {!State} the created copy
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  copy() {
    //noinspection JSValidateTypes,JSUnresolvedVariable
    return new State(this.modeStates_);
  }


  /**
   * Update the state with states for modes
   * @param {!Object.<Mode,boolean>} modeStates the states for modes
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  update(modeStates: ModeStates) {
    if (!(modeStates instanceof Object))
      throw new TypeError('"modeStates" isn\'t an Object instance');
    for (let modeKey in modeStates) { // for all the given modes
      //noinspection JSUnfilteredForInLoop
      let mode = modes[mustBeMode(modeKey)]; // verify the mode key
      if (mode === undefined) // if the mode is unknown
        throw new TypeError('"modeStates[' + modeKey + ']" isn\'t a Latex.Mode option');
      //noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
      this.modeStates_[mode] = modeStates[modeKey]; // store the mode state
    }
  }



  /**
   * Test the state with mode states
   * @param {!Object.<Mode,boolean>} modeStates the states for modes
   * @return {boolean} true if the state fits the modes, false otherwise
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  test(modeStates: ModeStates) {
    if (!(modeStates instanceof Object))
      throw new TypeError('"modeStates" isn\'t an Object instance');
    for (let modeKey in modeStates) { // for all the given modes
      //noinspection JSUnfilteredForInLoop
      let mode = modes[mustBeMode(modeKey)]; // verify the mode key
      if (mode === undefined) // if the mode is unknown
        throw new TypeError('"modeStates[' + modeKey + ']" isn\'t a Latex.Mode option');
      // exit if the mode has different states
      //noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
      if (this.modeStates_[mode] !== modeStates[modeKey]) return false;
    }
    return true;
  }
};



/**
 * LaTeX directive
 * @enum {string}
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */
export const Directive = {
  BEGIN: 'BEGIN', // begin something
  END:   'END'    // end something
};
export type Directive = keyof typeof Directive;


/**
 * Group operand for directives
 * @const {string}
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */
export const GROUP = 'GROUP';
export type GROUP = 'GROUP';



/**
 * LaTeX operation properties
 * @interface OperationProperties
 * @property {Directive} directive - The directive or null if there is no a directive
 * @property {Mode|GROUP} operand - The operand or null if there is no an operand
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */
export interface OperationProperties {
  directive: Directive;
  operand: Mode|GROUP;
}
export function isOperationProperties(x: any): x is OperationProperties {
  return x && x.hasOwnProperty("directive") && x.hasOwnProperty("operand");
}

export function mustBeOperationProperties(x: any): OperationProperties {
  if(!isOperationProperties(x)) throw new Error();
  return x;
}

/**
 * LaTeX operation encapsulation
 * @class
 * @property {Directive} directive - The directive or null if there is no a directive
 * @property {Mode|GROUP} operand - The operand or null if there is no an operand
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */
export class Operation {
  directive: Directive;
  operand: Mode | GROUP;


  /**
   * Constructor
   * @param {!OperationProperties=} opt_initialProperties the initial property values
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  constructor(opt_initialProperties?: OperationProperties) {
    // do nothing if the initial properties aren't defined
    if (opt_initialProperties === undefined) return;
    if (!(opt_initialProperties instanceof Object))
      throw new TypeError('"initialProperties" isn\'t an Object instance');
    let directive = Directive[opt_initialProperties.directive]; // validate the directive
    if (!directive)
      throw new TypeError('"initialProperties.directive" isn\'t an Latex.Directive option');
    Object.defineProperty(this, 'directive', { value: directive, enumerable: true });
    switch (opt_initialProperties.operand) {
    case GROUP: // if operand is a group
      // store the operand
      Object.defineProperty(this, 'operand', { value: GROUP, enumerable: true });
      break;
    default:
      let mode = modes[opt_initialProperties.operand]; // validate the operand as a mode
      if (!mode) throw new TypeError('"initialProperties.operand" isn\'t an Latex.Mode option');
      // store the operand
      Object.defineProperty(this, 'operand', { value: mode, enumerable: true });
    }
  };


  /**
   * Compare this operation with the other
   * @param {!Operation} other the operation to compare with
   * @return {boolean} True if the operations are equal false otherwise
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  equals(other: any) {
    if (!(other instanceof Operation)) return false; // type test
    return this.directive === other.directive && this.operand === other.operand;
  };
};