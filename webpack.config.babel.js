'use strict';

import externals from 'webpack-node-externals';

export default {
  entry: './src/index.js',
  output: {
    path: './dist',
    filename: 'heat-templates.js',
    library: 'heat-templates',
    libraryTarget: 'umd'
  },
  target: 'node',
  externals: externals(),
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/
    }]
  }
};
