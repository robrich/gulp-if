/*global it:false, before:false */

'use strict';

var vinylFs = require('vinyl-fs');
var fs = require('graceful-fs');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var through = require('through2');
var eos = require('end-of-stream');
var exhaust = require('stream-exhaust');
require('should');

var gulpif = require('../');

module.exports = function (fileCount, fixturePath) {

	before(function (done) {
		var i;
		rimraf(fixturePath, function (err) {
			if (err) {
				return done(err);
			}
			mkdirp(fixturePath, function (err) {
				if (err) {
					return done(err);
				}
				for (i = 0; i < fileCount; i++) {
					fs.writeFileSync(fixturePath+'/file'+i+'.js', 'this is file '+i);
				}
				done();
			});
		});
	});

	it('should get '+fileCount+' files through a function condition', function(done) {

		// Arrange

		var trueFunc = function (/*file*/) {
			return true;
		};

		var preArr = [];
		var ifArr = [];
		var postArr = [];

		var grabPre = function (file, enc, cb) {
			preArr.push(file.relative);
			this.push(file);
			cb();
		};
		var grabIf = function (file, enc, cb) {
			ifArr.push(file.relative);
			this.push(file);
			cb();
		};
		var grabPost = function (file, enc, cb) {
			postArr.push(file.relative);
			this.push(file);
			cb();
		};

		// Act
		var s = vinylFs.src(fixturePath+'/*.js')
			.pipe(through.obj(grabPre))
			.pipe(gulpif(trueFunc, through.obj(grabIf)))
			//.pipe(ternaryStream(trueFunc, through.obj(grabIf)))
			.pipe(through.obj(grabPost));

		eos(exhaust(s), function (err) {
			// Assert

			if (err) {
				false.should.equal(err);
				return done();
			}

			preArr.length.should.equal(fileCount);
			ifArr.length.should.equal(fileCount);
			postArr.length.should.equal(fileCount);

			done();
		});
	});

};
