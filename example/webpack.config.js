const path = require('path');

module.exports = {
  entry: './src/browser-bundle.js',
  output: {
    filename: 'parser-bundle.js',
    path: path.resolve(__dirname, '.'),
    library: 'markdownStreamingParser',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  }
};
