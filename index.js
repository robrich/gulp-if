/*jshint node:true */

"use strict";

var through = require('through');

module.exports = function (doit, child) {
	if (!child) {
		throw new Error('gulp-if: child action is required');
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
