/* eslint-disable */
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
module.exports = {
  devtool: 'source-map',
  entry: [path.join(__dirname, 'src/main/typescript/index.ts')],
  mode: 'production',
  externals: [nodeExternals()],
  plugins: [new CleanWebpackPlugin()],
  module: {
    rules: [
      {
        exclude: [path.resolve(__dirname, 'node_modules')],
        test: /\.ts$/,
        use: 'ts-loader',
      },
      {
        test: /\.graphql$/,
        exclude: [path.resolve(__dirname, 'node_modules')],
        loader: 'graphql-tag/loader',
      },
    ],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'build'),
  },
  resolve: {
    extensions: ['.ts', '.js', '.graphql'],
  },
  target: 'node',
};
