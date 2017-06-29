// TODO: change this to 'publish' and handle prepublish + npm publish
'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const del = require('del');
const runSequence = require('run-sequence');
const uglifycss = require('gulp-uglifycss');
const {execSync} = require('child_process');

gulp.task('prepublish',
  'Copy over compiled assets and template to lib folder',
  () => {
    const assetsPath = 'public/**';
    const templatePath = 'src/index.html';
    gulp.src(assetsPath).pipe(gulp.dest('./lib/frontend'));
    gulp.src(templatePath).pipe(gulp.dest('./lib'));
  }
);
