const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    entry: "./src/js/components/App.tsx",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                include: [path.resolve(__dirname, "src/js")],
                use: [{
                    loader: "babel-loader"
                }]
            },
            {
                test: /\.html$/,
                include: [path.resolve(__dirname, "src")],
                use: "html-loader"
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        // alias: {
        //     '@material-ui/lab': '@material-ui/lab/es',
        //     '@material-ui/core': '@material-ui/core/es'
        // },
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
        }),
        // new BundleAnalyzerPlugin(),
        new CompressionPlugin({algorithm: 'brotliCompress', filename: '[path][base].br'})
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
		splitChunks: {
			cacheGroups: {
				commons: {
					test: /node_modules/,
					name: 'vendors',
					chunks: 'all'
				}
			}
		}
	}
};