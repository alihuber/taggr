var electronInstaller = require('electron-winstaller');
resultPromise = electronInstaller.createWindowsInstaller({
  appDirectory: './builds/Taggr',
  outputDirectory: './builds/win/',
  authors: 'alihuber',
  exe: 'Taggr.exe',
  // iconUrl: 'file:./src/assets/node.ico',
  // setupIcon: 'file:./src/assets/node.ico',
  setupExe: 'TaggrSetup.exe',
});

resultPromise.then(() => console.log('It worked!'), e => console.log(`No dice: ${e.message}`));
