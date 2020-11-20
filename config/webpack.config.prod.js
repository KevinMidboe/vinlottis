"use strict";

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
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
    filename: "js/[name].bundle.[hash:7].js"
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
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        cssProcessorPluginOptions: {
          preset: ["default", { discardComments: { removeAll: true } }]
        }
      }),
      new UglifyJSPlugin({
        cache: true,
        parallel: false,
        sourceMap: !isProd
      })
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.EnvironmentPlugin(environment),
    new MiniCSSExtractPlugin({
      filename: "css/[name].[hash:7].css"
    })
  ]
});

if (!isProd) {
  webpackConfig.devtool = "source-map";

  if (process.env.npm_config_report) {
    const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
      .BundleAnalyzerPlugin;
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
  }
}

module.exports = webpackConfig;
