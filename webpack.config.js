module.exports = {
	entry: __dirname + '/ts/run.tsx',
	output: {
		path: __dirname + '/dist',
		filename: 'bundle.js',
		library: 'Joust',
		libraryTarget: 'var'
	},
	resolve: {
		extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
	},
	module: {
		loaders: [
			{
				test: /\.tsx?$/,
				loaders: [
					'babel-loader?presets[]=react&presets[]=es2015',
					'ts-loader'
				]
			}
		]
	},
	node: {
		// these modules are (possibly) provided by electron
		fs: 'empty',
		net: 'empty'
	},
	target: 'electron',
	plugins: [],
	externals: {
		"react": "React",
		"react-dom": "ReactDOM"
	}
}
