const rules = require('./webpack.rules');
const path = require('path');
const SRC_DIR = path.resolve(__dirname, './src');
const defaultInclude = SRC_DIR;

rules.push(
  {
    test: /\.css$/,
    use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
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
  }
);

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
};
