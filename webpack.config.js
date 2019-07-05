const path = require('path');

module.exports = {
  mode: 'development',

  devtool: 'source-map',

  devServer: {
    contentBase: path.join(__dirname, 'public'),
  },

  entry: {
    bundle: './src/index.ts',
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public/dist'),
    publicPath: 'dist/',
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
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
        enforce: 'pre',
        test: /.js$/,
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
}
