var gulp = require('gulp');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

var tsProject = ts.createProject('js/tsconfig.json');

gulp.task('default', ['watch']);

gulp.task('scripts', function () {
    var tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject));

    return tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('js'));
});

gulp.task('build', function () {
    var tsResult = tsProject.src()
        .pipe(ts(tsProject))
        .pipe(uglify())
        .pipe(gulp.dest('js'));
});


gulp.task('watch', ['scripts'], function() {
    gulp.watch(['js/**/*.ts', 'js/**/*.tsx'], ['scripts']);
});
