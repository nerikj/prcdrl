const path = require('path');

module.exports = {
  entry: {
    index: './src/index.js',
    map_worker: './src/map_worker.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    contentBase: './dist',
  },
};
