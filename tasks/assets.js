'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const del = require('del');
const runSequence = require('run-sequence');
const uglifycss = require('gulp-uglifycss');
const {execSync} = require('child_process');

const imgPattern = 'src/**/frontend/*.{ico,png}';
const publicPath = './public';

gulp.task('assets:clean', 'Clean up public folder', function() {
  return del([
    publicPath,
  ]);
});

gulp.task('assets:sass', 'Compile sass into css', function() {
  return gulp.src('./src/**/frontend/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename((path) => {
        console.log(path.dirname)
        path.dirname = path.dirname.replace('frontend', '');
      }))
    .pipe(uglifycss({
      'maxLineLen': 80,
      'uglyComments': true,
    }))
    .pipe(gulp.dest('./public'));
  }
);

gulp.task('assets:move-img',
  'Recursively move image files from each widget to public directory.',
  () => {
  return gulp.src(imgPattern)
      .pipe(rename((path) => {
        path.dirname = path.dirname.replace('frontend', '');
      }))
      .pipe(gulp.dest('./public'));
  }
);

gulp.task('assets:js',
  'Fire up webpack for js building',
  () => {
    const webpackCommand = 'webpack'
    execSync(webpackCommand);
  }
);

gulp.task('assets', function() {
  return runSequence(
    'assets:clean',
    'assets:sass',
    'assets:js',
    'assets:move-img',
    function(error) {
      if (error) {
        console.log(error.message);
      } else {
        console.log('ASSETS FINISHED SUCCESSFULLY');
      }
    });
  }
);
