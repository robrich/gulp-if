'use strict';

var match = require('gulp-match');
var ternaryStream = require('ternary-stream');

module.exports = function (condition, trueChild, falseChild) {
	if (!trueChild) {
		throw new Error('gulp-if: child action is required');
	}

	function classifier (file) {
		return !!match(file, condition);
	}
	
	return ternaryStream(classifier, trueChild, falseChild);
};
