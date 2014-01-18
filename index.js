/*jshint node:true */

"use strict";

var through = require('through');

module.exports = function (doit, child, fork) {
    if (!child)
        throw new Error('gulp-if: child action is required');

    if (typeof doit !== 'function' && typeof doit !== 'boolean')
        throw new Error('gulp-if: first param must be boolean function/expression');

    var process = function(file) {

        if (fork !== true)
            child.once('data', this.emit.bind(this, 'data'));

        if ((typeof doit === 'function' && doit(file)) ||
            (typeof doit ==='boolean' && doit)) {

            child.write(file);
            return;
        }

        this.emit('data', file);
    };

    var end = function() {
        child.end();
        this.emit('end');
    };

    return through(process, end);
};
