'use strict';

const nodemon = require('gulp-nodemon');
const gulp = require('gulp');
const {green} = require('chalk');
const {execSync} = require('child_process');

const APP_NAME = 'homepage';

gulp.task('start', 'Start hot reload server via nodemon.', function() {
  console.log(green(`Starting ${APP_NAME} ...` ));

  nodemon({
    script: './src/server.js',
    watch: 'src',
    ext: 'js html scss',
    env: {'NODE_ENV': 'development'},
  }).on('start', function() {
    console.log(green(`Starting assets task...` ));
    execSync('gulp assets');
  });
});
