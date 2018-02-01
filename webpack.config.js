const path = require('path');

module.exports = {
  entry: './src/frontend/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, './public/playground/search_auto_complete')
  },
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
