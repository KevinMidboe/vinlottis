"use strict";

const env = require("./env/lottery.config.js");
const webpack = require("webpack");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const HtmlPlugin = require("html-webpack-plugin");
const helpers = require("./helpers");

const webpackConfig = function(isDev) {
  return {
    resolve: {
      extensions: [".js", ".vue"],
      alias: {
        vue$: isDev ? "vue/dist/vue.min.js" : "vue/dist/vue.min.js",
        "@": helpers.root("src")
      }
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          use: [
            {
              loader: "vue-loader",
              options: {
                loaders: {
                  scss: "vue-style-loader!css-loader!sass-loader",
                  sass: "vue-style-loader!css-loader!sass-loader?indentedSyntax"
                }
              }
            }
          ]
        },
        {
          test: /\.js$/,
          loader: "babel-loader",
          include: [helpers.root("src")]
        },
        {
          test: /\.css$/,
          use: [
            isDev ? "vue-style-loader" : MiniCSSExtractPlugin.loader,
            { loader: "css-loader", options: { sourceMap: isDev } }
          ]
        },
        {
          test: /\.scss$/,
          use: [
            isDev ? "vue-style-loader" : MiniCSSExtractPlugin.loader,
            { loader: "css-loader", options: { sourceMap: isDev } },
            { loader: "sass-loader", options: { sourceMap: isDev } }
          ]
        },
        {
          test: /\.sass$/,
          use: [
            isDev ? "vue-style-loader" : MiniCSSExtractPlugin.loader,
            { loader: "css-loader", options: { sourceMap: isDev } },
            { loader: "sass-loader", options: { sourceMap: isDev } }
          ]
        },
        {
          test: /\.woff(2)?(\?[a-z0-9]+)?$/,
          loader: "url-loader?limit=10000&mimetype=application/font-woff"
        },
        {
          test: /\.(ttf|eot|svg)(\?[a-z0-9]+)?$/,
          loader: "file-loader"
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new webpack.DefinePlugin({
        __NAME__: JSON.stringify(env.name),
        __PHONE__: JSON.stringify(env.phone),
        __PRICE__: env.price,
        __MESSAGE__: JSON.stringify(env.message),
        __DATE__: env.date,
        __HOURS__: env.hours
      })
    ]
  };
};

module.exports = webpackConfig;
