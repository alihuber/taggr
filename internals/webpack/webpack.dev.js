const webpack = require('webpack');
const path = require('path');
const { spawn } = require('child_process');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const plugins = [
  new HtmlWebPackPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development'),
  }),
];

const SRC_DIR = path.resolve(__dirname, '../../src');
const OUTPUT_DIR = path.resolve(__dirname, '../../dist');
const defaultInclude = SRC_DIR;

module.exports = {
  mode: 'development',
  entry: SRC_DIR + '/index.js',
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
        use: ['style-loader', 'css-loader'],
        include: [defaultInclude, /flexboxgrid/],
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
        include: defaultInclude,
      },
    ],
  },
  devServer: {
    hot: true,
    contentBase: OUTPUT_DIR,
    before: function() {
      spawn('electron', ['.'], { shell: true, env: process.env, stdio: 'inherit' })
        .on('close', code => process.exit(0))
        .on('error', spawnError => console.error(spawnError));
    },
  },
  plugins,
};
