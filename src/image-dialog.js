const { dialog, ipcMain } = require('electron');
const fs = require('fs');
const os = require('os');
const path = require('path');

ipcMain.on('open-file-dialog-for-image', function(event) {
  const dialogOpts = {
    type: 'info',
    buttons: ['Ok'],
    title: 'Error',
    detail: 'File given was no image file!',
  };
  if (os.platform() === 'linux' || os.platform() === 'win32') {
    // TODO: test with other platforms
    dialog
      .showOpenDialog({
        properties: ['openFile'],
      })
      .then(files => {
        if (files) event.sender.send('selected-image', files[0]);
      });
  } else {
    dialog
      .showOpenDialog({
        properties: ['openFile'],
      })
      .then(files => {
        if (files && files.filePaths) {
          fs.stat(files.filePaths[0], (err, stats) => {
            if (stats.isFile()) {
              const ending = path.extname(files.filePaths[0]);
              if (!['.jpg', '.jpeg'].includes(ending)) {
                dialog.showMessageBox(dialogOpts, () => {});
              } else {
                const bitmap = fs.readFileSync(files.filePaths[0]);
                const encodedImg = Buffer(bitmap).toString('base64');
                event.sender.send('selected-image', encodedImg);
              }
            }
          });
        }
      });
  }
});
