"use strict";

const env = require("./defaults/lottery");
const webpack = require("webpack");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const helpers = require("./helpers");

const webpackConfig = function(isDev) {
  return {
    resolve: {
      extensions: [".js", ".vue"],
      alias: {
        "vue$": "vue/dist/vue.min.js",
        "@": helpers.root("frontend"),
      },
    },
    entry: {
      vinlottis: helpers.root("frontend", "vinlottis-init"),
    },
    externals: {
      moment: "moment", // comes with chart.js
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
                  sass: "vue-style-loader!css-loader!sass-loader?indentedSyntax",
                },
              },
            },
          ],
        },
        {
          test: /\.js$/,
          use: ["babel-loader"],
          include: [helpers.root("frontend")],
        },
        {
          test: /\.css$/,
          use: [
            MiniCSSExtractPlugin.loader,
            { loader: "css-loader", options: { sourceMap: isDev } },
          ],
        },
        {
          test: /\.scss$/,
          use: [
            MiniCSSExtractPlugin.loader,
            { loader: "css-loader", options: { sourceMap: isDev } },
            { loader: "sass-loader", options: { sourceMap: isDev } },
          ],
        },
        {
          test: /\.woff(2)?(\?[a-z0-9]+)?$/,
          loader: "url-loader",
          options: {
            limit: 10000,
            mimetype: "application/font-woff",
          },
        },
        {
          test: /\.(ttf|eot|svg)(\?[a-z0-9]+)?$/,
          loader: "file-loader",
        },
      ],
    },
    plugins: [
      new VueLoaderPlugin(),
      new webpack.DefinePlugin({
        __ENV__: JSON.stringify(process.env.NODE_ENV),
        __NAME__: JSON.stringify(env.name),
        __PHONE__: JSON.stringify(env.phone),
        __PRICE__: env.price,
        __MESSAGE__: JSON.stringify(env.message),
        __DATE__: env.date,
        __HOURS__: env.hours,
        __PUSHENABLED__: JSON.stringify(require("./defaults/push") != false),
        __GA_TRACKINGID__: JSON.stringify(env.googleanalytics_trackingId),
        __GA_COOKIELIFETIME__: env.googleanalytics_cookieLifetime,
        __sites__: JSON.stringify(env.sites),
      }),
    ],
  };
};

module.exports = webpackConfig;
