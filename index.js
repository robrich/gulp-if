/*jshint node:true */

"use strict";

var through = require('through');
var match = require('gulp-match');

module.exports = function (condition, child, branch) {
    if (!child) {
        throw new Error('gulp-if: child action is required');
    }

    var process = function(file) {

        if (match(file, condition)) {

            if (!branch) {

                this.pause();

                child.once('data', function(file) {
                    this.queue(file);
                    this.resume();
                }.bind(this));
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
