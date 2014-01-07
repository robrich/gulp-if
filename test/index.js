/*jshint node:true */
/*global describe:false, it:false */

"use strict";

var gulpif = require('../');
var through = require('through');
var should = require('should');
require('mocha');

describe('gulp-if', function() {
	describe('()', function() {
		var tempFile = './temp.txt';
		var tempFileContent = 'A test generated this file and it is safe to delete';

		it('should pass file structure through', function(done) {
			// Arrange
			var condition = false;
			var fakeFile = {
				path: tempFile,
				contents: new Buffer(tempFileContent)
			};

			var s = gulpif(condition, new through(function (data) {
				this.emit(data);
			}));

			// Assert
			s.on('data', function(actualFile){
				// Test that content passed through
				should.exist(actualFile);
				should.exist(actualFile.path);
				should.exist(actualFile.contents);
				actualFile.path.should.equal(tempFile);
				String(actualFile.contents).should.equal(tempFileContent);
				done();
			});

			// Act
			s.write(fakeFile);
			s.end();
		});

		it('should call the function when passed truthy', function(done) {
			// Arrange
			var condition = true;
			var called = 0;
			var fakeFile = {
				path: tempFile,
				contents: new Buffer(tempFileContent)
			};

			var s = gulpif(condition, through(function (file) {
				// Test that file got passed through
				(file === fakeFile).should.equal(true);
				called++;
				return this.queue(file);
			}));

			// Assert
			s.once('end', function(/*file*/){
				// Test that command executed
				called.should.equal(1);
				done();
			});

			// Act
			s.write(fakeFile);
			s.end();
		});

		it('should not call the function when passed falsey', function(done) {
			// Arrange
			var condition = false;
			var called = 0;
			var fakeFile = {
				path: tempFile,
				contents: new Buffer(tempFileContent)
			};

			var s = gulpif(condition, through(function (file) {
				// Test that file got passed through
				(file === fakeFile).should.equal(true);
				called++;
				return this.queue(file);
			}));

			// Assert
			s.once('end', function(/*file*/){
				// Test that command executed
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
