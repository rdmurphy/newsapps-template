var fs = require('fs');
var http = require('http');

var gulp = require('gulp');

var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var include = require('gulp-include');
var jshint = require('gulp-jshint');
var sass = require('gulp-ruby-sass');
var uglify = require('gulp-uglify');

var stylish = require('jshint-stylish');

var bootstrap_url = 'http://www.texastribune.org/test/gistpage/v2/';


gulp.task('sass', function() {
  return gulp.src('./src/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./src/css'));
});

gulp.task('styles', ['sass'], function() {
  return gulp.src('./src/css/*.css')
    .pipe(concat('app.css'))
    .pipe(gulp.dest('./build'))
    .pipe(concat('app.min.css')) // just a renaming
    .pipe(cssmin())
    .pipe(gulp.dest('./build'));
});

gulp.task('lint', function() {
  return gulp.src('./src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('scripts', ['lint'], function() {
  return gulp.src('./src/js/app.js')
    .pipe(browserify())
    .pipe(gulp.dest('./build'))
    .pipe(concat('app.min.js')) // just a renaming
    .pipe(uglify())
    .pipe(gulp.dest('./build'));
});

gulp.task('html', function() {
  return gulp.src('./src/html/app.html')
    .pipe(gulp.dest('./build'));
});

gulp.task('build', ['styles', 'scripts', 'html'], function() {
  return gulp.src('./build/section_templates/*.html')
    .pipe(include())
    .pipe(gulp.dest('./dist'));
});

gulp.task('create', ['build'] , function() {
  return gulp.src('./build/base_template/index.html')
    .pipe(include())
    .pipe(gulp.dest('.'));
});

gulp.task('watch', ['create'], function() {
  gulp.watch(['./src/scss/*.scss', './src/js/*.js', './src/html/app.html'], ['create']);
});

gulp.task('init', function() {
  var file = fs.createWriteStream('./build/base_template/index.html');

  var request = http.get(bootstrap_url, function(response) {
    response.pipe(file);
  });
});

gulp.task('default', ['create']);
