var gulp = require('gulp'),
  minifycss = require('gulp-minify-css'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename');

gulp.task('minifycss', function () {
  return gulp.src('static/css/*.css')
    .pipe(concat("main.min.css"))
    .pipe(minifycss())
    .pipe(gulp.dest('static/assets/css'));
});

gulp.task('minifyjs', function () {
  return gulp.src([
    'assets/js/back-to-top.js',
    'assets/js/reward.js',
    'assets/js/search.js',
    'assets/js/sidebar.js',
    'assets/js/post-toc.js'
  ]).pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('assets/js'));
});

gulp.task('default', function () {
  gulp.start('minifycss', 'minifyjs');
});

