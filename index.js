/*jshint node:true */

"use strict";

var through = require('through');

module.exports = function (doit, child) {
    if (!child) {
        throw new Error('gulp-if: child action is required');
    }

    // if doit is a boolean function
    if(typeof doit === 'function') {

        var _write = function(file) {

            if(!!doit.call(null, file)) {

                this.pause();

                var detour = through();

                detour.pipe(child)
                .pipe(through(this.push));

                detour.once('end', this.resume);

                detour.write(file), detour.end();

            } else {
                // pass along
                this.emit('data', file);
            }

        }

        return through(_write);
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
