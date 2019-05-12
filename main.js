// Import parts of electron to use
const { app, BrowserWindow, autoUpdater, dialog, ipcMain } = require('electron');
const ID3Writer = require('browser-id3-writer');
const url = require('url');
const os = require('os');
const fs = require('fs');
const path = require('path');
const ChildProcess = require('child_process');
const imagesPath = './images/cover.jpg';
const ID3Parser = require('id3-parser');
const last = require('lodash').last;
require('./express');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Keep a reference for dev mode
let dev = false;
if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
  dev = true;
}

// this should be placed at top of main.js to handle setup events quickly
if (!dev) {
  if (handleSquirrelEvent()) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
  }
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 850,
    show: false,
    // frame: false,
    resizable: false,
  });

  // and load the index.html of the app.
  let indexPath;
  if (dev && process.argv.indexOf('--noDevServer') === -1) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'index.html',
      slashes: true,
    });
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: __dirname + '/dist/index.html',
      slashes: true,
    });
  }

  mainWindow.loadURL(indexPath);

  // Don't show until we are ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    // Open the DevTools automatically if developing
    // if (dev) {
    //   mainWindow.webContents.openDevTools();
    // }
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    try {
      fs.unlinkSync(imagesPath);
    } catch (err) {
      console.log('error removing cover file..');
    }
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

function handleSquirrelEvent() {
  if (process.argv.length === 1) {
    return false;
  }

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function(command, args) {
    let spawnedProcess, error;

    try {
      spawnedProcess = ChildProcess.spawn(command, args, { detached: true });
    } catch (error) {}

    return spawnedProcess;
  };

  const spawnUpdate = function(args) {
    return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      // Optionally do things such as:
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      // Install desktop and start menu shortcuts
      spawnUpdate(['--createShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Remove desktop and start menu shortcuts
      spawnUpdate(['--removeShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated

      app.quit();
      return true;
  }
}

const DOMAIN = '<update-domain-here>';
const suffix = process.platform === 'darwin' ? `/RELEASES.json?method=JSON&version=${app.getVersion()}` : '';
// this just has to point to an HTTP server containing the "releases" and nupkg files
if (!dev) {
  autoUpdater.setFeedURL({
    url: `${DOMAIN}/Taggr/<ID>/${process.platform}/${process.arch}${suffix}`,
    serverType: 'json',
  });
  setInterval(() => {
    autoUpdater.checkForUpdates();
  }, 60000);
  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    const dialogOpts = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Application Update',
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail: 'A new version has been downloaded. Restart the application to apply the updates.',
    };

    dialog.showMessageBox(dialogOpts, response => {
      if (response === 0) autoUpdater.quitAndInstall();
    });
  });
}

const buildImage = imageBuffer => {
  fs.writeFileSync(imagesPath, imageBuffer);
};

const _loadMetadata = filePaths => {
  const metadata = [];
  filePaths.forEach((filepath, idx) => {
    const songBuffer = fs.readFileSync(filepath);
    const data = ID3Parser.parse(songBuffer);
    const fileName = last(filepath.split('/'));
    const comment = data.comments[0] && data.comments[0].value;
    let cover = '';
    if (data.image && data.image.data) {
      buildImage(data.image.data);
      cover = imagesPath;
    }
    const obj = {
      numbering: data.track,
      title: data.title,
      artist: data.band,
      fileName,
      albumArtist: data.artist,
      album: data.album,
      genre: data.genre,
      year: data.year,
      comment,
      cover,
      selected: false,
    };
    metadata.push(obj);
  });

  return metadata;
};

ipcMain.on('open-file-dialog-for-files', function(event) {
  const dialogOpts = {
    type: 'info',
    buttons: ['Ok'],
    title: 'Error',
    detail: 'File given was no .mp3 file!',
  };
  if (os.platform() === 'linux' || os.platform() === 'win32') {
    // TODO: test with other platforms
    dialog.showOpenDialog(
      {
        properties: ['openFile'],
      },
      function(files) {
        if (files) event.sender.send('selected-files', files[0]);
      }
    );
  } else {
    dialog.showOpenDialog(
      {
        properties: ['openFile', 'openDirectory'],
      },
      function(files) {
        if (files) {
          fs.stat(files[0], (err, stats) => {
            if (stats.isFile()) {
              const ending = path.extname(files[0]);
              if (ending !== '.mp3') {
                dialog.showMessageBox(dialogOpts, () => {});
              } else {
                const fileData = {};
                fileData.paths = [files[0]];
                fileData.presentMetadata = _loadMetadata([files[0]]);
                event.sender.send('selected-files', fileData);
              }
            } else if (stats.isDirectory()) {
              fs.readdir(files[0], (err, paths) => {
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
                  collectedPaths.push(path.join(files[0], filePath));
                });
                fileData.paths = collectedPaths;
                fileData.presentMetadata = _loadMetadata(collectedPaths);
                event.sender.send('selected-files', fileData);
              });
            }
          });
        }
      }
    );
  }
});

