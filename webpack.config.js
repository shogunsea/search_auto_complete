const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const isProduction = process.env.NODE_ENV === 'production';
const webpack = require('webpack');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production'),
    },
  }),
  new OptimizeCssAssetsPlugin(),
];

if (isProduction) {
  const uglifyJS = new UglifyJSPlugin({
    sourceMap: false,
    mangle: false,
  });
  plugins.push(uglifyJS);
}

module.exports = {
  entry: './src/frontend/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, './public/playground/search_auto_complete')
  },
  plugins: plugins,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          },
        },
      },
    ],
  },
};
