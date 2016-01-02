var gulp = require('gulp');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var less = require('gulp-less');

var tsProject = ts.createProject('./js/tsconfig.json');

gulp.task('default', ['watch']);

gulp.task('scripts', function () {
    var tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject)).js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./js'));
});

gulp.task('styles', function () {
    gulp.src('./css/**/*.less')
        .pipe(sourcemaps.init())
        .pipe(less({'strictMath': true}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./css'));
});

gulp.task('watch', ['watch:scripts', 'watch:styles']);

gulp.task('watch:scripts', ['scripts'], function () {
    gulp.watch(['js/**/*.ts', 'js/**/*.tsx'], ['scripts']);
});

gulp.task('watch:styles', ['styles'], function () {
    gulp.watch(['css/**/*.less'], ['styles']);
});
