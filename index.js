/*jshint node:true */

"use strict";

var through = require('through');

module.exports = function (doit, child, fork) {
    if (!child) {
        throw new Error('gulp-if: child action is required');
    }

    var process = function(file) {

        if(fork !== true)
            child.on('data', this.emit.bind(this, 'data'));

        if ((typeof doit === 'function' && doit(file))
            || (typeof doit ==='boolean' && doit)) {

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
