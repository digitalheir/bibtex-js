/**
 * @fileoverview General JavaScript util tests
 * This file is a part of TeXnous project.
 *
 * @copyright TeXnous project team (http://texnous.org) 2016
 * @license LGPL-3.0
 *
 * This unit test is free software; you can redistribute it and/or modify it under the terms of the
 * GNU Lesser General Public License as published by the Free Software Foundation; either version 3
 * of the License, or (at your option) any later version.
 *
 * This unit test is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License along with this unit
 * test; if not, write to the Free Software Foundation, Inc., 59 Temple Place - Suite 330, Boston,
 * MA 02111-1307, USA.
 */

'use strict';

var Utils = require('../../deploy/lib/Utils');


/**
 * JS object own properties updating tests
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */
module.exports['updateProperties'] = {
  'incorrect target': function (test) {
    test.throws(function () { Utils.updateProperties(undefined, undefined) }, '');
    test.throws(function () {
      //noinspection JSCheckFunctionSignatures
      Utils.updateProperties(null, undefined)
    }, '');
    test.throws(function () { Utils.updateProperties(1, undefined) }, '');
    test.done();
  },
  'incorrect properties': function (test) {
    test.throws(function () {
      //noinspection JSCheckFunctionSignatures
      Utils.updateProperties({}, null)
    }, '');
    test.throws(function () { Utils.updateProperties({}, 1) }, '');
    test.done();
  },
  'undefined properties': function (test) {
    var target = { a: 1, b: 2 };
    Utils.updateProperties(target, undefined);
    test.deepEqual(target, { a: 1, b: 2 });
    test.done();
  },
  'incorrect keys': function (test) {
    test.throws(function () {
      //noinspection JSCheckFunctionSignatures
      Utils.updateProperties({}, {}, null)
    }, '');
    test.throws(function () { Utils.updateProperties({}, {}, 1) }, '');
    test.done();
  },
  'undefined keys': function (test) {
    var target = { a: 1, b: 2 };
    var newTarget = {};
    Utils.updateProperties(newTarget, target);
    test.deepEqual(newTarget, target);
    Utils.updateProperties(target, {a: -1, c: 3, d: 4 });
    test.deepEqual(target, {a: -1, b: 2, c: 3, d: 4});
    test.done();
  },
  'array keys': function (test) {
    var target = { a: 1, b: 2 };
    Utils.updateProperties(target, {a: -1, c: 3, d: 4 }, ['a', 'd']);
    test.deepEqual(target, {a: -1, b: 2, d: 4});
    test.done();
  },
  'object keys': function (test) {
    var target = { a: 1, b: 2 };
    Utils.updateProperties(target, {a: -1, c: 3, d: 4 }, { b: 'a', c: 'c'});
    test.deepEqual(target, {a: 1, b: -1, c: 3 });
    test.done();
  }
};


/**
 * JS object own properties testing tests
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */
module.exports['testProperties'] = {
  'incorrect target': function (test) {
    test.throws(function () { Utils.testProperties(undefined, undefined) }, '');
    test.throws(function () {
      //noinspection JSCheckFunctionSignatures
      Utils.testProperties(null, undefined)
    }, '');
    test.throws(function () { Utils.testProperties(1, undefined) }, '');
    test.done();
  },
  'incorrect properties': function (test) {
    test.throws(function () {
      //noinspection JSCheckFunctionSignatures
      Utils.updateProperties({}, null)
    }, '');
    test.throws(function () { Utils.testProperties({}, 1) }, '');
    test.done();
  },
  'undefined properties': function (test) {
    var target = { a: 1, b: 2 };
    test.ok(Utils.testProperties(target, undefined));
    test.done();
  },
  'incorrect keys': function (test) {
    test.throws(function () {
      //noinspection JSCheckFunctionSignatures
      Utils.testProperties({}, {}, null)
    }, '');
    test.throws(function () { Utils.testProperties({}, {}, 1) }, '');
    test.done();
  },
  'undefined keys': function (test) {
    test.ok(Utils.testProperties({}, {}));
    test.ok(Utils.testProperties({ a: 1, b: 2 }, {}));
    test.ok(Utils.testProperties({ a: 1, b: 2 }, { a: 1 }));
    test.ok(Utils.testProperties({ a: 1, b: 2 }, { a: 1, b: 2 }));
    test.ok(!Utils.testProperties({ a: 1, b: 2 }, { a: 1, b: 2, c: 3 }));
    test.ok(!Utils.testProperties({ a: 1, b: 2 }, { b: 2, c: 3 }));
    test.done();
  },
  'array keys': function (test) {
    test.ok(Utils.testProperties({ a: 1, b: 2 }, { a: 1 }, ['a']));
    test.ok(Utils.testProperties({ a: 1, b: 2 }, { a: 1 }, ['b']));
    test.ok(Utils.testProperties({ a: 1, b: 2 }, { a: 1 }, ['a', 'c']));
    test.ok(Utils.testProperties({ a: 1, b: 2 }, { a: 1, c: 3 }, ['a']));
    test.ok(Utils.testProperties({ a: 1, b: 2 }, { a: 1, c: 3 }, ['b']));
    test.ok(!Utils.testProperties({ a: 1, b: 2 }, { a: 1, c: 3 }, ['c']));
    test.ok(!Utils.testProperties({ a: 1, b: 2 }, { a: 1, c: 3 }, ['a', 'c']));
    test.done();
  },
  'object keys': function (test) {
    test.ok(Utils.testProperties({ a: 1, b: 2 }, {a: 2, c: 1, d: 4 }, { a: 'c', b: 'a'}));
    test.ok(Utils.testProperties({ a: 1, b: 2 }, {a: 2, c: 1, d: 4 }, { a: 'c', b: 'a', c: 'b' }));
    test.ok(!Utils.testProperties({ a: 1, b: 2 }, {a: 2, c: 1, d: 4 }, { a: 'c', b: 'a', c: 'd' }));
    test.done();
  }
};
