const webpack = require('./webpack.config.js');

var webpackModule = webpack.module;

webpackModule.postLoaders = [{
	test: /\.tsx?$/,
	loader: 'isparta-loader',
	exclude: [
		'node_modules',
		/\.spec\.tsx?$/
	]
}];

module.exports = function (config) {
	config.set({
		browsers: ['PhantomJS'],
		frameworks: ['jasmine'],
		reporters: ['progress', 'coverage', 'remap-coverage'/*, 'coveralls'*/],

		files: [
			{pattern: './tests.webpack.ts', watched: false}
		],

		preprocessors: {
			'./tests.webpack.ts': ['webpack'],
		},

		webpack: {
			resolve: webpack.resolve,
			module: webpackModule,
			devtool: 'inline-source-map',
			watch: true,
			isparta: {
				embedSource: true,
				noAutoWrap: true,
				babel: {
					presets: ['es2015', 'react']
				}
			},
			ts: {
				compilerOptions: {
					sourceMap: false,
					inlineSourceMap: true
				}
			}
		},

		webpackServer: {
			noInfo: true
		},

		coverageReporter: {
			type: 'in-memory',
		},

		remapCoverageReporter: {
			'text-summary': null,
			json: './coverage/coverage.json',
			html: './coverage/html'
		},
	});
};
