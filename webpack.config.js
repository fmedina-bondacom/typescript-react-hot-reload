const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const sourcePath = 'source';
const buildPath = 'dist';
const testServerPort = 9000;

module.exports = {
    mode: 'development',    // Values: "development", "production" or "none"
    context: resolve(__dirname, sourcePath),
    entry: [
        // bundle the client for webpack-dev-server and connect to the provided endpoint
        'webpack-dev-server/client?http://localhost:' + testServerPort,
        // bundle the client for hot reloading only - means to only hot reload for successful updates
        'webpack/hot/only-dev-server',
        // the entry point of our app
        './index.tsx'
    ],
    output: {
        // the output bundle
        filename: 'index.js',
        path: resolve(__dirname, buildPath),
        // necessary for HMR to know where to load the hot update chunks
        publicPath: '/'
    },
    devtool: 'inline-source-map',
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    devServer: {
        // Change it if other port needs to be used
        port: testServerPort,
        // enable HMR on the server
        hot: true,
        noInfo: true,
        // minimize the output to terminal.
        quiet: false,
        // match the output path
        contentBase: resolve(__dirname, sourcePath),
        // match the output `publicPath`
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif|svg|ico)$/,
                loader: 'file-loader',
                query: {
                    outputPath: './img/',
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.(eot|ttf|otf|woff|woff2|json|xml)$/,
                loader: 'file-loader',
                query: {
                    outputPath: './fonts/',
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.(json|xml)$/,
                loader: 'file-loader',
                query: {
                    outputPath: './data/',
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.(s*)css$/,
                use: [{ loader: "style-loader" }, { loader: "css-loader" }, { loader: "sass-loader" }]
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: "source-map-loader"
            },
            {
                test: /\.(csv|tsv)$/,
                use: [{ loader: 'csv-loader' }]
            },
            {
                test: /\.exec\.js$/,
                use: [{ loader: 'script-loader' }]
            }
        ]
    },
    plugins: [
        // enable HMR globally
        new webpack.HotModuleReplacementPlugin(),
        // prints more readable module names in the browser console on HMR updates
        new webpack.NamedModulesPlugin(),
        // inject <script> in html file and copy the html to the build folder.
        new HtmlWebpackPlugin({ template: resolve(__dirname, sourcePath + '/index.html') }),
        // copy css and other files to the build folder to avoid path issues.
        new CopyWebpackPlugin(
            [
                { from: './', to: '../' + buildPath, ignore: ['*.ts', '*.tsx', '*.html'] }
            ]
        ),
        new OpenBrowserPlugin({ url: 'http://localhost:' + testServerPort }),
    ],
};