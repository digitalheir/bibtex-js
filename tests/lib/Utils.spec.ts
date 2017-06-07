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

import {expect} from "chai";

import * as Utils from "../../sources/lib/Utils";
import {TargetObject} from "../../sources/lib/Utils";

/**
 * JS object own properties updating tests
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */
describe("updateProperties", () => {
  it("incorrect target", function () {
    // expect(function () { Utils.updateProperties(undefined, undefined) }).to.throw;
    // expect(function () { Utils.updateProperties(undefined, undefined) }).to.throw;
    // expect(function () { Utils.updateProperties(1, undefined) }).to.throw;
  });
  it("incorrect properties", function () {
    // test.throws(function () {
    //   //noinspection JSCheckFunctionSignatures
    //   Utils.updateProperties({}, undefined)
    // }, '');
    // test.throws(function () { Utils.updateProperties({}, 1) }, '');
    // test.done();
  });
  it("undefined properties", function () {
    // var target = { a: 1, b: 2 };
    // Utils.updateProperties(target, undefined);
    // test.deepEqual(target, { a: 1, b: 2 });
  });
  it("incorrect keys", function () {
    expect(function () {
      Utils.updateProperties({}, {}, undefined)
    }, '').to.throw;
    // expect(function () { Utils.updateProperties({}, {}, 1) }, '').to.throw;
  });
  it("undefined keys", function () {
    const target = {a: 1, b: 2};
    const newTarget: TargetObject = {};
    Utils.updateProperties(newTarget, target);
    expect(newTarget).to.deep.equal(target);
    Utils.updateProperties(target, {a: -1, c: 3, d: 4 });
    expect(target).to.deep.equal({a: -1, b: 2, c: 3, d: 4});
  });
  it("array keys", function () {
    const target = {a: 1, b: 2};
    Utils.updateProperties(target, {a: -1, c: 3, d: 4 }, ['a', 'd']);
    expect(target).to.deep.equal({a: -1, b: 2, d: 4});
  });
  it("object keys", function () {
    const target = {a: 1, b: 2};
    Utils.updateProperties(target, {a: -1, c: 3, d: 4 }, { b: 'a', c: 'c'});
    expect(target).to.deep.equal({a: 1, b: -1, c: 3 });
  });
});


/**
 * JS object own properties testing tests
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */
describe("testProperties", () => {
  it("incorrect target", function () {
    // test.throws(function () { Utils.testProperties(undefined, undefined) }, '');
    // test.throws(function () { Utils.testProperties(undefined, undefined)}, '');
    // test.throws(function () { Utils.testProperties(1, undefined) }, '');
  });
  it("incorrect properties", function () {
    expect(function () {
      Utils.updateProperties({}, undefined)
    }, '').to.throw;
    // test.throws(function () { Utils.testProperties({}, 1) }, '');
  });
  it("undefined properties", function () {
    const target = {a: 1, b: 2};
    expect(Utils.testProperties(target, undefined)).to.equal(true);
  });
  it("incorrect keys", function () {
    expect(function () {
      Utils.testProperties({}, {}, undefined)
    }, '').to.throw;
    // test.throws(function () { Utils.testProperties({}, {}, 1) }, '');
  });
  it("undefined keys", function () {
    expect(Utils.testProperties({}, {})).to.equal(true);
    expect(Utils.testProperties({ a: 1, b: 2 }, {})).to.equal(true);
    expect(Utils.testProperties({ a: 1, b: 2 }, { a: 1 })).to.equal(true);
    expect(Utils.testProperties({ a: 1, b: 2 }, { a: 1, b: 2 })).to.equal(true);
    expect(Utils.testProperties({ a: 1, b: 2 }, { a: 1, b: 2, c: 3 })).to.equal(false);
    expect(Utils.testProperties({ a: 1, b: 2 }, { b: 2, c: 3 })).to.equal(false);
  });
  it("array keys", function () {
    expect(Utils.testProperties({ a: 1, b: 2 }, { a: 1 }, ['a'])).to.equal(true);
    expect(Utils.testProperties({ a: 1, b: 2 }, { a: 1 }, ['b'])).to.equal(true);
    expect(Utils.testProperties({ a: 1, b: 2 }, { a: 1 }, ['a', 'c'])).to.equal(true);
    expect(Utils.testProperties({ a: 1, b: 2 }, { a: 1, c: 3 }, ['a'])).to.equal(true);
    expect(Utils.testProperties({ a: 1, b: 2 }, { a: 1, c: 3 }, ['b'])).to.equal(true);
    expect(Utils.testProperties({ a: 1, b: 2 }, { a: 1, c: 3 }, ['c'])).to.equal(false);
    expect(Utils.testProperties({ a: 1, b: 2 }, { a: 1, c: 3 }, ['a', 'c'])).to.equal(false);
  });
  it("object keys", function () {
    expect(Utils.testProperties({ a: 1, b: 2 }, {a: 2, c: 1, d: 4 }, { a: 'c', b: 'a'})).to.equal(true);
    expect(Utils.testProperties({ a: 1, b: 2 }, {a: 2, c: 1, d: 4 }, { a: 'c', b: 'a', c: 'b' })).to.equal(true);
    expect(Utils.testProperties({ a: 1, b: 2 }, {a: 2, c: 1, d: 4 }, { a: 'c', b: 'a', c: 'd' })).to.equal(false);
  })
});
