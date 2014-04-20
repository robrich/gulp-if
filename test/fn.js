/*global describe:false, it:false */

'use strict';

var gulpif = require('../');

var through = require('through2');
require('should');

describe('gulp-if', function() {
	describe('when given a function,', function() {
		var tempFile = './temp.txt';
		var tempFileContent = 'A test generated this file and it is safe to delete';

		it('should call the function when bool function satisfies', function(done){

			var filter = function(file) { return file.path % 2 === 0; };

			var collect = [];

			var stream = through.obj(function (file, enc, cb) {
				var num = file.path;

				(num % 2).should.equal(0);
				collect.push(num);

				this.push(file);
				cb();
			});

			var s = gulpif(filter, stream);

			var n = 5;

			// Assert
			s.once('end', function(){

				// Test that command executed
				collect.length.should.equal(3);
				collect.indexOf(4).should.equal(0);
				collect.indexOf(2).should.equal(1);
				collect.indexOf(0).should.equal(2);
				done();
			});

			// Act
			while(n > 0) {
				n--;
				s.write({
					path:n
				});
			}

			s.end();
		});

		it('should call the function when passed truthy', function(done) {
			// Arrange
			var condition = function() { return true; };
			var called = 0;
			var fakeFile = {
				path: tempFile,
				contents: new Buffer(tempFileContent)
			};

			var changedContent = 'changed_content';

			var s = gulpif(condition, through.obj(function (file, enc, cb) {

				// Test that file got passed through
				file.should.equal(fakeFile);

				called++;

				// do simple file transform
				file.contents = new Buffer(changedContent);

				this.push(file);
				cb();
			}));

			// ensure file is passed correctly
			s.pipe(through.obj(function(data, enc, cb){

				data.should.equal(fakeFile);
				data.contents.toString().should.equal(changedContent);

				called++;

				this.push(data);
				cb();
			}));

			// Assert
			s.once('end', function(){

				// Test that command executed
				called.should.equal(2);
				done();

			});

			// Act
			s.write(fakeFile);
			s.end();
		});

		it('should not call the function when passed falsey', function(done) {
			// Arrange
			var condition = function() { return false; };
			var called = 0;
			var fakeFile = {
				path: tempFile,
				contents: new Buffer(tempFileContent)
			};

			var s = gulpif(condition, through.obj(function (file, enc, cb) {

				// Test that file got passed through
				file.should.equal(fakeFile);

				called++;

				this.push(file);
				cb();
			}));

			// Assert
			s.once('end', function(){

				// Test that command executed
				called.should.equal(0);
				done();
			});

			// Act
			s.write(fakeFile);
			s.end();
		});
	});
});
