/*jshint node:true */

"use strict";

var through = require('through');
var match = require('gulp-match');

module.exports = function (condition, child, branch) {
    if (!child) {
        throw new Error('gulp-if: child action is required');
    }

    child.setMaxListeners(0);
    
    var process = function(file) {

        if (match(file, condition)) {
            if (!branch) {
                child.once('data', this.emit.bind(this, 'data'));
            }
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
