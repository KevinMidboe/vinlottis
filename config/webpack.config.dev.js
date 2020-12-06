"use strict";

const webpack = require("webpack");
const { merge } = require("webpack-merge");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const helpers = require("./helpers");
const commonConfig = require("./webpack.config.common");
const environment = require("./env/dev.env");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");

let webpackConfig = merge(commonConfig(true), {
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  output: {
    path: helpers.root("dist"),
    publicPath: "/",
    filename: "js/[name].bundle.js"
  },
  optimization: {
    concatenateModules: true,
    splitChunks: {
      chunks: "initial"
    }
  },
  plugins: [
    new webpack.EnvironmentPlugin(environment),
    new FriendlyErrorsPlugin(),
    new MiniCSSExtractPlugin({
      filename: "css/[name].css"
    })
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
  plugins: [
    new HtmlWebpackPlugin({
      template: "frontend/templates/Index.html"
    })
  ]
});

module.exports = webpackConfig;
