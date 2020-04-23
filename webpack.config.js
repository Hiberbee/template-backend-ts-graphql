/* eslint-disable */
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
module.exports = {
  devtool: 'source-map',
  externals: [nodeExternals()],
  plugins: [new CleanWebpackPlugin()],
  module: {
    rules: [
      {
        exclude: [path.resolve(__dirname, 'node_modules')],
        test: /\.ts$/,
        use: 'ts-loader',
      },
      { test: /\.graphql?$/, loader: 'webpack-graphql-loader', options: { output: 'document' } },
    ],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'build'),
  },
  resolve: {
    extensions: ['.ts', '.js', '.json', '.graphql'],
  },
  target: 'node',
};
