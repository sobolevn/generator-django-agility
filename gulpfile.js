/**
 *  generator-django-agility
 *  (c) Nikita Sobolev: https://github.com/sobolevn
 *
 *  This software is released under the MIT License:
 *  http://www.opensource.org/licenses/mit-license.php
 */

'use strict';

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var jshint = require('gulp-jshint');

var testsFiles = 'test/test-*.js';
var mainAppFIles = 'app/index.js';
var startAppFiles = 'startapp/index.js';
var selfFile = 'gulpfile.js';

gulp.task('test', function(){
    return gulp.src(testsFiles, {read: false})
        .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('hint', function(){
  return gulp.src([mainAppFIles, startAppFiles, testsFiles, selfFile])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
