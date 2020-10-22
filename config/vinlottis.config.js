"use strict";

const HtmlWebpackPlugin = require("html-webpack-plugin");
const helpers = require("./helpers");

const VinlottisConfig = {
  entry: {
    vinlottis: ["@babel/polyfill", helpers.root("src", "vinlottis-init")]
  },
  optimization: {
    minimizer: [
      new HtmlWebpackPlugin({
        chunks: ["vinlottis"],
        filename: "index.html",
        template: "./src/templates/Create.html",
        inject: true,
        minify: {
          removeComments: true,
          collapseWhitespace: false,
          preserveLineBreaks: true,
          removeAttributeQuotes: true
        }
      })
    ]
  }
};

module.exports = VinlottisConfig;
