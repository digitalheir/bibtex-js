/**
 * @fileoverview Syntax tree structure elements
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
 * Syntax tree structure
 * @class
 * @property {!Node} rootNode - The root node
 * @property {string} source - The source text
 * @author Kirill Chuvilin <k.chuvilin@texnous.org>
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SyntaxTree = module.exports = function () {
  //noinspection JSUnusedGlobalSymbols
  /**
   * Constructor
   * @param {!Node} rootNode the root node (must have no parent and no tree)
   * @param {string} source the sources text that has this syntax tree
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  function _class(rootNode, source) {
    _classCallCheck(this, _class);

    if (!(rootNode instanceof Node)) throw new TypeError('"rootNode" isn\'t a SyntaxTree.Node instance');
    if (rootNode.parentNode) throw new TypeError('"rootNode" has a parent node');
    if (rootNode.tree) throw new TypeError('"rootNode" is a tree root');
    if (typeof source !== 'string') throw new TypeError('"sources" isn\'t a string');
    // store the root node
    Object.defineProperty(this, 'rootNode', { value: rootNode, enumerable: true });
    Object.defineProperty(this, 'source', { value: source, enumerable: true }); // store the sources
    // update the root node tree
    Object.defineProperty(rootNode, 'tree', { value: this, enumerable: true });
  }

  return _class;
}();

/**
 * Syntax tree node properties
 * @interface NodeProperties
 * @property {(?Node|undefined)} parentNode - The parent node or null if there is no parent
 * @property {(!Array.<Node>|undefined)} childNodes - The list of the child nodes
 * @exports
 * @author Kirill Chuvilin <k.chuvilin@texnous.org>
 */

/**
 * Syntax tree node structure
 * @class
 * @property {?SyntaxTree} tree - The tree or null if this node isn't in any tree
 * @property {?Node} parentNode - The parent node or null if there is no parent
 * @property {!Array.<Node>} childNodes - The child node list
 * @property {number} subtreeSize - The size of the subtree formed by this node
 * @author Kirill Chuvilin <k.chuvilin@texnous.org>
 */
