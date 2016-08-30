/**
 * @fileoverview General JavaScript utils
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


/**
 * Extend a class with another one.
 * @param {!function} target the class to extend
 * @param {!function=} opt_superclass the class to extend with
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */
module.exports['extend'] = function (target, opt_superclass) {
  if (typeof target !== 'function') throw new SyntaxError('target isn\'t a function');
  if (opt_superclass !== undefined) { // if the superclass is defined
    if (typeof opt_superclass !== 'function') throw new SyntaxError('superclass isn\'t a function');
    target['prototype'] = Object.create(opt_superclass['prototype']);
    target['prototype'].constructor = target; // return the original constructor
    target.superclass = opt_superclass['prototype'];
  }
};


/**
 * Update object properties by property values
 * @param {!Object} target the object to copy properties to
 * @param {!Object} values the object with property values (undefined values will be skipped)
 * @param {(!Object.<string,string>|!Array.<string>)=} opt_keys
 *        list of keys or map of the target keys to the property names, all the enumerable
 *        properties will be used if undefined
 * @param {{writable:boolean,enumerable:boolean,configurable:boolean}=} opt_attributes
 *        property attributes, { writable: true, enumerable: true, configurable: true } by default
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */
module.exports['updateProperties'] = function (target, values, opt_keys, opt_attributes) {
  if (!(target instanceof Object)) throw new TypeError('"target" isn\'t an Object instance');
  if (values === undefined) return; // do noting is the sources is undefined
  if (!(values instanceof Object)) throw new TypeError('"properties" isn\'t an Object instance');
  if (opt_attributes === undefined) {
    opt_attributes = { writable: true, enumerable: true, configurable: true };
  } else if (!(opt_attributes instanceof Object)) {
    throw new TypeError('"attributes" isn\'t an Object instance')
  }
  if (opt_keys === undefined) { // if the key map isn't defined
    for (let key in values) { // for all the enumerable properties
      //noinspection JSUnfilteredForInLoop
      if (values[key] !== undefined) {
        //noinspection JSUnfilteredForInLoop
        Object.defineProperty(target, key, // update the property
          // using the defined value
          Object.create(opt_attributes, { value: { value: values[key] } })
        );
      }
    }
  } else if (opt_keys instanceof Array) { // if the list of the keys is defined
    opt_keys.forEach(key => { if (values[key] !== undefined) {
      Object.defineProperty(target, key, // update the property
        Object.create(opt_attributes, {value: {value: values[key]}}) // using the defined value
      );
    }});
  } else if (opt_keys instanceof Object) { // if the map of the keys is defined
    for (let targetKey in opt_keys) { // for all the target keys
      //noinspection JSUnfilteredForInLoop
      let key = opt_keys[targetKey]; // the sources key
      if (values[key] !== undefined)
        //noinspection JSUnfilteredForInLoop
        Object.defineProperty(target, targetKey, // update the property
          // using the defined value
          Object.create(opt_attributes, { value: { value: values[key] } })
        );
    }
  } else { // if "keys" has unsupported value
    throw new TypeError('"keys" isn\'t an Object instance');
  }
};


/**
 * Test object properties with property values (strict comparing is used)
 * @param {!Object} target the object with properties to test
 * @param {!Object} values the object with property values (undefined values will be skipped)
 * @param {(!Object.<string,string>|!Array.<string>)=} opt_keys
 *        list of keys or map of the target keys to the property names, all the enumerable
 *        properties will be used if undefined
 * @param {boolean=true} opt_skipUndefined true to skip keys with undefined values, false otherwise
 * @return {boolean} true if all the defined properties are the same false otherwise
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */
module.exports['testProperties'] = function (target, values, opt_keys, opt_skipUndefined) {
  if (!(target instanceof Object)) throw new TypeError('"target" isn\'t an Object instance');
  if (values === undefined) return true; // do noting is the sources is undefined
  if (!(values instanceof Object)) throw new TypeError('"properties" isn\'t an Object instance');
  if (opt_skipUndefined === undefined) opt_skipUndefined = true; // skip undefined by default
  if (opt_keys === undefined) { // if the key map isn't defined
    for (let key in values) { // for all the enumerable properties
      //noinspection JSUnfilteredForInLoop
      if (target[key] !== values[key] && !(values[key] === undefined && opt_skipUndefined))
        return false; // false if any value is different
    }
  } else if (opt_keys instanceof Array) { // if the list of the keys is defined
    return opt_keys.every(key => {
      return target[key] === values[key] || (values[key] === undefined && opt_skipUndefined);
    });
  } else if (opt_keys instanceof Object) { // if the map of the keys is defined
    for (let targetKey in opt_keys) { // for all the target keys
      //noinspection JSUnfilteredForInLoop
      let key = opt_keys[targetKey]; // the sources key
      //noinspection JSUnfilteredForInLoop
      if (target[targetKey] !== values[key] && !(values[key] === undefined && opt_skipUndefined))
        return false; // false if any value is different
    }
  } else { // if "keys" has unsupported value
    throw new TypeError('"keys" isn\'t an Object instance');
  }
  return true; // return true if all the defined properties are the same
};
