/* eslint-disable */
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const merge = require('webpack-merge');
const common = require('./webpack.config.js');

module.exports = merge.merge(common, {
  entry: [path.join(__dirname, 'src/main/typescript/index.ts')],
  mode: 'production',
});
