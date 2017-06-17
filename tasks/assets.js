'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const del = require('del');
const runSequence = require('run-sequence');
const uglifycss = require('gulp-uglifycss');

// images and js files only. style files(scss) are handled by 'sass' task
const assetsPathPattern = 'src/**/frontend/*.{js,ico,png}';
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
});

gulp.task('assets:move-js-img',
  'Recursively move js and image files from each widget to public directory.',
  () => {
  return gulp.src(assetsPathPattern)
      .pipe(rename((path) => {
        path.dirname = path.dirname.replace('frontend', '');
      }))
      .pipe(gulp.dest('./public'));
});

gulp.task('assets', function() {
  return runSequence(
    'assets:clean',
    'assets:sass',
    'assets:move-js-img',
    function(error) {
      if (error) {
        console.log(error.message);
      } else {
        console.log('ASSETS FINISHED SUCCESSFULLY');
      }
    });
});
