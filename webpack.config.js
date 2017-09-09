const webpack = require('webpack');
// const path = require('path');

const plugins = [
    new webpack.LoaderOptionsPlugin({
        options: {
            tslint: {
                emitErrors: true,
                failOnHint: true
            }
        }
    })
];

// const libraryName = "bibtex-parser";
// console.log(libraryName + /*"." + VERSION + */".min.js");

const config = {
    entry: {
        umd: __dirname + '/src/index.ts'
    },
    devtool: 'source-map',
    output: {
        filename: "index.js",
        path: __dirname + '/',
        libraryTarget: 'umd',
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
                loader: "awesome-typescript-loader",
                options: {
                    configFileName: "tsconfig.json",
                    useBabel: false
                },
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx']
    },
    plugins: plugins
};

module.exports = config;