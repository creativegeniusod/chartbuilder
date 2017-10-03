/**
 * Copyright 2014, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
'use strict';
require('babel-core/register')({
    presets: ['es2015', 'react'],
    extensions: [".es6", ".es", ".jsx", ".js"],
    ignore:  /node_modules\/(?!(chartbuilder-ui|react-tangle)\/).*/
})

module.exports = require('./server');
