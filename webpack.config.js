const webpack = require('webpack'),
    path = require('path'),
    yargs = require('yargs');


const VERSION = "0.2.0";


const libraryName = "bibtex-parser",
    plugins = [
        new webpack.LoaderOptionsPlugin({
            options: {
                tslint: {
                    emitErrors: true,
                    failOnHint: true
                }
            }
        })
    ];

console.log(libraryName + "." + VERSION + ".min.js");

const config = {
    entry: {
        umd: __dirname + '/src/index.ts'
    },
    devtool: 'source-map',
    output: {
        filename: "index.js",
        path: __dirname + '/',
        libraryTarget: 'umd',
        library: "rechtspraak"
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.tsx?$/,
                loader: 'tslint-loader',
                exclude: /node_modules/
            },
            {
                test: /\.tsx?$/,
                loader: [
                    'babel-loader?presets[]=es2015',
                    'awesome-typescript-loader'
                ],
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx']
    },
    plugins: plugins

    // Individual Plugin Options
};

module.exports = config;