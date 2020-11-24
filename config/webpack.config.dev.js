"use strict";

const webpack = require("webpack");
const merge = require("webpack-merge");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const helpers = require("./helpers");
const commonConfig = require("./webpack.config.common");
const environment = require("./env/dev.env");

let webpackConfig = merge(commonConfig(true), {
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  output: {
    path: helpers.root("dist"),
    publicPath: "/",
    filename: "js/[name].bundle.js",
    chunkFilename: "js/[id].chunk.js"
  },
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      chunks: "all"
    }
  },
  plugins: [
    new webpack.EnvironmentPlugin(environment),
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsPlugin()
  ],
  devServer: {
    compress: true,
    historyApiFallback: true,
    hot: true,
    overlay: true,
    stats: {
      normal: true
    }
  }
});

webpackConfig = merge(webpackConfig, {
  entry: {
    main: helpers.root("src", "vinlottis-init")
  },
  plugins: [
    new HtmlPlugin({
      template: "src/templates/Index.html"
    })
  ]
});

module.exports = webpackConfig;
