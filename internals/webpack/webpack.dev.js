const webpack = require('webpack');
const { spawn } = require('child_process');

const plugins = [new webpack.HotModuleReplacementPlugin()];

module.exports = require('./webpack.base')({
  mode: 'development',
  devServer: {
    hot: true,
    port: 3000,
    before: function() {
      spawn('electron', ['.'], { shell: true, env: process.env, stdio: 'inherit' })
        .on('close', code => process.exit(0))
        .on('error', spawnError => console.error(spawnError));
    },
  },
  plugins,
});
