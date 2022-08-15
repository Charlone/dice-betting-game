const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

process.env.NODE_ENV = "development";

module.exports = {
  entry: path.resolve(__dirname, './src/index.js'),
  devtool: "cheap-module-source-map",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      },
      {
        test: /\.(scss|css)$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader"},
          { loader: "sass-loader" }
        ]
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js'
  },
  plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        template: "./src/index.html",
      }),
    new CleanWebpackPlugin()
  ],
  devServer: {
    static: path.resolve(__dirname, './dist'),
    hot: true,
    open: true,
    historyApiFallback: true
  },
};
