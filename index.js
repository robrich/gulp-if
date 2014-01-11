/*jshint node:true */

"use strict";

var through = require('through');

module.exports = function (doit, child) {
    if (!child) {
        throw new Error('gulp-if: child action is required');
    }

    // if doit is a boolean function
    if(typeof doit === 'function') {

        var detour = through();
        var detour_child = detour.pipe(child);

        var _write = function (file) {

            if(!!doit.call(null, file)) {

                var tmp_stream = through(this.emit.bind(this, 'data'));

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
    }

    if (doit) {
        return child;
    } else {
        // noop
        return through(function(data){
            this.emit('data', data);
        });
    }
};
