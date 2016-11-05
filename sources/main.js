/**
 * @fileoverview Export file for LaTeX parser utilities.
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


/**
 * @namespace latex-parser
 * @author Kirill Chuvilin <k.chuvilin@texnous.org>
 */
module.exports = {
  Utils:       require('./lib/Utils'), // general JavaScript utils
  Latex:       require('./lib/Latex'), // general LaTeX definitions
  LatexStyle:  require('./lib/LatexStyle'), // LaTeX style structures
  SyntaxTree:  require('./lib/SyntaxTree'), // syntax tree structure elements
  LatexTree:   require('./lib/LatexTree'), // LaTeX syntax tree structure elements
  LatexParser: require('./lib/LatexParser') // LaTeX parser class
};
