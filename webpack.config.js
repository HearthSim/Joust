const path = require("path");

module.exports = {
	entry: {
		joust: ["babel-polyfill", __dirname + "/ts/run.ts"],
		joust_debug: ["babel-polyfill", __dirname + "/ts/debug.tsx"],
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
	plugins: [],
	externals: {
		"react": "React",
		"react-dom": "ReactDOM",
	},
};
