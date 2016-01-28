module.exports = {
	entry: __dirname + '/ts/run.tsx',
	output: {
		path: __dirname + '/dist',
		filename: 'bundle.js'
	},
	resolve: {
		extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
	},
	module: {
		loaders: [
			{ test: /\.tsx?$/, loader: 'ts-loader' }
		]
	},
	node: {
		// these modules will be provided electron
		fs: 'empty',
		net: 'empty'
	}
}