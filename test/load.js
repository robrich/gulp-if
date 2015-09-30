/*global describe:false */

'use strict';

var loadTests = require('./loadTests');

describe('gulp-if', function() {
	describe('load,', function() {

		loadTests(10, './fixture/ten');
		loadTests(100, './fixture/onehundred');
		loadTests(200, './fixture/twohundred');
		loadTests(400, './fixture/fourhundred');

	});
});
