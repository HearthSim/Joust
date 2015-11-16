gulp = require 'gulp'
rename = require 'gulp-rename'
less = require 'gulp-less'
watch = require 'gulp-watch'
copy = require 'gulp-copy'

gulp.task 'style', ->
	gulp.src 'src/less/styles.less'
	.pipe less()
	.pipe rename('bundle.css')
	.pipe gulp.dest('static/build/css')

gulp.task 'watch', ->
	gulp.watch('src/less/**/*.less', ['style'])

gulp.task 'default', ['style']
