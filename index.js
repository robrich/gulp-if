/*jshint node:true */

"use strict";

var through2 = require('through2');
var match = require('gulp-match');

module.exports = function (condition, trueChild, falseChild) {
	if (!trueChild) {
		throw new Error('gulp-if: child action is required');
	}

	trueChild.setMaxListeners(0);
	if (falseChild) {
		falseChild.setMaxListeners(0);
	}

	var emitToChild = function (file, stream) {
		this.pause();
		stream.once('data', function(fileOut) {
			this.push(fileOut); // child is done, send it downstream
			this.resume();
		}.bind(this));
		stream.write(file);
	};

	var process = function(file, enc, cb) {

		if (match(file, condition)) {
			// send to truthy stream
			emitToChild(file, trueChild);
		} else if (falseChild) {
			// send to falsey stream
			emitToChild(file, falseChild);
		} else {
			// no child wanted it, send it downstream
			this.push(file);
		}
		cb();
	};

	var end = function(cb) {
		// let them tell me when they're done and then I'll emit end too

		var trueEnded = false;
		var falseEnded = !falseChild; // if there is no false child stream, it's already ended

		// this stream is done when both children end
		var emitEnd = function () {
			if (trueEnded && falseEnded) {
				cb();
			}
		};

		trueChild.on('end', function () {
			trueEnded = true;
			emitEnd();
		}.bind(this));
		if (falseChild) {
			falseChild.on('end', function () {
				falseEnded = true;
				emitEnd();
			}.bind(this));
		}

		trueChild.end();
		if (falseChild) {
			falseChild.end();
		}
	
	};

	return through2.obj(process, end);
};
