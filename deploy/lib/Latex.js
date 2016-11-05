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
 * @namespace Latex
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = {};

/**
 * LaTeX lexeme
 * @enum {string}
 * @author Kirill Chuvilin <k.chuvilin@texnous.org>
 */
module.exports['Lexeme'] = {
  BINARY_OPERATOR: 'BINARY_OPERATOR', // mathematical binary operator
  BRACKETS: 'BRACKETS', // logical brackets
  CELL_SEPARATOR: 'CELL_SEPARATOR', // table cell separator
  CHAR: 'CHAR', // character
  DIGIT: 'DIGIT', // digit
  DIRECTIVE: 'DIRECTIVE', // LaTeX directive
  DISPLAY_EQUATION: 'DISPLAY_EQUATION', // mathematical equation for display mode
  FILE_PATH: 'FILE_PATH', // file system path
  FLOATING_BOX: 'FLOATING_BOX', // floating box
  HORIZONTAL_SKIP: 'HORIZONTAL_SKIP', // any type of horizontal skip but not space
  INLINE_EQUATION: 'INLINE_EQUATION', // mathematical equation for inline mode
  LABEL: 'LABEL', // label identifier
  LENGTH: 'LENGTH', // linear dimension
  LETTER: 'LETTER', // word letter
  LINE_BREAK: 'LINE_BREAK', // text line break
  LIST_ITEM: 'LIST_ITEM', // list item
  LIST: 'LIST', // list of items
  NUMBER: 'NUMBER', // sequence of digits
  PARAGRAPH_SEPARATOR: 'PARAGRAPH_SEPARATOR', // paragraph separator
  PICTURE: 'PICTURE', // picture
  POST_OPERATOR: 'POST_OPERATOR', // mathematical post-operator
  PRE_OPERATOR: 'PRE_OPERATOR', // mathematical pre-operator
  RAW: 'RAW', // unprocessable or raw sources
  SPACE: 'SPACE', // any type of space equivalent
  SUBSCRIPT: 'SUBSCRIPT', // subscript text
  SUPERSCRIPT: 'SUPERSCRIPT', // subscript text
  TABLE: 'TABLE', // table
  TABULAR_PARAMETERS: 'TABULAR_PARAMETERS', // LaTeX tabular parameters
  TAG: 'TAG', // formatting tag
  UNKNOWN: 'UNKNOWN', // unrecognized element
  VERTICAL_SKIP: 'VERTICAL_SKIP', // any type of vertical skip
  WORD: 'WORD', // sequence of letters
  WRAPPER: 'WRAPPER' // wrapper for something
};

/**
 * LaTeX modes
 * @enum {string}
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */
var Mode = module.exports['Mode'] = {
  LIST: 'LIST', // list of items
  MATH: 'MATH', // mathematical expressionLatex
  PICTURE: 'PICTURE', // picture
  TABLE: 'TABLE', // LaTeX tabular
  TEXT: 'TEXT', // general text
  VERTICAL: 'VERTICAL' // vertical spacing
};

