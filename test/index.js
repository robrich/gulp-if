/*jshint node:true */
/*global describe:false, it:false */

"use strict";

var gulpif = require('../');
var through = require('through');
var should = require('should');
require('mocha');

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

			var s = gulpif(condition, new through(function (data) {

				// Should never be invoked
				called++;
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

		it('should not listen for child events if test does not match', function() {
			var called = 0;
			var child = through();
			child.once = function() { called++; };
			var s = gulpif(/pass/, child);

			s.write({ path: 'pass', content: new Buffer('test') });
			called.should.equal(1);
			s.write({ path: 'fail', content: new Buffer('test') });
			called.should.equal(1);
			s.write({ path: 'pass', content: new Buffer('test') });
			called.should.equal(2);
		});

	});
  
  // http://nodejs.org/api/events.html#events_emitter_setmaxlisteners_n
	it('should not warn for >10 listeners', function() {
		var child = through(function() {});
		var s = gulpif(true, child);

		function write(n) {
			s.write({
				path: 'path/'+n,
				content: new Buffer(' '+n)
			});
		}

		for (var n=0; n<11; n++) {
			write(n);
		}
		//ajoslin: Only way I could find to test this warning
		//https://github.com/joyent/node/blob/master/test/simple/test-event-emitter-check-listener-leaks.js#L32
		should.not.exist(child._events.data.warned);
	});


});
