/*jshint node:true */
/*global describe:false, it:false */

"use strict";

var gulpif = require('../');
var through = require('through');
var should = require('should');
require('mocha');

describe('gulp-if', function() {

    describe('when given a non-boolean value,', function() {
        it('should throw error', function() {
            var err = new Error('gulp-if: first param must be boolean function/expression');

            // var s = gulpif([], through());
            (function(){
                gulpif([], through());
            }).should.throw();
        });
    });

    describe('when given a boolean,', function() {
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

    describe('when given a boolean function,', function() {
        var tempFile = './temp.txt';
        var tempFileContent = 'A test generated this file and it is safe to delete';

        it('should pass file structure through', function(done) {
            // Arrange
            var condition = function() {return false;};
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

        it('should call the function when bool function satisfies', function(done){

            var filter = function(num) { return num % 2 == 0;};

            var collect = [];

            var stream = through(function (num) {

                (num % 2 == 0).should.equal(true);
                collect.push(num);

                return this.queue(num);
            });

            stream.once('end', done);

            var s = gulpif(filter, stream);

            var n = 5;

            // Assert
            s.once('end', function(/*file*/){
                // Test that command executed

                (collect.indexOf(4) === 0).should.equal(true);
                (collect.indexOf(2) === 1).should.equal(true);
                (collect.indexOf(0) === 2).should.equal(true);

            });

            // Act
            while(n-- > 0) {
                s.write(n);
            }

            s.end();

        });

        it('should call the function and fork when bool function satisfies', function(done){

            var filter = function(num) { return num % 2 == 0;};

            var collect = [];

            var stream = through(function (num) {
                (num % 2 == 0).should.equal(true);
                collect.push(num);

                return this.queue(num);
            });

            stream.once('end', done);


            var main_stream = through(function(num) {
                (filter(num)).should.equal(false);
                // main_called++;
            })

            var s = gulpif(filter, stream, true);

                s.pipe(main_stream);

            var n = 5;

            // Assert
            s.once('end', function(/*file*/){
                // Test that command executed

                (collect.indexOf(4) === 0).should.equal(true);
                (collect.indexOf(2) === 1).should.equal(true);
                (collect.indexOf(0) === 2).should.equal(true);

            });

            // Act
            while(n-- > 0) {
                s.write(n);
            }

            s.end();

        });

        it('should call the function when passed truthy', function(done) {
            // Arrange
            var condition = function() {return true;};
            var called = 0;
            var fakeFile = {
                path: tempFile,
                contents: new Buffer(tempFileContent)
            };

            var changed_content = 'changed_content'

            var s = gulpif(condition, through(function (file) {
                // Test that file got passed through
                (file === fakeFile).should.equal(true);
                called++;

                // do simple file transform
                file.contents = new Buffer(changed_content);

                return this.queue(file);
            }));

            // ensure file is passed correctly
            s.pipe(through(function(data){
                (data === fakeFile).should.equal(true);


                (data.contents.toString() === changed_content).should.equal(true)

                called++;
                return this.queue(data);
            }));

            // Assert
            s.once('end', function(/*file*/){
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
            var condition = function() {return false;};
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
