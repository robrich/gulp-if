/*jshint node:true */

"use strict";

var through = require('through');

module.exports = function (doit, child, fork) {

    fork = !!fork;

    if (!child) {
        throw new Error('gulp-if: child action is required');
    }

    if(typeof doit !== 'boolean' && typeof doit !== 'function') {
        throw new Error('gulp-if: first param must be boolean function/expression');
    }

    if(typeof doit === 'boolean') {
        var _bool = !!doit;
        doit = function() {
            return _bool;
        };
    }

    var detour = through();
    var detour_child = detour.pipe(child);

    var _write = function (file) {

        if(!!doit.call(null, file)) {

            var tmp_stream = through(this.emit.bind(this, 'data'));



            if(fork == false)
                detour_child.pipe(tmp_stream);

            detour.write(file);

            tmp_stream.end();

        } else {
            // pass along
            this.emit('data', file);
        }
    };

    var _end = function() {
        detour.end();
        this.emit('end');
    };

    return through(_write, _end);

};
