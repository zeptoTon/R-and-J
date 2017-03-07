var path = require('path');

const config  = {
  devtool: 'cheap-module-source-map',
  entry: {
    react: './jsx/react-index.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'js'),
    sourceMapFilename: '[name].map'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ["es2015", "react"]
            }
          },
        ],
      }
    ]
  }
};

module.exports = config;
