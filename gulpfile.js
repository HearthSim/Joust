const gulp = require("gulp");
const gutil = require("gulp-util");
const gfile = require("gulp-file");
const plumber = require("gulp-plumber");

const sourcemaps = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");

const webpack = require("webpack");
const webpackStream = require("webpack-stream");

const filter = require("gulp-filter");
const livereload = require("gulp-livereload");

const gitDescribe = require("git-describe").gitDescribe;

const download = require("gulp-download");

gulp.task("env:set-release", function(done) {
	gitDescribe(__dirname, { match: null }).then(function(gitInfo) {
		var release = gitInfo.semverString;
		if (!release) {
			throw Error("Unable to determine release");
		}
		gutil.log("Setting JOUST_RELEASE to", gutil.colors.green(release));
		process.env.JOUST_RELEASE = release;
		done();
	});
});

gulp.task(
	"version:write",
	gulp.series("env:set-release", function() {
		const version = process.env.JOUST_RELEASE;
		return gfile("VERSION", version, { src: true }).pipe(
			gulp.dest("dist/"),
		);
	}),
);

gulp.task(
	"compile:scripts:web",
	gulp.series("env:set-release", function() {
		const config = require("./webpack.config.js");
		config.entry = { joust: config.entry.joust }; // remove all bundles but joust
		config.target = "web";
		config.plugins = config.plugins.concat([
			new webpack.optimize.UglifyJsPlugin({
				comments: false,
				compress: {
					warnings: false,
				},
				sourceMap: true,
			}),
			new webpack.BannerPlugin({
				banner:
					"Joust " +
					process.env.JOUST_RELEASE +
					"\n" +
					"https://github.com/HearthSim/Joust",
			}),
			new webpack.LoaderOptionsPlugin({
				minimize: true,
			}),
		]);
		config.devtool = "#source-map";
		return gulp
			.src("ts/run.ts")
			.pipe(webpackStream(config, webpack))
			.pipe(gulp.dest("dist/"));
	}),
);

gulp.task("compile:scripts", gulp.series("compile:scripts:web"));

gulp.task("compile:scripts:dev", function() {
	return gulp
		.src("ts/run.ts")
		.pipe(webpackStream(require("./webpack.config.js"), webpack))
		.pipe(gulp.dest("dist/"));
});

gulp.task("compile:styles", function() {
	return gulp
		.src("less/joust.less")
		.pipe(
			plumber(function(err) {
				gutil.log(gutil.colors.red(err));
				this.emit("end", new gutil.PluginError(err));
			}),
		)
		.pipe(sourcemaps.init())
		.pipe(less({ strictMath: true }))
		.pipe(
			postcss([
				autoprefixer({
					browsers: ["last 2 versions"],
					remove: false,
				}),
				cssnano(),
			]),
		)
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest("dist/"))
		.pipe(filter(["**/*.css"]))
		.pipe(livereload());
});

gulp.task("html:dev", function() {
	return gulp.src("html/**/*.html").pipe(gulp.dest("dist/"));
});
gulp.task("html:web", function() {
	return gulp.src("html/index.html").pipe(gulp.dest("dist/"));
});
gulp.task("html", gulp.series("html:dev"));

gulp.task("assets", function() {
	return gulp.src("assets/**/*.*").pipe(gulp.dest("dist/assets/"));
});

gulp.task("enums:download", function() {
	return download("https://api.hearthstonejson.com/v1/enums.d.ts").pipe(
		gulp.dest("ts/"),
	);
});

gulp.task(
	"compile:web",
	gulp.parallel(
		"compile:scripts:web",
		"compile:styles",
		"html:web",
		"assets",
		"version:write",
	),
);

gulp.task("compile", gulp.series("compile:web"));

gulp.task(
	"compile:dev",
	gulp.parallel(
		"compile:scripts:dev",
		"compile:styles",
		"html:dev",
		"assets",
	),
);

gulp.task(
	"watch:styles",
	gulp.series("compile:styles", function() {
		return gulp.watch(["less/**/*.less"], gulp.series("compile:styles"));
	}),
);

gulp.task(
	"watch:html",
	gulp.series("html", function() {
		return gulp.watch(["html/**/*.html"], gulp.series("html"));
	}),
);

gulp.task(
	"watch:assets",
	gulp.series("assets", function() {
		return gulp.watch(["assets/**/*.*"], gulp.series("assets"));
	}),
);

gulp.task(
	"watch",
	gulp.parallel("watch:styles", "watch:html", "watch:assets", function() {
		livereload.listen();
		gutil.log(
			gutil.colors.yellow(
				"Warning: not compiling or watching TypeScript files",
			),
		);
		gutil.log(
			gutil.colors.yellow('Use "webpack --watch -d" for development'),
		);
	}),
);

gulp.task("default", gulp.series("watch"));
