/*jshint node:true */

"use strict";

var through = require('through');

module.exports = function (doit, child) {
	if (!child) {
		throw new Error('gulp-if: child action is required');
	}
	
	// if doit is a boolean function
	if(typeof doit === 'function') {
		var _write = function(file) {
		
		    if(!!doit.call(null, file)) {
		            
		            var get_this = this;
		
		            var detour = through()
		                    .pipe(child)
		                    .through(function(data) {get_this.emit('data', data);});
		
		            return detour.write(file);
		        
		    } else {
		        // pass along
		        return this.emit('data' file);
		    }
		
		}
		
		return through(_write);
	}
	
	if (doit) {
		return child;
	} else {
		// noop
		return through(function(data){
			this.emit('data', data);
		});
	}
};