ipcMain.on('open-file-dialog-for-image', function(event) {
  const dialogOpts = {
    type: 'info',
    buttons: ['Ok'],
    title: 'Error',
    detail: 'File given was no image file!',
  };
  if (os.platform() === 'linux' || os.platform() === 'win32') {
    // TODO: test with other platforms
    dialog.showOpenDialog(
      {
        properties: ['openFile'],
      },
      function(files) {
        if (files) event.sender.send('selected-image', files[0]);
      }
    );
  } else {
    dialog.showOpenDialog(
      {
        properties: ['openFile'],
      },
      function(files) {
        if (files) {
          fs.stat(files[0], (err, stats) => {
            if (stats.isFile()) {
              const ending = path.extname(files[0]);
              if (!['.jpg', '.jpeg'].includes(ending)) {
                dialog.showMessageBox(dialogOpts, () => {});
              } else {
                try {
                  fs.unlinkSync(imagesPath);
                } catch (err) {
                  console.log('error removing cover file..');
                }
                fs.copyFile(files[0], imagesPath, err => {
                  if (err) throw err;
                  console.log('copied cover file');
                });
                event.sender.send('selected-image', files[0]);
              }
            }
          });
        }
      }
    );
  }
});

ipcMain.on('filename-error', function() {
  const dialogOpts = {
    type: 'info',
    buttons: ['Ok'],
    title: 'Error',
    detail: 'File names could not be set',
  };
  dialog.showMessageBox(dialogOpts, () => {});
});

ipcMain.on('clear-data', function() {
  try {
    fs.unlinkSync(imagesPath);
  } catch (err) {
    console.log('error removing cover file..');
  }
});

ipcMain.on('save-metadata', function(event, context) {
  const dialogOpts = {
    type: 'info',
    buttons: ['Ok'],
    title: 'Success',
    detail: 'Files sucessfully saved',
  };
  const length = context.filePaths.length;
  let coverBuffer;
  context.filePaths.forEach((filepath, idx) => {
    const songBuffer = fs.readFileSync(filepath);
    const metadata = context.filesMetadata[idx];
    if (metadata.cover.length !== 0) {
      coverBuffer = fs.readFileSync(metadata.cover);
    }
    const title = metadata.title;
    const album = metadata.album;
    const artist = [metadata.artist];
    const albumArtist = metadata.albumArtist;
    const genre = [metadata.genre];
    const year = Number(metadata.year);
    const comment = metadata.comment;
    const numbering = metadata.numbering;
    const writer = new ID3Writer(songBuffer);
    // TIT2 (song title)
    // TALB (album title)
    // TPE1 (song artists) ARRAY
    // TPE2 (album artist)
    // TRCK (song number in album): '5' or '5/10'
    // TYER (album release year) NUMBER
    // TCON (song genres) ARRAY
    writer
      .setFrame('TIT2', title)
      .setFrame('TALB', album)
      .setFrame('TPE1', artist)
      .setFrame('TPE2', albumArtist)
      .setFrame('TRCK', numbering)
      .setFrame('TCON', genre)
      .setFrame('TYER', year)
      .setFrame('COMM', {
        description: 'Comment',
        text: comment,
      });
    if (coverBuffer) {
      writer.setFrame('APIC', {
        type: 3, // cover front
        data: coverBuffer,
        description: 'Cover',
      });
    }
    writer.addTag();

    const taggedSongBuffer = Buffer.from(writer.arrayBuffer);
    fs.writeFileSync(filepath, taggedSongBuffer);
    if (idx === length - 1) {
      dialog.showMessageBox(dialogOpts, () => {});
    }
  });
});
