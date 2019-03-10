const path = require('path');
const { spawn } = require('child_process');
const plugins = [];

module.exports = require('./webpack.base')({
  mode: 'production',
  devServer: {
    port: 3000,
    contentBase: path.join(process.cwd(), 'dist/'),
    before: function() {
      spawn('electron', ['.'], { shell: true, env: process.env, stdio: 'inherit' })
        .on('close', code => process.exit(0))
        .on('error', spawnError => console.error(spawnError));
    },
  },
  plugins,
});
