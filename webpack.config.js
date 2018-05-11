const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    context: resolve(__dirname, 'src'),
    entry: [
        // bundle the client for webpack-dev-server
        // and connect to the provided endpoint
        'webpack-dev-server/client?http://localhost:8080',
        // bundle the client for hot reloading
        // only- means to only hot reload for successful updates
        'webpack/hot/only-dev-server',
        // the entry point of our app
        './index.tsx'
    ],
    output: {
        // the output bundle
        filename: 'hotloader.js',
        path: resolve(__dirname, 'dist'),
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
        port: '8080',
        // enable HMR on the server
        hot: true,
        noInfo: true,
        // minimize the output to terminal.
        quiet: false,
        // match the output path
        contentBase: resolve(__dirname, 'src'),
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
        // inject <script> in html file. 
        new HtmlWebpackPlugin({ template: resolve(__dirname, 'src/index.html') }),
        new OpenBrowserPlugin({ url: 'http://localhost:8080' }),
    ],
};