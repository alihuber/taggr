const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const SRC_DIR = path.resolve(__dirname, '../../src');
const OUTPUT_DIR = path.resolve(__dirname, '../../dist');
const defaultInclude = [SRC_DIR];

const plugins = [
  new HtmlWebPackPlugin({
    inject: true,
    template: SRC_DIR + '/index.html',
  }),
];

module.exports = options => ({
  mode: options.mode,
  entry: {
    javascript: SRC_DIR + '/index.js',
  },
  target: 'electron-renderer',
  output: {
    path: OUTPUT_DIR,
    publicPath: '/',
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['css-loader'],
        include: defaultInclude,
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
    ],
  },
  devServer: options.devServer,
  plugins: options.plugins.concat(plugins),
});