/**
 * LaTeX state encapsulation
 * @class
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */
var State = module.exports['State'] = function () {
  //noinspection JSUnusedGlobalSymbols
  /**
   * Constructor
   * @param {!Object.<Mode,boolean>=} opt_initialModeStates the initial mode states
   * @constructor
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  function _class(opt_initialModeStates) {
    _classCallCheck(this, _class);

    Object.defineProperty(this, 'modeStates_', { value: {}, enumerable: false });
    //noinspection JSUnresolvedVariable
    this.modeStates_[Mode.LIST] = false;
    //noinspection JSUnresolvedVariable
    this.modeStates_[Mode.MATH] = false;
    //noinspection JSUnresolvedVariable
    this.modeStates_[Mode.PICTURE] = false;
    //noinspection JSUnresolvedVariable
    this.modeStates_[Mode.TABLE] = false;
    //noinspection JSUnresolvedVariable
    this.modeStates_[Mode.TEXT] = true;
    //noinspection JSUnresolvedVariable
    this.modeStates_[Mode.VERTICAL] = false;
    // update the mode states
    if (opt_initialModeStates !== undefined) this.update(opt_initialModeStates);
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Create a copy of this state.
   * @return {!State} the created copy
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */


  _createClass(_class, [{
    key: 'copy',
    value: function copy() {
      //noinspection JSValidateTypes,JSUnresolvedVariable
      return new State(this.modeStates_);
    }

    /**
     * Update the state with states for modes
     * @param {!Object.<Mode,boolean>} modeStates the states for modes
     * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
     */

  }, {
    key: 'update',
    value: function update(modeStates) {
      if (!(modeStates instanceof Object)) throw new TypeError('"modeStates" isn\'t an Object instance');
      for (var modeKey in modeStates) {
        // for all the given modes
        //noinspection JSUnfilteredForInLoop
        var mode = Mode[modeKey]; // verify the mode key
        if (mode === undefined) // if the mode is unknown
          throw new TypeError('"modeStates[' + modeKey + ']" isn\'t a Latex.Mode option');
        //noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
        this.modeStates_[mode] = modeStates[modeKey]; // store the mode state
      }
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Test the state with mode states
     * @param {!Object.<Mode,boolean>} modeStates the states for modes
     * @return {boolean} true if the state fits the modes, false otherwise
     * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
     */

  }, {
    key: 'test',
    value: function test(modeStates) {
      if (!(modeStates instanceof Object)) throw new TypeError('"modeStates" isn\'t an Object instance');
      for (var modeKey in modeStates) {
        // for all the given modes
        //noinspection JSUnfilteredForInLoop
        var mode = Mode[modeKey]; // verify the mode key
        if (mode === undefined) // if the mode is unknown
          throw new TypeError('"modeStates[' + modeKey + ']" isn\'t a Latex.Mode option');
        // exit if the mode has different states
        //noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
        if (this.modeStates_[mode] !== modeStates[modeKey]) return false;
      }
      return true;
    }
  }]);

  return _class;
}();

/**
 * LaTeX directive
 * @enum {string}
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */
var Directive = module.exports['Directive'] = {
  BEGIN: 'BEGIN', // begin something
  END: 'END' // end something
};

/**
 * Group operand for directives
 * @const {string}
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */
var GROUP = module.exports['GROUP'] = 'GROUP';

/**
 * LaTeX operation properties
 * @interface OperationProperties
 * @property {Directive} directive - The directive or null if there is no a directive
 * @property {Mode|GROUP} operand - The operand or null if there is no an operand
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */

/**
 * LaTeX operation encapsulation
 * @class
 * @property {Directive} directive - The directive or null if there is no a directive
 * @property {Mode|GROUP} operand - The operand or null if there is no an operand
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */
var Operation = module.exports['Operation'] = function () {
  //noinspection JSUnusedGlobalSymbols
  /**
   * Constructor
   * @param {!OperationProperties=} opt_initialProperties the initial property values
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  function _class2(opt_initialProperties) {
    _classCallCheck(this, _class2);

    // do nothing if the initial properties aren't defined
    if (opt_initialProperties === undefined) return;
    if (!(opt_initialProperties instanceof Object)) throw new TypeError('"initialProperties" isn\'t an Object instance');
    var directive = Directive[opt_initialProperties.directive]; // validate the directive
    if (!directive) throw new TypeError('"initialProperties.directive" isn\'t an Latex.Directive option');
    Object.defineProperty(this, 'directive', { value: directive, enumerable: true });
    switch (opt_initialProperties.operand) {
      case GROUP:
        // if operand is a group
        // store the operand
        Object.defineProperty(this, 'operand', { value: GROUP, enumerable: true });
        break;
      default:
        var mode = Mode[opt_initialProperties.operand]; // validate the operand as a mode
        if (!mode) throw new TypeError('"initialProperties.operand" isn\'t an Latex.Mode option');
        // store the operand
        Object.defineProperty(this, 'operand', { value: mode, enumerable: true });
    }
  }

  _createClass(_class2, [{
    key: 'equals',


    //noinspection JSUnusedGlobalSymbols
    /**
     * Compare this operation with the other
     * @param {!Operation} other the operation to compare with
     * @return {boolean} True if the operations are equal false otherwise
     * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
     */
    value: function equals(other) {
      if (!(other instanceof Operation)) return false; // type test
      return this.directive === other.directive && this.operand === other.operand;
    }
  }]);

  return _class2;
}();
//# sourceMappingURL=Latex.js.map