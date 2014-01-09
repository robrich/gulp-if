/*jshint node:true */

"use strict";

var gutil = require('gulp-util');

module.exports = function (doit, child) {
	if (!child) {
		throw new Error('gulp-if: child action is required');
	}
	if (doit) {
		return child;
	} else {
		// noop
		return gutil.noop();
	}
};
