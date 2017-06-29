'use strict';

const gulp = require('gulp-help')(require('gulp'));

require('./assets');
require('./start');
require('./prepublish');
require('./alias');

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['help']);
