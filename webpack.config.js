const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'game.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  devServer: {
    static: './dist',
    port: 3000,
    hot: true
  },
  mode: 'development'
};
