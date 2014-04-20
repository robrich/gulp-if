/*global describe:false, it:false */

'use strict';

var gulpif = require('../');

var through = require('through2');
var should = require('should');

describe('gulp-if', function() {

	describe('smoke test,', function() {
		var tempFile = './temp.txt';
		var tempFileContent = 'A test generated this file and it is safe to delete';

		it('should pass file structure through', function(done) {

			// Set up
			var condition = false;
			var called = 0;
			var fakeFile = {
				path: tempFile,
				contents: new Buffer(tempFileContent)
			};

			var s = gulpif(condition, new through.obj(function (data, enc, cb) {

				// Should never be invoked
				called++;

				this.push(data);
				cb();
			}));

			// Assert
			s.on('data', function(actualFile){
				// Test that content passed through
				should.exist(actualFile);
				should.exist(actualFile.path);
				should.exist(actualFile.contents);
				actualFile.path.should.equal(tempFile);
				String(actualFile.contents).should.equal(tempFileContent);
				called.should.equal(0);

				done();
			});

			// Act
			s.write(fakeFile);
			s.end();
		});

		it('should error if no parameters passed', function(done) {
			// Arrange
			var caughtErr;

			// Act
			try {
				gulpif();
			} catch (err) {
				caughtErr = err;
			}

			// Assert
			should.exist(caughtErr);
			caughtErr.message.indexOf('required').should.be.above(-1);
			done();
		});

	});
});
