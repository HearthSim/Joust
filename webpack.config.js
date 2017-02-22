const path = require("path");
const webpack = require("webpack");

module.exports = {
	entry: {
		joust: __dirname + "/ts/run",
		joust_debug: __dirname + "/ts/debug",
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name].js",
		library: "Joust",
		libraryTarget: "var",
	},
	resolve: {
		extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
	},
	module: {
		loaders: [
			{
				test: /\.tsx?$/,
				loaders: [
					"babel-loader?presets[]=react&presets[]=es2015",
					"ts-loader",
				],
			},
		],
	},
	node: {
		// these modules are (possibly) provided by electron
		fs: "empty",
		net: "empty",
	},
	target: "electron",
	plugins: [
		new webpack.DefinePlugin({
			JOUST_RELEASE: JSON.stringify(process.env.JOUST_RELEASE) || undefined,
		}),
	],
	externals: {
		"react": "React",
		"react-dom": "ReactDOM",
	},
};
