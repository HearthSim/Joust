module.exports = function (config) {
	config.set({
		browsers: ['PhantomJS'],
		frameworks: ['jasmine'],
		reporters: ['progress'],

		files: [
			{pattern: 'tests.webpack.ts', watched: false}
		],

		preprocessors: {
			'tests.webpack.ts': ['webpack']
		},

		webpack: {
			resolve: {
				extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
			},
			module: {
				loaders: [
					{test: /\.tsx?$/, loader: 'babel-loader?presets[]=react&presets[]=es2015!ts-loader'}
				]
			},
			watch: true
		},

		webpackServer: {
			noInfo: true
		}
	});
};
