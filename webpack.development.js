/* eslint-disable */
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const merge = require('webpack-merge');
const common = require('./webpack.config.js');
const webpack = require('webpack');

module.exports = merge.merge(common, {
  devtool: 'inline-source-map',
  mode: 'development',
  entry: ['webpack/hot/poll?1000', path.join(__dirname, 'src/main/typescript/index.ts')],
  externals: [
    nodeExternals({
      whitelist: ['webpack/hot/poll?1000'],
    }),
  ],
  plugins: [new webpack.HotModuleReplacementPlugin()],
  watch: true,
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    compress: true,
    port: 3000,
    allowedHosts: ['.localhost'],
  },
});
