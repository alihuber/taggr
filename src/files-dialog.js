const { dialog, ipcMain } = require('electron');
const os = require('os');
const path = require('path');
const fs = require('fs');
const { _loadMetadata } = require('./metadata-loader');

ipcMain.on('open-file-dialog-for-files', function(event) {
  const dialogOpts = {
    type: 'info',
    buttons: ['Ok'],
    title: 'Error',
    detail: 'File given was no .mp3 file!',
  };
  if (os.platform() === 'linux' || os.platform() === 'win32') {
    // TODO: test with other platforms
    dialog
      .showOpenDialog({
        properties: ['openFile'],
      })
      .then(files => {
        if (files) event.sender.send('selected-files', files[0]);
      });
  } else {
    dialog
      .showOpenDialog({
        properties: ['openFile', 'openDirectory'],
      })
      .then(files => {
        if (files && files.filePaths) {
          fs.stat(files.filePaths[0], (err, stats) => {
            if (stats.isFile()) {
              const ending = path.extname(files.filePaths[0]);
              if (ending !== '.mp3') {
                dialog.showMessageBox(dialogOpts, () => {});
              } else {
                const fileData = {};
                fileData.paths = [files.filePaths[0]];
                fileData.presentMetadata = _loadMetadata([files.filePaths[0]]);
                event.sender.send('selected-files', fileData);
              }
            } else if (stats.isDirectory()) {
              fs.readdir(files.filePaths[0], (err, paths) => {
                if (err) {
                  console.log(err);
                  return;
                }
                const collectedPaths = [];
                const fileData = {};
                paths.forEach(filePath => {
                  const ending = path.extname(filePath);
                  if (ending !== '.mp3') {
                    return;
                  }
                  collectedPaths.push(path.join(files.filePaths[0], filePath));
                });
                fileData.paths = collectedPaths;
                fileData.presentMetadata = _loadMetadata(collectedPaths);
                event.sender.send('selected-files', fileData);
              });
            }
          });
        }
      });
  }
});
