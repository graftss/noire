const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common');

const root = path.resolve(__dirname, '..');

module.exports = merge(common, {
  mode: 'development',

  devtool: 'source-map',

  devServer: {
    contentBase: path.join(root, 'dist'),
  },

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
    ],
  },

  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },

  optimization: {
    minimize: false,
  },
});
