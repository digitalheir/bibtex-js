const webpack = require("webpack");
const path = require("path");


const libraryName = "latex-parser",
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

let minifiedFileName = `${libraryName}.min.js`;

console.log(minifiedFileName);

const config = {
  entry: {
    umd: `${__dirname}/sources/main.ts`
  },
  devtool: "source-map",
  output: {
    filename: minifiedFileName,
    path: `${__dirname}/`,
    libraryTarget: "umd",
    library: libraryName
  },
  module: {
    rules: [
      // TODO for better code quality, enable
      // {
      //     enforce: 'pre',
      //     test: /\.tsx?$/,
      //     loader: 'tslint-loader',
      //     exclude: /node_modules/
      // },
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
};

module.exports = config;