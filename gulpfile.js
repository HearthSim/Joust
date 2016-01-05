var gulp = require('gulp');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var less = require('gulp-less');

var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');


var tsProject = ts.createProject('./js/tsconfig.json');

gulp.task('default', ['watch']);

gulp.task('compile', ['compile:scripts', 'compile:styles'])

gulp.task('compile:scripts', function () {
    var tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject)).js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./js'));
});

gulp.task('compile:styles', function () {
    gulp.src('./css/**/*.less')
        .pipe(sourcemaps.init())
        .pipe(less({'strictMath': true}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./css'));
});

gulp.task('watch', ['watch:scripts', 'watch:styles']);

gulp.task('watch:scripts', ['compile:scripts'], function () {
    gulp.watch(['js/**/*.ts', 'js/**/*.tsx'], ['compile:scripts']);
});

gulp.task('watch:styles', ['compile:styles'], function () {
    gulp.watch(['css/**/*.less'], ['compile:styles']);
});

gulp.task('browser', ['compile'], function() {
    var b = browserify({
        entries: './js/run.js',
        debug: true
    });

    return b.bundle()
        .pipe(source('joust.js'))
        .pipe(buffer())
//        .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
//        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/'));
});