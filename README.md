![status](https://secure.travis-ci.org/robrich/gulp-if.png?branch=master)

gulp-if
=======

Use boolean expressions or functions to conditionally control the flow of streams.


## Usage

```javascript
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');

var condition = true; // TODO: add business logic

gulp.task('task', function() {
  gulp.src('./src/*.js')
    .pipe(gulpif(condition, uglify()))
    .pipe(gulp.dest('./dist/'));
});
```

## API

### gulpif(condition, stream [, branch])

gulp-if will pipe data to `stream` appropriately whenever `condition` is satisfied.

To visualize stream flow, see the following diagram:

![](img/flow.png)

If `condition` is unsatisfied, then data from `stream A` will pass onto `Stream D`.

However, if `condition` is satisfied, then data from `stream A` will pipe to `stream B`.

If `branch` is true, `stream B` will not pass data to `stream D`. This is useful if another stream, say `stream C`, is connected to `stream B`. Otherwise, `stream B` will pass data to `stream D` whenever `branch` is false.

#### Parameters

##### condition

Type: `boolean` or [`stat`](http://nodejs.org/api/fs.html#fs_class_fs_stats) object or `function` that takes in a vinyl file and returns a boolean or `RegularExpression` that works on the `file.path`

The condition parameter is any of the conditions supported by [gulp-match](https://github.com/robrich/gulp-match).  The `file.path` is passed into `gulp-match`.

If a function is given, then the function is passed a vinyl `file`. The function should return a `boolean`.

##### stream

Stream for gulp-if to pipe data into. Useful when given a gulp-plugin.

##### branch

Type: `boolean`

Default: `false`

`branch` controls the flow behavior of whether gulp-if should pipe `stream` back to the main stream (i.e. branching flow).

If `true`, then gulp-if **will not** pipe `stream` back to the main stream. Otherwise, gulp-if will pipe `stream` back to the main stream.


LICENSE
-------

(MIT License)

Copyright (c) 2014 [Richardson & Sons, LLC](http://richardsonandsons.com/)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