var Node = module.exports['Node'] = function () {
  //noinspection JSUnusedGlobalSymbols
  /**
   * Constructor
   * @param {!NodeProperties=} opt_initialProperties the initial property values
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */
  function _class2(opt_initialProperties) {
    _classCallCheck(this, _class2);

    if (opt_initialProperties !== undefined) {
      // if the initial properties are defined
      if (!(opt_initialProperties instanceof Object)) throw new TypeError('initialProperties isn\'t an Object instance');
      if (opt_initialProperties.childNodes !== undefined) {
        // if the child node list is set
        if (!(opt_initialProperties.childNodes instanceof Array)) throw new TypeError('initialProperties.childNodes isn\'t an Array instance');
        opt_initialProperties.childNodes.forEach(this.insertChildSubtree, this);
      }
      if (opt_initialProperties.parentNode !== undefined) {
        // if the parent node is set
        if (opt_initialProperties.parentNode instanceof Node) {
          //noinspection JSUnresolvedFunction
          opt_initialProperties.parentNode.insertChildSubtree(this);
        } else {
          throw new TypeError('initialProperties.parentNode isn\'t a SyntaxTree.Node instance');
        }
      }
    }
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Get the child nodes
   * @return {!Array.<Node>} the child node list
   * @author Kirill Chuvilin <k.chuvilin@texnous.org>
   */


  _createClass(_class2, [{
    key: 'childNode',


    //noinspection JSUnusedGlobalSymbols
    /**
     * Get the child node
     * @param {(!Node|number)} node the child node or its child index
     * @return {?Node} the child node or null of there is no such a child node
     * @author Kirill Chuvilin <k.chuvilin@texnous.org>
     */
    value: function childNode(node) {
      if (typeof node === 'number') // if the node child index is given
        return this.childNodes_[node] || null;
      if (node instanceof Node) // if the child node is given
        return node.parentNode === this ? node : null;
      throw new TypeError('"node" is neither a number nor a SyntaxTree.Node instance');
    }

    /**
     * Get the child node index
     * @param {(!Node|number)} node the child node or its child index
     * @return {(number|null)} the child node or null of there is no such a child node
     * @author Kirill Chuvilin <k.chuvilin@texnous.org>
     */

  }, {
    key: 'childIndex',
    value: function childIndex(node) {
      if (typeof node === 'number') // if the node child index is given
        return this.childNodes_[node] ? node : null;
      if (node instanceof Node) // if the child node is given
        return node.parentNode === this ? this.childNodes_.indexOf(node) : null;
      throw new TypeError('"node" is neither a number nor a SyntaxTree.Node instance');
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Insert a node to this child node list
     * @param {!Node} node the node to insert (must have no parent and no child nodes)
     * @param {number=undefined} childIndex
     *        the position of the node for this child node list, the last by default
     * @param {number=0} childNodesToCover
     *        the number of this child nodes to become the child nodes of the new node
     * @return {?Node} the inserted node or null if cannot insert
     * @author Kirill Chuvilin <k.chuvilin@texnous.org>
     */

  }, {
    key: 'insertChildNode',
    value: function insertChildNode(node, childIndex, childNodesToCover) {
      if (!(node instanceof SyntaxTree.Node)) throw new TypeError('"node" isn\'t a SyntaxTree.Node instance');
      if (node.parentNode) throw new TypeError('"node" has a parent');
      if (node.tree) throw new TypeError('"node" is a tree root');
      //noinspection JSUnresolvedVariable
      if (!(this instanceof node.parentNodeClass_)) throw new TypeError('"this" isn\'t a suitable class instance');
      //noinspection JSUnresolvedVariable
      if (node.childNodes_.length) throw new TypeError('"node" has child nodes');
      if (!this.hasOwnProperty('childNodes_')) // if there was no child nodes
        // init the property
        Object.defineProperty(this, 'childNodes_', { value: [], configurable: true });
      // use the last position by default
      if (childIndex === undefined) childIndex = this.childNodes_.length;
      // do not cover any child nodes by default
      if (childNodesToCover === undefined) childNodesToCover = 0;
      // replace the child nodes by the new node
      var nodeChildNodes = this.childNodes_.splice(childIndex, childNodesToCover, node);
      // update the size of the subtree formed by this node
      Object.defineProperty(this, 'subtreeSize', {
        value: this.subtreeSize + 1,
        enumerable: true,
        configurable: true
      });
      // for all the parent nodes
      for (var parentNode = this.parentNode; parentNode; parentNode = parentNode.parentNode) {
        // update the size of the subtree formed by the parent node
        Object.defineProperty(parentNode, 'subtreeSize', { value: parentNode.subtreeSize + 1 });
      }
      // update the parent node of the new node
      Object.defineProperty(node, 'parentNode', {
        value: this,
        enumerable: true,
        configurable: true
      });
      if (nodeChildNodes.length) {
        // if there are child nodes for the new node
        // store the child nodes
        Object.defineProperty(node, 'childNodes_', { value: nodeChildNodes, configurable: true });
        var subtreeSize = 1; // initiate the size of the subtree formed by the new node
        // for all the child nodes of the new node
        nodeChildNodes.forEach(function (nodeChildNode) {
          subtreeSize += nodeChildNode.subtreeSize;
        });
        // store the subtree size
        Object.defineProperty(node, 'subtreeSize', {
          value: subtreeSize,
          enumerable: true,
          configurable: true
        });
      }
      return node;
    }

    /**
     * Insert a subtree to this child node list.
     * @param {!Node} node the subtree to insert root node (must have no parent)
     * @param {number=} childIndex
     *        the position of the subtree root for this child node list, the last by default
     * @author Kirill Chuvilin <k.chuvilin@texnous.org>
     */

  }, {
    key: 'insertChildSubtree',
    value: function insertChildSubtree(node, childIndex) {
      if (!(node instanceof SyntaxTree.Node)) throw new TypeError('"node" isn\'t a SyntaxTree.Node instance');
      if (node.parentNode) throw new TypeError('"node" has a parent');
      if (node.tree) throw new TypeError('"node" is a tree root');
      //noinspection JSUnresolvedVariable
      if (!(this instanceof node.parentNodeClass_)) throw new TypeError('"this" isn\'t a suitable class instance');
      // init child nodes property if not exists
      if (!this.hasOwnProperty('childNodes_')) // if there was no child nodes
        // init the property
        Object.defineProperty(this, 'childNodes_', { value: [], configurable: true });
      // use the last position by default
      if (childIndex === undefined) childIndex = this.childNodes_.length;
      this.childNodes_.splice(childIndex, 0, node); // insert the new node to the child list
      var nodeSubtreeSize = node.subtreeSize; // the size of the subtree formed by the node
      // update the size of the subtree formed by this node
      Object.defineProperty(this, 'subtreeSize', {
        value: this.subtreeSize + nodeSubtreeSize, enumerable: true, configurable: true
      });
      // for all the parent nodes
      for (var parentNode = this.parentNode; parentNode; parentNode = parentNode.parentNode) {
        // update the size of the subtree formed by the parent node
        Object.defineProperty(parentNode, 'subtreeSize', {
          value: parentNode.subtreeSize + nodeSubtreeSize
        });
      }
      // update the parent node of the new node
      Object.defineProperty(node, 'parentNode', {
        value: this,
        enumerable: true,
        configurable: true
      });
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Remove a child node of this node. All its child nodes become the child nodes of this node
     * @param {(!Node|number)} node the subtree root or its child index
     * @return {?Node} the removed node or null of there is no such a child node
     * @author Kirill Chuvilin <k.chuvilin@texnous.org>
     */

  }, {
    key: 'removeChildNode',
    value: function removeChildNode(node) {
      var nodeChildIndex = this.childIndex(node); // the child index of the node
      if (nodeChildIndex === null) return null; // return if there is no such a child
      node = this.childNodes_[nodeChildIndex]; // the child node to remove
      // replace the node with its child nodes at this child node list
      //noinspection JSUnresolvedVariable
      Array.prototype.splice.apply(this.childNodes_, [nodeChildIndex, 1].concat(node.childNodes_));
      if (this.childNodes_.length) {
        // if there are child nodes
        // update this node subtree size
        Object.defineProperty(this, 'subtreeSize', { value: this.subtreeSize - 1 });
      } else {
        // if there are no child nodes
        delete this.childNodes_; // this node has no child nodes anymore
        delete this.subtreeSize; // this node has node subtree anymore
      }
      // for all the parent nodes
      for (var parentNode = this.parentNode; parentNode; parentNode = parentNode.parentNode) {
        // update the size of the subtree formed by the parent node
        Object.defineProperty(parentNode, 'subtreeSize', { value: parentNode.subtreeSize - 1 });
      }
      delete node.parentNode; // the node has no parent node anymore
      //noinspection JSUnresolvedVariable
      delete node.childNodes_; // the node has no child nodes anymore
      delete node.subtreeSize; // the node has no subtree anymore
      return node;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Remove a subtree formed by a child node of this node
     * @param {(!Node|number)} node the subtree root or its child index
     * @return {?Node} the removed subtree root node or null of there is no such a child node
     * @author Kirill Chuvilin <k.chuvilin@texnous.org>
     */

  }, {
    key: 'removeChildSubtree',
    value: function removeChildSubtree(node) {
      var nodeChildIndex = this.childIndex(node); // the child index of the node
      if (nodeChildIndex === null) return null; // return if there is no such a child
      node = this.childNodes_.splice(nodeChildIndex, 1)[0]; // remove the node from the child list
      var nodeSubtreeSize = node.subtreeSize; // the size of the subtree formed by the node
      if (this.childNodes_.length) {
        // if there are child nodes
        // update this node subtree size
        Object.defineProperty(this, 'subtreeSize', { value: this.subtreeSize - nodeSubtreeSize });
      } else {
        // if there are no child nodes
        delete this.childNodes_; // this node has no child nodes anymore
        delete this.subtreeSize; // this node has node subtree anymore
      }
      // for all the parent nodes
      for (var parentNode = this.parentNode; parentNode; parentNode = parentNode.parentNode) {
        // update the size of the subtree formed by the parent node
        Object.defineProperty(parentNode, 'subtreeSize', {
          value: parentNode.subtreeSize - nodeSubtreeSize
        });
      }
      delete node.parentNode; // the node has no parent node anymore
      return node;
    }

    /**
     * Get the string representation of this node
     * @param {boolean=false} skipNodeClass
     *        true to not include the node class name into the output, false otherwise
     * @return {string} the sources string
     * @override
     * @author Kirill Chuvilin <k.chuvilin@texnous.org>
     */

  }, {
    key: 'toString',
    value: function toString(skipNodeClass) {
      var source = ''; // the sources
      // for all the child nodes
      this.childNodes_.forEach(function (childNode) {
        source += childNode.toString(true);
      });
      return skipNodeClass ? source : 'SourceTree.Node{' + source + '}';
    }
  }, {
    key: 'childNodes',
    get: function get() {
      return this.childNodes_.slice();
    }
  }]);

  return _class2;
}();
Object.defineProperties(Node.prototype, { // make getters and setters enumerable
  childNodes: { enumerable: true }
});
Object.defineProperties(Node.prototype, { // default property values
  tree: { value: null, enumerable: true }, // no tree
  parentNode: { value: null, enumerable: true }, // no parent node
  subtreeSize: { value: 1, enumerable: true }, // only one node in the subtree
  childNodes_: { value: [], enumerable: false }, // no child nodes
  parentNodeClass_: { value: Node, enumerable: false } // parent node must be a Node instance
});
//# sourceMappingURL=SyntaxTree.js.map