"use strict";

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const helpers = require("./helpers");
const commonConfig = require("./webpack.config.common");

const isProd = process.env.NODE_ENV === "production";
const environment = isProd
  ? require("./env/prod.env")
  : require("./env/staging.env");

const webpackConfig = merge(commonConfig(false), {
  mode: "production",
  stats: { children: false },
  output: {
    path: helpers.root("public/dist"),
    publicPath: "/public/dist/",
    filename: "js/[name].bundle.[fullhash:7].js"
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: "styles",
          test: /\.css$/,
          chunks: "all",
          enforce: true
        }
      }
    },
    minimize: true,
    minimizer: [
      new HtmlWebpackPlugin({
        chunks: ["vinlottis"],
        filename: "index.html",
        template: "./frontend/templates/Index.html",
        inject: true,
        minify: {
          removeComments: true,
          collapseWhitespace: false,
          preserveLineBreaks: true,
          removeAttributeQuotes: true
        }
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorPluginOptions: {
          preset: ["default", { discardComments: { removeAll: true } }]
        }
      }),
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
      })
    ]
  },
  plugins: [
    new CleanWebpackPlugin(), // clean output folder
    new webpack.EnvironmentPlugin(environment),
    new MiniCSSExtractPlugin({
      filename: "css/[name].[fullhash:7].css"
    })
  ]
});

if (!isProd) {
  webpackConfig.devtool = "source-map";
}

if (process.env.BUILD_REPORT) {
  const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;
  webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
