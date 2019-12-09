const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const root = path.resolve(__dirname, '..');

module.exports = {
  entry: {
    bundle: path.join(root, '/src/web/index.ts'),
  },

  output: {
    filename: '[name].js',
    path: path.resolve(root, 'dist'),
  },

  resolve: {
    extensions: ['.html', '.ts', '.tsx', '.js'],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader'],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(root, 'src/web/index.html'),
    }),
  ],
};
