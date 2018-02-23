'use strict';

var match = require('gulp-match');
var ternaryStream = require('ternary-stream');
var through2 = require('through2');

function lazyTransform (lazyFn) {
	var fnCached;
	var transform = function () {
		var fn = fnCached || ( fnCached = lazyFn () );
		return fn._transform.apply ( this, arguments );
	};
	return through2.obj(transform);
}

function lazify (lazyFn) {
	return ( !lazyFn || lazyFn._transform ) ? lazyFn : lazyTransform (lazyFn);
}

module.exports = function (condition, trueChild, falseChild, minimatchOptions) {
	if (!trueChild) {
		throw new Error('gulp-if: child action is required');
	}

	if (typeof condition === 'boolean') {
		// no need to evaluate the condition for each file
		// other benefit is it never loads the other stream
		return condition ? lazify(trueChild) : (falseChild ? lazify(falseChild) : through2.obj());
	}

	function classifier (file) {
		return !!match(file, condition, minimatchOptions);
	}

	return ternaryStream(classifier, lazify(trueChild), lazify(falseChild));
};
