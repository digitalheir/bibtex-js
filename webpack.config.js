var webpack = require('webpack'),
    path = require('path'),
    yargs = require('yargs');

var VERSION = require('./version').default;

var libraryName = 'bibtex-parser',
    plugins = [
        new webpack.LoaderOptionsPlugin({
            options: {
                tslint: {
                    emitErrors: true,
                    failOnHint: true
                }
            }
        })
    ],
    outputFile;

if (yargs.argv.p) {
    //plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true }));
    outputFile = libraryName + '.' + VERSION + '.min.js';
} else {
    outputFile = libraryName + '.' + VERSION + '.js';
}

var config = {
    entry: [
        __dirname + '/src/index.ts'
    ],
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, '/'),
        filename: outputFile,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
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
                loader: 'awesome-typescript-loader',
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