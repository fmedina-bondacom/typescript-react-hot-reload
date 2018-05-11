const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const tsImportPluginFactory = require('ts-import-plugin');

module.exports = {
    mode: 'development',
    context: resolve(__dirname, 'src'),
    entry: [
        'webpack-dev-server/client?http://localhost:8080',
        // bundle the client for webpack-dev-server
        // and connect to the provided endpoint
        'webpack/hot/only-dev-server',
        // bundle the client for hot reloading
        // only- means to only hot reload for successful updates
        './index.tsx'
        // the entry point of our app
    ],
    output: {
        filename: 'hotloader.js',
        // the output bundle
        path: resolve(__dirname, 'dist'),
        publicPath: '/'
        // necessary for HMR to know where to load the hot update chunks
    },
    devtool: 'inline-source-map',
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    devServer: {
        port: '8080',
        // Change it if other port needs to be used
        hot: true,
        // enable HMR on the server
        noInfo: true,
        quiet: false,
        // minimize the output to terminal.
        contentBase: resolve(__dirname, 'src'),
        // match the output path
        publicPath: '/'
        // match the output `publicPath`
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
        new webpack.HotModuleReplacementPlugin(),
        // enable HMR globally
        new webpack.NamedModulesPlugin(),
        // prints more readable module names in the browser console on HMR updates
        new HtmlWebpackPlugin({ template: resolve(__dirname, 'src/index.html') }),
        // inject <script> in html file. 
        new OpenBrowserPlugin({ url: 'http://localhost:8080' }),
    ],
};